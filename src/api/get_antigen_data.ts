import axios from "axios";
import { AntigenData } from "./api_types";
import { Feature, Point } from "geojson";

export const getAntigenData = async (): Promise<Feature<Point, AntigenData>[]> => {
  const antigenAPIUrl =
    "https://raw.githubusercontent.com/SiongSng/Rapid-Antigen-Test-Taiwan-Map/data/data/antigen_open_street_map.json";
  const response = await axios.get(antigenAPIUrl);

  return response.data["features"];
};
