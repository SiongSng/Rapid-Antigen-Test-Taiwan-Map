import axios from "axios";
import { AxiosResponse } from "axios";
import csv from "csvtojson";
import { JsonArrayType, parseNote } from "./util";

/**
 * 健保特約機構防疫家用快篩剩餘數量明細
 * https://data.nhi.gov.tw/Datasets/DatasetDetail.aspx?id=698
 */
async function fetchAntigen(oldAntigen: JsonArrayType | null, pharmacyUptime: JsonArrayType): Promise<JsonArrayType> {
    const url = "https://data.nhi.gov.tw/resource/Nhi_Fst/Fstdata.csv";

    const response: AxiosResponse = await axios.get(url);
    const jsonArray = await csv().fromString(response.data);
    jsonArray.forEach(element => {
        const index = jsonArray.indexOf(element);
        const code: number = parseInt(element["醫事機構代碼"]);
        const uptime = pharmacyUptime.find(pharmacy => pharmacy["code"] == code);

        jsonArray[index] = {
            "code": code,
            "name": element["醫事機構名稱"],
            "address": element["醫事機構地址"],
            "longitude": parseFloat(element["經度"]),
            "latitude": parseFloat(element["緯度"]),
            "brands": (element["廠牌項目"] as string).split("/"),
            "count": parseInt(element["快篩試劑截至目前結餘存貨數量"]),
            "phone": element["醫事機構電話"],
            "updated_at": element["來源資料時間"],
            "open_week": uptime != undefined ? uptime["see_doctor_week"] : null,
            "note": parseNote(element["備註"]),
        }
    });

    // 如果家用快篩販售完畢或藥局暫停販售，政府會把該藥局資料刪除，所以把舊的藥局資料加入進去並將 `count` 設為 0
    if (oldAntigen != null) {
        oldAntigen.forEach(element => {
            const antigen = jsonArray.find(antigen => antigen["code"] == element["code"]);
            element["count"] = 0;
            if (antigen == null) {
                jsonArray.push(element);
            }
        });
    }

    return jsonArray;
}

export default fetchAntigen;