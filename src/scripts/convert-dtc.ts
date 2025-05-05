import fs from "node:fs";
import path from "node:path";

// Input and output file paths
const inputFile = path.join(process.cwd(), "DTC.bin");
const outputFile = path.join(process.cwd(), "DTC.json");

// Read the input file
const content = fs.readFileSync(inputFile, "utf8");

// Process content
const lines = content.split("\n");
const dtcEntries: Array<{
  code: string;
  category: string;
  description: string;
}> = [];

// Variables to track the current code and its properties
let currentCode = "";
let currentCategory = "";
let currentDescription = "";

// Process each line
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  // Skip C# namespace, using statements, and other non-DTC content
  if (line.startsWith("using") || line.startsWith("namespace")
    || line === "{" || line === "}" || line === ""
    || line.startsWith("public enum") || line.startsWith("///")) {
    continue;
  }

  // Extract the DTC code and hex value
  const codeMatch = line.match(/([PCBU][0-9A-F]{4})\s*=\s*0x[0-9A-F]+,?/);
  if (codeMatch) {
    currentCode = codeMatch[1];
    continue;
  }

  // Extract the category and description
  const categoryMatch = line.match(/\[Category\(Categories\.([^)]+)\),\s*Description\("([^"]+)"\)\]/);
  if (categoryMatch) {
    currentCategory = categoryMatch[1];
    currentDescription = categoryMatch[2];

    // Add the complete entry if we have all fields
    if (currentCode && currentCategory && currentDescription) {
      dtcEntries.push({
        code: currentCode,
        category: currentCategory,
        description: currentDescription,
      });

      // Reset for the next entry
      currentCode = "";
      currentCategory = "";
      currentDescription = "";
    }
  }
}

// Write the output file as JSON
fs.writeFileSync(outputFile, JSON.stringify(dtcEntries, null, 2), "utf8");

console.log(`Conversion complete. Created ${outputFile} with ${dtcEntries.length} DTC entries.`);
