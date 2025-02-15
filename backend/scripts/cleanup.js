import fs from 'fs';
import { getOsmFiles, updateStatusFile } from './utils.js';

function deleteFiles(filePaths) {
    filePaths.forEach(filePath => {
        try {
            fs.unlinkSync(filePath);
            console.log(`Deleted ${filePath}`);
        } catch (err) {
            console.error(`Unable to delete ${filePath}: ${err}`);
        }
    });
}

// delete old files, keep latest and second lates
const filePaths = await getOsmFiles("./../data/osm", false, 2, true)

if (filePaths.length > 0) {
    deleteFiles(filePaths);
    console.log(`Removed old files: ${filePaths.join(" ")}`)
    updateStatusFile("removedOldFiles")
} else {
    console.log("No files to remove!")
}