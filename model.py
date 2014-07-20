__author__ = "Milo"

from bson import json_util
import json
from db import Cards, Sets


def search(theQuery):
  """Do a basic search on the names."""
  # Convert theQuery to regex queries.
  aMongoQuery = {}
  for k, v in theQuery.iteritems():
    aMongoQuery[k] = {"$regex": v, "$options": "i"}

  #raise ImportError
  return json.loads(Cards.objects(**aMongoQuery).to_json())

def getCardById(theCardId):
  """Get a specific by multiverse id."""
  # raise ImportError
  return json.loads(Cards.objects(multiverseid=theCardId)[0].to_json())


def getSets():

  return

