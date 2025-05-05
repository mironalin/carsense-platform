// src/scripts/import-dtc-codes.ts

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import fs from "fs";
import path from "path";
import { DTCLibraryTable, severityEnum } from "../db/schema/dtc-library-schema";
import { db } from "@/db/index";

// Function to determine severity based on code type
function determineSeverity(code: string): "low" | "medium" | "high" {
  // Usually, P codes are engine/powertrain, B codes are body,
  // C codes are chassis, U codes are network/communication
  const firstChar = code[0];
  
  switch (firstChar) {
    case 'P': return "high";    // Powertrain issues often affect drivability
    case 'C': return "medium";  // Chassis issues can affect safety but may not be immediate
    case 'B': return "low";     // Body issues are often comfort/convenience
    case 'U': return "medium";  // Network/communication can affect various systems
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
    default: return "Unknown";
  }
}

async function importDTCCodes() {
  try {
    // Read the DTC.cs file
    const dtcFilePath = path.join(process.cwd(), "DTC.cs");
    const fileContent = fs.readFileSync(dtcFilePath, "utf-8");

    // Regular expressions to extract data
    const codePattern = /([PCBU][0-9]{4})\s+=\s+0x[0-9a-fA-F]+,/g;
    const categoryDescPattern = /\[Category\(Categories\.([a-zA-Z]+)\),\s+Description\("([^"]+)"\)\]/g;

    const dtcEntries: Array<{
      code: string;
      description: string;
      category: string;
      severity: "low" | "medium" | "high";
      affectedSystem: string;
    }> = [];

    // Parse the file content line by line
    const lines = fileContent.split("\n");
    
    for (let i = 0; i < lines.length; i++) {
      // Look for code pattern
      const codeLine = lines[i].trim();
      const codeMatch = /([PCBU][0-9]{4})\s+=\s+0x[0-9a-fA-F]+,/.exec(codeLine);
      
      if (codeMatch) {
        const code = codeMatch[1];
        
        // Look for category and description in previous lines
        let category = "Unknown";
        let description = "Unknown";
        
        // Check up to 5 lines back for category and description
        for (let j = Math.max(0, i - 5); j < i; j++) {
          const attrLine = lines[j].trim();
          const categoryMatch = /\[Category\(Categories\.([a-zA-Z]+)\),\s+Description\("([^"]+)"\)\]/.exec(attrLine);
          
          if (categoryMatch) {
            category = categoryMatch[1];
            description = categoryMatch[2];
            break;
          }
        }
        
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
  } catch (error) {
    console.error("Error importing DTC codes:", error);
  }
}

// Run the import function
importDTCCodes();