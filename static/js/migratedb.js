// Database constants.
FROMDB = "cardsOld";
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
    continue;
  } else if(aTestCursor.size() > 1) {
    print("-- Too many: " + aTestCursor.next()["name"] + "\n");
  }

  // Query the collection based on the name.
  var aCurrCursor = aDb[FROMDB].find({
      name: aOldDoc["name"],
      layout: {$ne: "vanguard"}
  }).sort({multiverseid: 1});

  // Set the printing count.
  var aCount = 0;

  // Create the printings and legalities array.
  var aPrintings = [];
  var aLegalities = [];

  // Create the document variable to use after the loop.
  var aDoc;

  // Loop through the query.
  while(aCurrCursor.hasNext()) {
    // Grab the current document.
    aDoc = aCurrCursor.next();

    // Grab the data from the document, append it to the appropriate array.
    aPrintings.push({
        "multiverseid": NumberInt(aDoc["multiverseid"]),
        "printing": aDoc["printings"][aCount],
        "number": aDoc["number"],
        "rarity": aDoc["rarity"],
        "artist": aDoc["artist"],
        "flavor": aDoc["flavor"]
    });

    if(aDoc["name"] == "Welkin Tern") {
      printjson(aPrintings);
    }

    if(aCount == 0) {
      var aLegalities = [];
      for(var k in aDoc["legalities"]) {
        aLegalities.push(
           {"format": k, "status": aDoc["legalities"][k]}
        )
      }
    }

    // Increment the count.
    aCount++;
  }

  // Remove old values.
  delete aDoc["multiverseid"];
  delete aDoc["number"];
  delete aDoc["rarity"];
  delete aDoc["artist"];
  delete aDoc["flavor"];

  // Add the new values in.
  aDoc["printings"] = aPrintings;
  aDoc["legalities"] = aLegalities;

  // Insert the document into the collection.
  aDb[TODB].insert(aDoc);
}
