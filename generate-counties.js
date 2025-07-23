const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "src", "assets", "data", "evaluare");
const outputFile = path.join(
  __dirname,
  "src",
  "assets",
  "data",
  "evaluare",
  "counties.json"
);

const displayNames = {
  brasov: "Brașov",
  bucuresti: "București",
};

try {
  const counties = fs
    .readdirSync(dataPath)
    .filter((file) => fs.statSync(path.join(dataPath, file)).isDirectory())
    .map((folder) => ({
      id: folder,
      name:
        displayNames[folder] ||
        folder.charAt(0).toUpperCase() + folder.slice(1),
    }));

  fs.writeFileSync(outputFile, JSON.stringify(counties, null, 2));
  console.log("✅ counties.json updated successfully!");
} catch (error) {
  console.error("Error generating counties.json:", error);
}
