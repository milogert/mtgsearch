// Database constants.
FROMDB = "test";
TODB = "cards2";

// Get the mongo connection.
var aConn = new Mongo();

// Get the database.
var aDb = aConn.getDB("mtg");

// Get the cursor for the whole collection.
var aCursor = aDb[FROMDB].find({layout: {$ne: "vanguard"}});

// Start the loop.
while(aCursor.hasNext()) {
  // Get the old document.
  var aOldDoc = aCursor.next();

  // Set the reprint status.
  var aReprint = false;

  var aTestCursor = aDb[TODB].find({name: aOldDoc["name"]});
  var aSize = aTestCursor.size();
  if(aSize == 1) {
    aReprint = true;
  } else if(aSize > 1) {
    print("-- Too many: " + aTestCursor.next()["name"] + "\n");
    continue;
  }

  // Query the collection based on the name.
  var aDoc = aDb[FROMDB].findOne({
      name: aOldDoc["name"],
      layout: {$ne: "vanguard"}
  });

  // Set the printing count.
  var aCount = aReprint ? aDoc["printings"].length - 1 : 0;

  // Create the printings and legalities array.
  var aPrintings = [];
  var aLegalities = [];

  if(aReprint) {
    var aExitstingDoc = aTestCursor.next();
    aPrintings = aExitstingDoc["printings"];
  }

  aPrintings.push({
      "multiverseid": NumberInt(aDoc["multiverseid"]),
      "printing": aDoc["printings"][aCount],
      "number": aDoc["number"],
      "rarity": aDoc["rarity"],
      "artist": aDoc["artist"],
      "flavor": aDoc["flavor"]
  });

  if(aCount == 0 || aReprint) {
    for(var k in aDoc["legalities"]) {
      aLegalities.push(
         {"format": k, "status": aDoc["legalities"][k]}
      );
    }
  }

  // Remove old values.
  delete aDoc["multiverseid"];
  delete aDoc["number"];
  delete aDoc["rarity"];
  delete aDoc["artist"];
  delete aDoc["flavor"];

  // Add the new data.
  aDoc["printings"] = aPrintings;
  aDoc["legalities"] = aLegalities;

  if(aDoc["name"] == "Welkin Tern"){
    print(aPrintings)
    print(aDoc["printings"]);
    print(aPrintings == aDoc["printings"])
  }

  // Insert the document into the collection.
  //if(aReprint) {
  //  aDb[TODB].insert(aDoc);
  //} else {
    aDb[TODB].update({name: aDoc["name"]},
      {"$set": {
        "printings": aPrintings,
        "legalities": aLegalities
      }},
      {upsert: true}
    );
  //}
}
