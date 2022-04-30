import * as fs from "node:fs";
import { DataJsonType } from "./util";
import * as childProcess from "node:child_process";
import axios from "axios";
import { exit } from "node:process";
import fetchPharmacy from "./fetchs/pharmacy";
import fetchPharmacyUptime from "./fetchs/pharmacyUptime";
import fetchAntigen from "./fetchs/antigen";
import openStreetMap from "./map/open_street_map";
import { antigenFileType } from "../types/axios";

const githubAPIToken = process.argv.slice(2)[0];
const runOnGithubAction =
  githubAPIToken != undefined && githubAPIToken != "" && githubAPIToken != null;

async function start() {
  let times = 0;
  await _start();

  async function _start() {
    await startFetch();
    if (runOnGithubAction) {
      commitToGithub();
    }
    console.log("Finished");
    console.log("Waiting for next fetch...");
  }

  // runs every minute
  setInterval(async () => {
    if (times >= 59) {
      clearInterval();
      exit(0);
    }

    times++;
    await _start();
  }, 1000 * 60);
}

async function startFetch() {
  console.log("Fetching pharmacies...");
  writeJson("pharmacy", await fetchPharmacy());
  console.log("Fetching pharmacies uptime...");
  const pharmacyUptime = await fetchPharmacyUptime();
  writeJson("pharmacy_uptime", pharmacyUptime);

  console.log("Fetching antigen...");
  const antigen = await fetchAntigen(await getOldAntigen(), pharmacyUptime);
  writeJson("antigen", antigen);
  console.log("Converting to OpenStreetMap format...");
  writeJson("antigen_open_street_map", openStreetMap(antigen));

  console.log("Fetched successfully");
}

function commitToGithub() {
  console.log("Committing to github...");
  const cloneDir = ".data-branch-clone";

  childProcess.execSync(
    "git config --global user.email github-actions[bot]@github.com"
  );
  childProcess.execSync('git config --global user.name "GitHub Actions Bot"');

  console.log("Cloning repository...");
  childProcess.execSync(
    `git clone --single-branch --branch data \"https://x-access-token:${githubAPIToken}@github.com/SiongSng/Rapid-Antigen-Test-Taiwan-Map.git\" \"${cloneDir}\"`
  );

  childProcess.execSync(`cp -R data ${cloneDir}`);

  const needsCommit: boolean =
    childProcess.execSync(`git status --porcelain`, {
      encoding: "utf8",
      cwd: cloneDir,
    }).length > 0;

  if (needsCommit) {
    childProcess.execSync(`git add .`, { cwd: cloneDir });
    childProcess.execSync(`git commit --message \"Auto update data\"`, {
      cwd: cloneDir,
    });
    childProcess.execSync(`git push -u origin HEAD:data`, { cwd: cloneDir });
    console.log("Pushed successfully");
  }

  console.log("Committed successfully");
  fs.rmdirSync(cloneDir, { recursive: true });
}

async function getOldAntigen(): Promise<antigenFileType | null> {
  if (runOnGithubAction) {
    try {
      return await (
        await axios.get(
          "https://raw.githubusercontent.com/SiongSng/Rapid-Antigen-Test-Taiwan-Map/data/data/antigen.json"
        )
      ).data;
    } catch (e) {
      return null;
    }
  } else {
    return readJson("antigen") as antigenFileType;
  }
}

function writeJson(filename: string, data: unknown) {
  if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
  }

  fs.writeFileSync(`data/${filename}.json`, JSON.stringify(data, null, 2));
}

function readJson(filename: string): DataJsonType | null {
  const file = `data/${filename}.json`;
  if (!fs.existsSync(file)) {
    return null;
  } else {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  }
}

start();
