import axios from "axios";
import csv from "csvtojson";
import {
  pharmacyUptimeFileParseSeeDoctorWeekType,
  pharmacyUptimeFileType,
  pharmacyUptimeTypeList,
} from "../../types/axios";
import { parseNote, readJson } from "../util";

/**全民健康保險特約院所固定服務時段
 * @see https://data.nhi.gov.tw/Datasets/DatasetDetail.aspx?id=441&Mid=A111088
 */
export const fetchPharmacyUptime =
  async (): Promise<pharmacyUptimeFileType | null> => {
    try {
      const { data } = await axios.get(
        "https://data.nhi.gov.tw/resource/Opendata/%E5%85%A8%E6%B0%91%E5%81%A5%E5%BA%B7%E4%BF%9D%E9%9A%AA%E7%89%B9%E7%B4%84%E9%99%A2%E6%89%80%E5%9B%BA%E5%AE%9A%E6%9C%8D%E5%8B%99%E6%99%82%E6%AE%B5.csv"
      );

      if (!data) return null;

      const jsonData: pharmacyUptimeTypeList = await csv().fromString(data);
      const newData: pharmacyUptimeFileType = {};

      jsonData.forEach((element) => {
        const code = parseInt(element["醫事機構代碼"]);

        newData[code.toString()] = {
          code: code,
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

      return newData;
    } catch (error) {
      return (await readJson(
        "pharmacy_uptime"
      )) as pharmacyUptimeFileType | null;
    }
  };

/**
 * N 代表開診
 * Y 代表修診
 */
export const parseBool = (str: string): boolean => str === "N";

export const parseSeeDoctorWeek = (
  str: string
): pharmacyUptimeFileParseSeeDoctorWeekType =>
  <pharmacyUptimeFileParseSeeDoctorWeekType>(
    (<unknown>(
      Object.fromEntries(
        [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ].map((key, index) => [
          key,
          { morning: str[index], afternoon: str[index + 7] },
        ])
      )
    ))
  );
export default fetchPharmacyUptime;
