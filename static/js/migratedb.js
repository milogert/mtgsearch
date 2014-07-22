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
  } else if(aTestCursor.size() > 1) {
    console.log("-- Too many: " + aTestCursor.next()["name"] + "\n");
  }

  // Query the collection based on the name.
  var aCurrCursor = aDb[FROMDB].find({
      name: aOldDoc["name"],
      layout: {$ne: "vanguard"}
  }).sort({multiverseid: 1});

  // Set the printing count.
  var aCount = aReprint ? aTestCursor.next()["printings"].length : 0;

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
    aDb[TODB].update(
      {name: aDoc["name"]},
      {$push: {printings: {
          "multiverseid": Math.floor(aDoc["multiverseid"]),
          "printing": aDoc["printings"][aCount],
          "number": aDoc["number"],
          "rarity": aDoc["rarity"]
      }}},
      {upsert: true}
    );

    if(aCount == 0 || aReprint) {
      for(var k in aDoc["legalities"]) {
        aDb[TODB].update(
          {name: aDoc["name"]},
          {$push: {
            legalities: {"format": k, "status": aDoc["legalities"][k]}
          }}
        );
      }
    }

    // Increment the count.
    aCount++;
  }

  // Remove old values.
  delete aDoc["multiverseid"];
  delete aDoc["number"];
  delete aDoc["rarity"];

  // Insert the document into the collection.
  if(!aReprint) {
    aDb[TODB].insert(aDoc);
  }
}
