import { readdir } from 'fs/promises';
import { join } from 'path'
import { readFileSync, writeFileSync } from 'fs';

const getOsmFiles = async (directory, latest=true, numOfFiles=1, inverted=false) => {
    const files = await readdir(directory)
    // const osmFiles = files.filter((file) => file.startsWith('osm_data_') && file.endsWith('.json') && !file.endsWith('enhanced.json'));
    const osmFiles = files.filter((file) => {
        const regex = /^osm_data_\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.json$/;
        return regex.test(file);
    })

    osmFiles.sort((a, b) => {
        return b.localeCompare(a)
    })

    // return osmFiles
    if (latest && numOfFiles === 1) {
        return join(directory, osmFiles[0])
    }

    if (inverted) {
        return osmFiles.slice(numOfFiles).map(d=> join(directory, d))
    }
}

function readJsonFile(filename) {
    try {
        return JSON.parse(readFileSync(filename, 'utf8'));
    } catch (err) {
        console.error(err);
        return null;
    }
}

function writeJsonFile(filename, data) {
    try {
        writeFileSync(filename, JSON.stringify(data, null, 2));
        console.log(`Wrote data successfully to ${filename}.`);
    } catch (err) {
        console.error(err);
    }
}

const updateStatusFile = (key) =>{
    const filepath = "./../updateStatus.json"
    const status = readJsonFile(filepath)
    status[key] = new Date().toISOString()
    writeJsonFile(filepath, status)
}


export { getOsmFiles, readJsonFile, writeJsonFile, updateStatusFile }