import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";

// Convert ES module paths to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { PLAYERS_DATA } from "./players.js";
import { TEAMS_DATA } from "./teams.js";

/**
 * Download images from an array of objects containing imgUrl and imgName fields.
 * @param {Array} dataArray - Array of objects with "imgUrl" and "imgName".
 * @param {string} outputDir - Directory where images will be saved.
 */
const downloadImages = async (
    dataArray,
    outputDir = "images",
    overwriteExisting = false,
) => {
    // Resolve full path (handles relative paths)
    const fullOutputDir = path.resolve(__dirname, outputDir);

    // Ensure the directory exists
    if (!fs.existsSync(fullOutputDir)) {
        fs.mkdirSync(fullOutputDir, { recursive: true });
        console.log(`Created directory: ${fullOutputDir}`);
    }

    const downloadImage = async (url, filename) => {
        const filePath = path.join(fullOutputDir, filename);

        // Check if the file exists
        if (fs.existsSync(filePath)) {
            if (overwriteExisting) {
                console.log(`Overwriting: ${filename}`);
            } else {
                console.log(`Skipping (exists): ${filename}`);
                return;
            }
        }

        try {
            const response = await axios({
                url,
                method: "GET",
                responseType: "stream",
            });

            const filePath = path.join(fullOutputDir, filename);
            const writer = fs.createWriteStream(filePath);

            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on("finish", () => {
                    console.log(`Downloaded: ${filename}`);
                    resolve();
                });
                writer.on("error", reject);
            });
        } catch (error) {
            console.error(`Failed to download ${filename}:`, error.message);
        }
    };

    for (const item of dataArray) {
        if (item.imgUrl && item.imgName) {
            await downloadImage(item.imgUrl, item.imgName);
        } else {
            console.warn(`Skipping (missing imgUrl or imgName): `, item);
        }
    }

    console.log(":: All downloads complete.");
};

downloadImages(PLAYERS_DATA, "../assets/images/players");
downloadImages(TEAMS_DATA, "../assets/images/teams");
