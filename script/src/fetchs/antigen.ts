import axios from "axios";
import csv from "csvtojson";
import { antigenFileType, fetchAntigenTypeList, pharmacyUptimeFileType, pharmacyUptimeType, pharmacyUptimeTypeList } from "../../types/axios";
import { DataJsonType, parseNote } from "../util";

/**
 * 健保特約機構防疫家用快篩剩餘數量明細
 * @see https://data.nhi.gov.tw/Datasets/DatasetDetail.aspx?id=698
 */
export const fetchAntigen = async (
  oldJsonData: antigenFileType | null, pharmacyUptime: pharmacyUptimeFileType
): Promise<antigenFileType | undefined> => {
  const response = await axios.get("https://data.nhi.gov.tw/resource/Nhi_Fst/Fstdata.csv").catch();

  const jsonData: fetchAntigenTypeList = await csv().fromString(response.data);
  let newJsonData: antigenFileType = {};

  jsonData.forEach((data) => {
    const code: number = parseInt(data["醫事機構代碼"]);
    const uptime = pharmacyUptime[code];

    newJsonData[code.toString()] = {
      code: code,
      name: data["醫事機構名稱"],
      address: data["醫事機構地址"],
      longitude: parseFloat(data["經度"]),
      latitude: parseFloat(data["緯度"]),
      brands: (data["廠牌項目"] as string).split("/"),
      count: parseInt(data["快篩試劑截至目前結餘存貨數量"]),
      phone: data["醫事機構電話"],
      updated_at: data["來源資料時間"],
      open_week: uptime?.see_doctor_week || null,
      note: parseNote(data["備註"]),
    };
  });

  if (oldJsonData != null) {
    // 如果家用快篩販售完畢或藥局暫停販售，政府會把該藥局資料刪除，所以把舊的藥局資料加入進去並將 `count` 設為 0
    Object.keys(oldJsonData).forEach((code) => {
      let antigen = oldJsonData[code];

      if (newJsonData[code]) return; // 當新的資料有該藥局代碼時，則跳過
      newJsonData[code] = { ...antigen, count: 0 }; // 將舊的資料加入新的資料中 並且用解構的方式設置 count 設為 0
    });
  }

  return newJsonData;
};

export default fetchAntigen;
