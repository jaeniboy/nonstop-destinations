import { getOsmFiles } from "./utils.js";

console.log(await getOsmFiles("./../data/osm", false, 2, true))