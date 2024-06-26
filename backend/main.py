import json

from dotenv import load_dotenv

from util import longest_common_substring, serialize_product

load_dotenv()
from flask import Flask, jsonify, request

from search import images_search_all, text_search_all

DEBUG = False

app = Flask(__name__)

@app.route('/search')
def search():
	print('pain')
	query = request.args.get("query")
	if not query:
		return "You must put a query!", 400

	products = text_search_all(query)
	products = [serialize_product(p) for p in products if p != None]
	names = [name for p in products if (name := p.get("name", None)) != None]
	name =longest_common_substring(names, threshold=30)
	res = {
		"name": name if len(name) >= 5 else query,
		"products": products
	}

	with open("res-search.json", "w") as f:
		f.write(json.dumps(res))

	return jsonify(res)

@app.route("/images", methods=["POST"])
def images():
	# files = list(request.files.values())
	# file = files[0]

	# print(file.stream)
	images = images_search_all(request.files.values())
	print(images)

	return jsonify({
		"products": images
	})

if __name__ == '__main__':
	if not DEBUG:
		app.run(host="0.0.0.0", port=5001)
	else:
		app.run(debug=True, port=8000)
