import axios from "axios";
import { AxiosResponse } from "axios";
import csv from "csvtojson";
import { pharmacyFileType, pharmacyTypeList } from "../../types/axios";
import { DataJsonType, parseNote } from "../util";

/**
 * 健保特約醫事機構-藥局
 * @see https://data.nhi.gov.tw/Datasets/DatasetDetail.aspx?id=329
 */
const fetchPharmacy = async (): Promise<DataJsonType | undefined> => {
  const { data } = await axios
    .get(
      "https://data.nhi.gov.tw/DataSets/DataSetResource.ashx?rId=A21030000I-D21005-001"
    )
    .catch();

  if (!data) return;

  const jsonArray: pharmacyTypeList = await csv().fromString(data);
  const newData: pharmacyFileType = {};

  jsonArray.forEach((data) => {
    const code = data["醫事機構代碼"];

    newData[code] = {
      code: parseInt(code),
      name: data["醫事機構名稱"],
      type: data["醫事機構種類"],
      phone: data["電話"],
      address: data["地址"],
      regional_service_group: data["分區業務組"],
      special_category: data["特約類別"],
      service_items: parseStringWithNull(data["服務項目"]),
      departments: parseStringWithNull(data["診療科別"]),
      termination_or_close_date: parseStringWithNull(
        data["終止合約或歇業日期"]
      ),
      time: data["固定看診時段"],
      note: parseNote(data["備註"]),
      city_code: parseInt(data["縣市別代碼"]),
    };
  });

  return newData;
};

export const parseStringWithNull = (str: string): string | null =>
  str == "" || str == null ? null : str;

export default fetchPharmacy;
