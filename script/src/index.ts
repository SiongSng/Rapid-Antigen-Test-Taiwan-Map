import fetchAntigen from "./fetch_antigen";
import fetchPharmacy from "./fetch_pharmacy";
import * as fs from "node:fs";
import { JsonArrayType } from "./util";
import fetchPharmacyUptime from "./fetch_pharmacy_uptime";
import openStreetMap from "./open_street_map";
import * as childProcess from "node:child_process";

async function start() {
    let times = 0;
    await _start();

    async function _start() {
       // await startFetch();
        commitToGithub();
        console.log("Finished");
    }

    // runs every minute
    setInterval((async () => {
        if (times >= 14) {
            clearInterval();
            return;
        }

        times++;
        await _start();
    }), 1000 * 60 * 60);
}

async function startFetch() {
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

    console.log("Fetched successfully");
}

function commitToGithub() {
    console.log("Committing to github...");
    const cloneDir = childProcess.execSync("mktemp -d", { encoding: "utf8" });

    childProcess.execSync("git config --global user.email github-actions[bot]@github.com");
    childProcess.execSync("git config --global user.name \"GitHub Actions Bot\"");

    console.log("Cloning repository...");
    childProcess.execSync(`git clone --single-branch --branch data \"https://x-access-token:$API_TOKEN_GITHUB@github.com/SiongSng/Rapid-Antigen-Test-Taiwan-Map.git\" \"${cloneDir}\"`);

    childProcess.execSync(`cp -R script/data ${cloneDir}`);

    const cdCommand = `cd ${cloneDir} &&`;

    const needsCommit: boolean = childProcess.execSync(`${cdCommand} git status --porcelain`, { encoding: "utf8" }).length > 0;

    if (needsCommit) {
        childProcess.execSync(`${cdCommand} git add .`);
        childProcess.execSync(`${cdCommand} git commit --message \"Auto update data\"`);
        childProcess.execSync(`${cdCommand} git push -u origin HEAD:data`);
        console.log("Pushed successfully");
    }

    console.log("Committed successfully");
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

start();