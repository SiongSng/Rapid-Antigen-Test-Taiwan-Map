import { writeJsonFile } from "./util";
import path from "path";

process
  .on("uncaughtException", (er: unknown) => console.error(er))
  .on("unhandledRejection", (er: unknown) => console.error(er));

(async () => {
  writeJsonFile("", "");
})();
