#!exec python2

from db import Cards, Sets
from flask import Flask, render_template, request
from flask.ext.mongoengine import MongoEngine
import json
import model
import urllib
from werkzeug.routing import BaseConverter

# Constants.
API_VERSION = "0.1"

# Create the application.
app = Flask(__name__)

# Configure the application.
app.config.from_pyfile("config.py")

# Create the mongo database object.
theDb = MongoEngine(app)

# Set up regular expressions in routing.
#class RegexConverter(BaseConverter):
#  def __init__(self, url_map, *items):
#    super(RegexConverter, self).__init__(url_map)
#    self.regex = items[0]

#app.url_map.converters['regex'] = RegexConverter


@app.route('/')
def index():
  aSets = Sets.objects[0:3].order_by("-releaseDate")
  return render_template("index.html", theSets=aSets)

@app.route("/advanced")
def advanced():
  return render_template("advanced.html")

@app.route("/doSearch")
def doSearch():
  # Get the query out of the url.
  aQuery = request.args.to_dict()

  # Call another function which will return a python dictionary.
  aResults = model.search(aQuery)

  # Return a rendered template with the query and the results.
  return render_template(
      "results.html",
      theQuery=urllib.urlencode(aQuery),
      theResults=aResults
  )

@app.route("/api/v" + API_VERSION)
def apiSearch():
  pass
  

# Route to set pages.
#@app.route('/<regex("[a-z0-9][a-z0-9][a-z0-9]"):theSet')
#def setList(theSet):
#  return render_template("setList.html", theSet=theSet)

if __name__ == '__main__':
  app.run(host="0.0.0.0")
