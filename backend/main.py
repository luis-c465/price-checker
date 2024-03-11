from sqlite3 import dbapi2 as sqlite3

from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def users():
	return jsonify(hello='world')

if __name__ == '__main__':
	app.run(debug=True)
