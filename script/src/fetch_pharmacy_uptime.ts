import axios from "axios";
import { AxiosResponse } from "axios";
import { JsonArrayType, parseNote } from "./util";
import csv from "csvtojson";

/**
 * 全民健康保險特約院所固定服務時段
 * https://data.nhi.gov.tw/Datasets/DatasetDetail.aspx?id=441&Mid=A111088
 */
async function fetchPharmacyUptime(): Promise<JsonArrayType> {
  const url =
    "https://data.nhi.gov.tw/resource/Opendata/%E5%85%A8%E6%B0%91%E5%81%A5%E5%BA%B7%E4%BF%9D%E9%9A%AA%E7%89%B9%E7%B4%84%E9%99%A2%E6%89%80%E5%9B%BA%E5%AE%9A%E6%9C%8D%E5%8B%99%E6%99%82%E6%AE%B5.csv";

  const response: AxiosResponse = await axios.get(url);
  const jsonArray = await csv().fromString(response.data);
  jsonArray.forEach((element) => {
    const index = jsonArray.indexOf(element);
    jsonArray[index] = {
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

  return jsonArray;
}

/**
 * 「看診星期」：共計21位元，其中1~7為每周一至周日上午時段開診情形、8~14為每周一至周日下午時段開診情形、15~21為每周一至周日晚上時段開診情形
 */
function parseSeeDoctorWeek(
  str: string
): Record<string, Record<string, boolean>> {
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
}

/**
 * N 代表開診
 * Y 代表修診
 */
function parseBool(str: string): boolean {
  return str == "N";
}

export default fetchPharmacyUptime;
