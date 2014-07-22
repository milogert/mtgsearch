__author__ = 'Milo'


from flask.ext.mongoengine import MongoEngine
from mongoengine import *


class Cards(Document):
  """The card class."""
  name = StringField()
  multiverseid = IntField()
  text = StringField()

  type = StringField()
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


class Cards2(Document):
  """Class for the test database."""
  meta = {'collection': 'cards2'}

  name = StringField()
  multiverseid = IntField()
  text = StringField()

  type = StringField()
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

  imageName = StringField()

  meta = {'collection': 'cards2'}


class Sets(Document):
  """The set class."""
  name = StringField()
  code = StringField()
  gathererCode = StringField()
  releaseDate = StringField()
  border = StringField()
  type = StringField()
  booster = ListField(StringField())

