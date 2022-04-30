import axios from "axios";
import { AxiosResponse } from "axios";
import csv from "csvtojson";
import { JsonArrayType, parseNote } from "./util";

/**
  * 健保特約醫事機構-藥局
  * https://data.nhi.gov.tw/Datasets/DatasetDetail.aspx?id=329
  */
async function fetchPharmacy(): Promise<JsonArrayType> {
    const url = "https://data.nhi.gov.tw/DataSets/DataSetResource.ashx?rId=A21030000I-D21005-001";

    const response: AxiosResponse = await axios.get(url);
    const jsonArray = await csv().fromString(response.data);
    jsonArray.forEach(element => {
        const index = jsonArray.indexOf(element);
        jsonArray[index] = {
            "code": parseInt(element["醫事機構代碼"]),
            "name": element["醫事機構名稱"],
            "type": element["醫事機構種類"],
            "phone": element["電話"],
            "address": element["地址"],
            "regional_service_group": element["分區業務組"],
            "special_category": element["特約類別"],
            "service_items": parseStringWithNull(element["服務項目"]),
            "departments": parseStringWithNull(element["診療科別"]),
            "termination_or_close_date": parseStringWithNull(element["終止合約或歇業日"]),
            "time": element["固定看診時段"],
            "note": parseNote(element["備註"]),
            "city_code": parseInt(element["縣市別代碼"]),
        }
    });

    return jsonArray;
}

function parseStringWithNull(str: string): string | null {
    if (str == "" || str == null) {
        return null;
    }
    return str;
}

export default fetchPharmacy;