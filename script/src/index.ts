import * as fs from "node:fs";
import { readJson } from "./util";
import * as childProcess from "node:child_process";
import { exit } from "node:process";
import fetchPharmacy from "./fetchs/pharmacy";
import fetchPharmacyUptime from "./fetchs/pharmacyUptime";
import fetchAntigen from "./fetchs/antigen";
import openStreetMap from "./map/open_street_map";

const githubAPIToken = process.env.GITHUB_API_TOKEN;
const runOnGithubAction =
  githubAPIToken != undefined && githubAPIToken != "" && githubAPIToken != null;

async function start() {
  let interval: NodeJS.Timer;
  let times = 1;
  await _start();

  async function _start() {
    await startFetch();
    try {
      if (runOnGithubAction) pushChangesToGithub();
    } catch (error) {
      console.error("Failed to push changes to github.", error);
    }
    console.log("Finished");
  }

  if (runOnGithubAction) {
    // runs every minute
    interval = setInterval(() => {
      if (times >= 57) {
        clearInterval(interval);
        exit(0);
      }
      times++;

      _start().then(() => console.log("Waiting for next fetch..."));
    }, 1000 * 60);
  }
}

async function startFetch() {
  console.log("Fetching pharmacies...");
  writeJson("pharmacy", await fetchPharmacy());
  console.log("Fetching pharmacies uptime...");
  const pharmacyUptime = await fetchPharmacyUptime();
  writeJson("pharmacy_uptime", pharmacyUptime);

  console.log("Fetching antigen...");
  if (!pharmacyUptime == null) return console.log("No pharmacyUptime data");
  const antigen = await fetchAntigen(await readJson("antigen"), pharmacyUptime);
  writeJson("antigen", antigen);
  console.log("Converting to OpenStreetMap format...");
  if (!antigen) return console.log("No antigen data");
  writeJson("antigen_open_street_map", openStreetMap(Object.values(antigen)));

  console.log("Fetched successfully");
}

function pushChangesToGithub() {
  console.log("Committing to github...");
  const cloneDir = ".data-branch-clone";

  childProcess.execSync(
    "git config --global user.email github-actions[bot]@github.com"
  );
  childProcess.execSync('git config --global user.name "GitHub Actions Bot"');

  console.log("Cloning repository...");
  childProcess.execSync(
    `git clone --single-branch --branch data "https://x-access-token:${githubAPIToken}@github.com/SiongSng/Rapid-Antigen-Test-Taiwan-Map.git" "${cloneDir}"`
  );

  childProcess.execSync(`cp -R data ${cloneDir}`);

  const needsCommit: boolean =
    childProcess.execSync(`git status --porcelain`, {
      encoding: "utf8",
      cwd: cloneDir,
    }).length > 0;

  if (needsCommit) {
    childProcess.execSync(`git add .`, { cwd: cloneDir });
    childProcess.execSync(`git commit --message "Auto update data"`, {
      cwd: cloneDir,
    });
    childProcess.execSync(`git push -u origin HEAD:data`, { cwd: cloneDir });
    console.log("Pushed successfully");
  }

  console.log("Committed successfully");
  fs.rmSync(cloneDir, { recursive: true });
}

function writeJson(filename: string, data: unknown) {
  if (data == null) return;
  if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
  }

  fs.writeFileSync(`data/${filename}.json`, JSON.stringify(data));
}

start();
