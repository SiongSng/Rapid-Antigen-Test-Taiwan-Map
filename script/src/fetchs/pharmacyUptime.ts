import axios from "axios";
import csv from "csvtojson";
import { pharmacyUptimeFileType } from "../../types/axios";
import { parseNote } from "../util";

/**全民健康保險特約院所固定服務時段
 * @see https://data.nhi.gov.tw/Datasets/DatasetDetail.aspx?id=441&Mid=A111088
 */
export const fetchPharmacyUptime = async () => {
  const { data } = <{ data: string }>await axios({
    url: "https://data.nhi.gov.tw/resource/Opendata/全民健康保險特約院所固定服務時段.csv",
  }).catch();

  if (!data) return;

  const jsonData = await csv().fromString(data);
  let newData: pharmacyUptimeFileType = {};

  jsonData.forEach((element) => {
    newData[element["醫事機構代碼"]] = {
      code: parseInt(element["醫事機構代碼"]),
      name: element["醫事機構名稱"],
      service_group: parseInt(element["業務組別"]),
      special_category: parseInt(element["特約類別"]),
      see_doctor_year: parseInt(element["看診年度"]),
      see_doctor_week: parseSeeDoctorWeek(element["看診星期"]),
      note: parseNote(element["看診備註"]),
      open_status: parseInt(element["開業狀況"]),
      updated_at: parseInt(element["資料集更新時間"]),
    };
  });
};

/**
 * N 代表開診
 * Y 代表修診
 */
export const parseBool = (str: string): boolean => str === "N";

export const parseSeeDoctorWeek = (
  str: string
): Record<
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday",
  Record<"morning" | "afternoon", boolean>
> => {
  Object.fromEntries(
    [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ].map((key, index) => [key, { morning: index, afternoon: index + 7 }])
  );
  return {
    monday: {
      morning: parseBool(str.charAt(0)),
      afternoon: parseBool(str.charAt(7)),
    },
    tuesday: {
      morning: parseBool(str.charAt(1)),
      afternoon: parseBool(str.charAt(8)),
    },
    wednesday: {
      morning: parseBool(str.charAt(2)),
      afternoon: parseBool(str.charAt(9)),
    },
    thursday: {
      morning: parseBool(str.charAt(3)),
      afternoon: parseBool(str.charAt(10)),
    },
    friday: {
      morning: parseBool(str.charAt(4)),
      afternoon: parseBool(str.charAt(11)),
    },
    saturday: {
      morning: parseBool(str.charAt(5)),
      afternoon: parseBool(str.charAt(12)),
    },
    sunday: {
      morning: parseBool(str.charAt(6)),
      afternoon: parseBool(str.charAt(13)),
    },
  };
};
export default fetchPharmacyUptime;
