// This script will be executed when MongoDB container starts
// It will load all JSON files from the init directory

const fs = require("fs");
const path = require("path");

// Function to convert Extended JSON to BSON
function convertExtendedJSON(data) {
  if (Array.isArray(data)) {
    return data.map((item) => convertExtendedJSON(item));
  }
  if (data && typeof data === "object") {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      if (key === "_id" && value && value.$oid) {
        result[key] = ObjectId(value.$oid);
      } else if (value && value.$date) {
        result[key] = new Date(value.$date);
      } else if (value && value.$binary) {
        result[key] = BinData(
          parseInt(value.$binary.subType),
          value.$binary.base64
        );
      } else if (value && typeof value === "object") {
        result[key] = convertExtendedJSON(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
  return data;
}

// Function to load and insert JSON data
function loadJsonData(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const collectionName = path.basename(filePath, ".json");

    // Create the collection if it doesn't exist
    if (!db.getCollectionNames().includes(collectionName)) {
      db.createCollection(collectionName);
    }

    // Convert Extended JSON to BSON and insert
    if (Array.isArray(data)) {
      const convertedData = convertExtendedJSON(data);
      db[collectionName].insertMany(convertedData);
      print(
        `Loaded ${data.length} documents into ${collectionName} collection`
      );
    } else {
      print(`Error: Data in ${filePath} is not an array`);
    }
  } catch (error) {
    print(`Error loading ${filePath}: ${error.message}`);
  }
}

// Get all JSON files from the init directory
const initDir = "/docker-entrypoint-initdb.d";
const files = fs
  .readdirSync(initDir)
  .filter((file) => file.endsWith(".json"))
  .sort(); // Sort to ensure consistent loading order

// Load each JSON file
files.forEach((file) => {
  const filePath = path.join(initDir, file);
  print(`Processing file: ${file}`);
  loadJsonData(filePath);
});
