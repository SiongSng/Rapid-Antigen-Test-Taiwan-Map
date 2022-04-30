import axios from "axios";
import csv from "csvtojson";
import { antigenFileType, fetchAntigenTypeList } from "../../types/axios";
import { parseNote } from "../util";

/**
 * 健保特約機構防疫家用快篩剩餘數量明細
 * @see https://data.nhi.gov.tw/Datasets/DatasetDetail.aspx?id=698
 */
export const fetchAntigen = async (
  oldJsonData: antigenFileType = {}
): Promise<antigenFileType | undefined> => {
  const { data } = <{ data: string }>await axios({
    url: "https://data.nhi.gov.tw/resource/Nhi_Fst/Fstdata.csv",
  }).catch();

  if (!data) return;

  const jsonArray: fetchAntigenTypeList = await csv().fromString(data);
  let newJsonData: antigenFileType = {};

  jsonArray.forEach((data) => {
    newJsonData[data["醫事機構代碼"]] = {
      code: data["醫事機構名稱"],
      name: data["醫事機構名稱"],
      address: data["醫事機構地址"],
      longitude: parseFloat(data["經度"]),
      latitude: parseFloat(data["緯度"]),
      brands: (data["廠牌項目"] as string).split("/"),
      count: parseInt(data["快篩試劑截至目前結餘存貨數量"]),
      phone: data["醫事機構電話"],
      updated_at: data["來源資料時間"],
      // TODO add open_week
      // open_week: uptime != undefined ? uptime["see_doctor_week"] : null,
      note: parseNote(data["備註"]),
    };
  });

  // 如果家用快篩販售完畢或藥局暫停販售，政府會把該藥局資料刪除，所以把舊的藥局資料加入進去並將 `count` 設為 0
  Object.keys(oldJsonData).forEach((key) => {
    let antigen = oldJsonData[key];
    if (newJsonData[key]) return;
    newJsonData[key] = { ...antigen, count: 0 };
  });

  return newJsonData;
};

export default fetchAntigen;
