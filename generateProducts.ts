// import.js
import { backendClient } from "@/sanity/lib/backendClient";
import { readFile } from "fs/promises";
async function importData() {
  try {
    // Step 1: Load your JSON file
    const file = await readFile("./products_variants.json", "utf-8");
    const data = JSON.parse(file);

    // Step 2: Combine into one array (if needed)
    const documents = [...data.products, ...data.variants];

    // Step 3: Create documents in batch
    const chunkSize = 50;
    for (let i = 0; i < documents.length; i += chunkSize) {
      const chunk = documents.slice(i, i + chunkSize);
      const tx = backendClient.transaction();
      chunk.forEach((doc) => tx.createOrReplace(doc));
      await tx.commit();
      console.log(`✅ Imported ${i + chunk.length}/${documents.length} documents`);
    }

    console.log("✅ All documents imported!");
  } catch (error) {
    console.error("❌ Import failed:", error.message);
  }
}

importData();
