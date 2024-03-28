from dotenv import load_dotenv

from util import serialize_product

load_dotenv()
from flask import Flask, jsonify, request

from search import text_search_all

DEBUG = True

app = Flask(__name__)

@app.route('/search')
def users():
	print('pain')
	query = request.args.get("query")
	if not query:
		return "You must put a query!", 400

	products = text_search_all(query)
	serialized = [serialize_product(p) for p in products]
	return jsonify(*serialized)

if __name__ == '__main__':
	if not DEBUG:
		app.run(host="0.0.0.0", port=5001)
	else:
		app.run(debug=True, port=8000)
