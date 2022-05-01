import axios from "axios";
import { AntigenFeature } from "@/api/api_types";

export const getAntigenData = async (): Promise<AntigenFeature[]> => {
  const antigenAPIUrl =
    "https://raw.githubusercontent.com/SiongSng/Rapid-Antigen-Test-Taiwan-Map/data/data/antigen_open_street_map.json";
  const response = await axios.get(antigenAPIUrl);

  return response.data["features"];
};
