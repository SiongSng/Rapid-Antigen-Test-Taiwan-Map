import fs from "fs";

export type DataJsonType = { [key: string]: unknown };

export const parseNote = (str: string): string | null =>
  str === "-" || str == "" || str === "無" ? null : str;

export const writeJsonFile = (filaName: string, newData: string): void => {
  if (!fs.existsSync("data")) fs.mkdirSync("data");

  try {
    fs.writeFileSync(`data/${filaName}`, JSON.stringify(newData), "utf8");
  } catch {}
};
