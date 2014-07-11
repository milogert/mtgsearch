__author__ = 'Milo'


from flask.ext.mongoengine import MongoEngine
from mongoengine import *


class Card(Document):
  """The card class."""
  name = StringField()
  multiverseid = IntField()
  text = StringField()

  _type = StringField()
  supertypes = ListField(StringField())
  types = ListField(StringField())
  subtypes = ListField(StringField())

  manaCost = StringField()
  cmc = IntField()
  colors = ListField(StringField())

  power = StringField()
  toughness = StringField()
  loyalty = IntField()

  flavor = StringField()
  artist = StringField()
  number = IntField()
  printings = ListField(StringField())
  legalities = ListField(StringField())

  imageName = StringField()


class Sets(Document):
  """The set class."""
  name = StringField()
  code = StringField()
  gathererCode = StringField()
  releaseDate = StringField()
  border = StringField()
  _type = StringField()
  booster = ListField(StringField())

