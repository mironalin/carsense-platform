// src/scripts/import-dtc-codes.ts

import fs from "node:fs";
import path from "node:path";

import { db } from "@/db/index";

import { DTCLibraryTable } from "../db/schema/dtc-library-schema";

// Function to determine severity based on code type
function determineSeverity(code: string): "low" | "medium" | "high" {
  // Usually, P codes are engine/powertrain, B codes are body,
  // C codes are chassis, U codes are network/communication
  const firstChar = code[0];

  switch (firstChar) {
    case "P": return "high"; // Powertrain issues often affect drivability
    case "C": return "medium"; // Chassis issues can affect safety but may not be immediate
    case "B": return "low"; // Body issues are often comfort/convenience
    case "U": return "medium"; // Network/communication can affect various systems
    default: return "medium";
  }
}

// Function to determine the affected system based on the category
function determineAffectedSystem(category: string): string {
  switch (category) {
    case "Powertrain": return "Engine and Transmission";
    case "Body": return "Body Electronics";
    case "Chassis": return "Suspension and Braking";
    case "Network": return "Communication Systems";
    case "NetworkCommunication": return "Communication Systems";
    default: return "Unknown";
  }
}

async function importDTCCodes() {
  try {
    // Read the JSON file
    const dtcFilePath = path.join(process.cwd(), "DTC.json");
    const dtcData = JSON.parse(fs.readFileSync(dtcFilePath, "utf-8"));

    const dtcEntries: Array<{
      code: string;
      description: string;
      category: string;
      severity: "low" | "medium" | "high";
      affectedSystem: string;
    }> = [];

    // Process each entry from the JSON file
    for (const entry of dtcData) {
      const code = entry.code;
      const category = entry.category;
      const description = entry.description;

      // Determine severity and affected system
      const severity = determineSeverity(code);
      const affectedSystem = determineAffectedSystem(category);

      dtcEntries.push({
        code,
        description,
        category,
        severity,
        affectedSystem,
      });
    }

    console.log(`Found ${dtcEntries.length} DTC codes to import`);

    // Insert the entries in batches to avoid overwhelming the database
    const batchSize = 100;
    for (let i = 0; i < dtcEntries.length; i += batchSize) {
      const batch = dtcEntries.slice(i, i + batchSize);
      await db.insert(DTCLibraryTable).values(batch).onConflictDoNothing();
      console.log(`Imported batch ${i / batchSize + 1} of ${Math.ceil(dtcEntries.length / batchSize)}`);
    }

    console.log("DTC code import completed successfully");
  }
  catch (error) {
    console.error("Error importing DTC codes:", error);
  }
}

// Run the import function
importDTCCodes();
