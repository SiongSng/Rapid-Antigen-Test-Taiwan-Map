import fetchAntigen from "./fetch_antigen";
import fetchPharmacy from "./fetch_pharmacy";
import * as fs from "fs";
import { JsonArrayType } from "./util";
import fetchPharmacyUptime from "./fetch_pharmacy_uptime";
import openStreetMap from "./open_street_map";

async function run() {
    console.log("Fetching pharmacies...");
    writeJson("pharmacy", await fetchPharmacy());
    console.log("Fetching pharmacies uptime...");
    const pharmacyUptime = await fetchPharmacyUptime();
    writeJson("pharmacy_uptime", pharmacyUptime);

    console.log("Fetching antigen...");
    const oldAntigen = readJson("antigen");
    const antigen = await fetchAntigen(oldAntigen, pharmacyUptime);
    writeJson("antigen", antigen);
    console.log("Converting to OpenStreetMap format...");
    writeJson("antigen_open_street_map", openStreetMap(antigen));

    console.log("Finished");
}


function writeJson(filename: string, data: unknown) {
    if (!fs.existsSync("data")) {
        fs.mkdirSync("data");
    }

    fs.writeFileSync(`data/${filename}.json`, JSON.stringify(data, null, 2));
}

function readJson(filename: string): JsonArrayType | null {
    const file = `data/${filename}.json`;
    if (!fs.existsSync(file)) {
        return null;
    } else {
        return JSON.parse(fs.readFileSync(file, "utf8"));
    }
}

run();