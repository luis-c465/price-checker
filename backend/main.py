from dotenv import load_dotenv

from util import serialize_product

load_dotenv()
from flask import Flask, jsonify, request

from search import text_search_all

app = Flask(__name__)

@app.route('/search')
def users():
	query = request.args.get("query")
	if not query:
		return "You must put a query!", 400
	products = text_search_all(query)
	serialized = [serialize_product(p) for p in products]
	return jsonify(*serialized)

if __name__ == '__main__':
	app.run(debug=True)
