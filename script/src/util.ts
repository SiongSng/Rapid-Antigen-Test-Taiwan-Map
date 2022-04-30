import axios from "axios";
import fs from "fs";

export type DataJsonType = { [key: string]: unknown };

export const parseNote = (str: string): string | null =>
  str === "-" || str == "" || str === "無" ? null : str;

export const writeJsonFile = (filaName: string, newData: string): void => {
  if (!fs.existsSync("data")) fs.mkdirSync("data");

  try {
    fs.writeFileSync(`data/${filaName}`, JSON.stringify(newData), "utf8");
  } catch (e) {
    console.log(e);
  }
};

export async function readJson(filename: string): Promise<DataJsonType | null> {
  const file = `data/${filename}.json`;
  if (!fs.existsSync(file)) {
    const url = `https://raw.githubusercontent.com/SiongSng/Rapid-Antigen-Test-Taiwan-Map/data/data/${filename}.json`;
    try {
      return await (
        await axios.get(url)
      ).data;
    } catch (error) {
      return null;
    }
  } else {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  }
}
