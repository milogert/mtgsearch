
from db import Card, Sets
from flask import Flask, render_template
from flask.ext.mongoengine import MongoEngine
import model
from werkzeug.routing import BaseConverter

# Create the application.
app = Flask(__name__)

# Configure the application.
app.config.from_pyfile("config.py")

# Create the mongo database object.
theDb = MongoEngine(app)

# Set up regular expressions in routing.
class RegexConverter(BaseConverter):
  def __init__(self, url_map, *items):
    super(RegexConverter, self).__init__(url_map)
    self.regex = items[0]

app.url_map.converters['regex'] = RegexConverter


@app.route('/')
def index():
  return render_template("index.html", theSets=Sets.objects)

@app.route("/advanced")
def advanced():
  return render_template("advanced.html")

# Route to set pages.
@app.route('/<regex("[a-z0-9][a-z0-9][a-z0-9]"):theSet')
def setList(theSet):
  return render_template("setList.html", theSet=theSet)

if __name__ == '__main__':
  app.run()
