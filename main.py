
from db import Card, Sets
from flask import Flask, render_template
from flask.ext.mongoengine import MongoEngine
import model

# Create the application.
app = Flask(__name__)

# Configure the application.
app.config.from_pyfile("config.py")

# Create the mongo database object.
theDb = MongoEngine(app)

@app.route('/')
def index():
  return render_template("index.html", theSets=Sets.objects)

if __name__ == '__main__':
  app.run()
