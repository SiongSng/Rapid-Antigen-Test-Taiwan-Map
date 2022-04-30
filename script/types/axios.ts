// ----- 健保特約機構防疫家用快篩剩餘數量明細 -----
/**健保特約機構防疫家用快篩剩餘數量明細 type dict
 * @see https://data.nhi.gov.tw/Datasets/DatasetDetail.aspx?id=698
 */
export interface fetchAntigenType {
  /**醫事機構代碼 */
  醫事機構代碼: string;
  /**醫事機構名稱 */
  醫事機構名稱: string;
  /**醫事機構地址 */
  醫事機構地址: string;
  /**經度 */
  經度: string;
  /**緯度 */
  緯度: string;
  /**醫事機構電話 */
  醫事機構電話: string;
  /**廠牌項目 */
  廠牌項目: string;
  /**快篩試劑截至目前結餘存貨數量 */
  快篩試劑截至目前結餘存貨數量: string;
  /**來源資料時間 */
  來源資料時間: string;
  /**備註 */
  備註: string;
}

/**健保特約機構防疫家用快篩剩餘數量明細 type list
 * @see https://data.nhi.gov.tw/Datasets/DatasetDetail.aspx?id=698
 */
export type fetchAntigenTypeList = fetchAntigenType[];

/**健保特約機構防疫家用快篩剩餘數量明細 API type
 * @see https://data.nhi.gov.tw/Datasets/DatasetDetail.aspx?id=698
 */
export interface antigenFileType {
  [code: string]: {
    code: number;
    /**醫事機構名稱 */
    name: string;
    /**醫事機構地址 */
    address: string;
    /**經度 */
    longitude: number;
    /**緯度 */
    latitude: number;
    /**醫事機構電話 */
    brands: string[];
    /**廠牌項目 */
    count: number;
    /**快篩試劑截至目前結餘存貨數量 */
    phone: string;
    /**來源資料時間 */
    updated_at: string;
    /**備註 */
    note: string | null;
  };
}

// ----- 全民健康保險特約院所固定服務時段 -----
/**全民健康保險特約院所固定服務時段 type dict
 * @see https://data.nhi.gov.tw/Datasets/DatasetDetail.aspx?id=441&Mid=A111088
 */
export interface pharmacyUptimeType {
  /**醫事機構代碼 */
  醫事機構代碼: string;
  /**醫事機構名稱 */
  醫事機構名稱: string;
  /**業務組別
   * - "1" 台北業務組
   * - "2" 北區業務組
   * - "3" 中區業務組
   * - "4" 南區業務組
   * - "5" 高屏業務組
   * - "6" 東區業務組
   */
  業務組別: "1" | "2" | "3" | "4" | "5" | "6";
  /**特約類別
   * - "1" 醫學中心
   * - "2" 區域醫院
   * - "3" 地區醫院
   * - "4" 基層院所
   */
  特約類別: "1" | "2" | "3" | "4";
  /**看診年度 */
  看診年度: string;
  /**看診星期 共計21位元
   * - 1~7為每周一至周日上午時段開診情形
   * - 8~14為每周一至周日下午時段開診情形
   * - 15~21為每周一至周日晚上時段開診情形
   * - "N"=開診/"Y"=休診
   */
  看診星期: string;
  /**看診備註 */
  看診備註: string;
  /**開業狀況
   * - "0" 開業
   * - "2" 歇業
   * - "3" 公告註銷
   * - "6" 換區歇業
   * - "7" 跨分區業務組遷出
   * - "9" 變更負責人
   * - "A" 終止合約(違約被停)
   * - "B" 不續約(合約到期)
   * - "C" 醫院自行暫停
   */
  開業狀況: "0" | "2" | "3" | "6" | "7" | "9" | "A" | "B" | "C";
  /**資料集更新時間 */
  資料集更新時間: string;
}

/**全民健康保險特約院所固定服務時段 type list
 * @see https://data.nhi.gov.tw/Datasets/DatasetDetail.aspx?id=441&Mid=A111088
 */
export type pharmacyUptimeTypeList = pharmacyUptimeType[];

/**全民健康保險特約院所固定服務時段 api type
 * @see https://data.nhi.gov.tw/Datasets/DatasetDetail.aspx?id=441&Mid=A111088
 */
export interface pharmacyUptimeFileType {
  [code: string]: {
    /**醫事機構代碼 */
    code: number;
    /**醫事機構名稱 */
    name: string;
    /**業務組別 */
    service_group: number;
    /**特約類別 */
    special_category: number;
    /**看診年度 */
    see_doctor_year: number;
    /**看診星期 */
    see_doctor_week: pharmacyUptimeFileParseSeeDoctorWeekType;
    /**看診備註 */
    note: string | null;
    /**開業狀況 */
    open_status: number;
    /**資料集更新時間 */
    updated_at: number;
  };
}
/**全民健康保險特約院所固定服務時段 看診星期 dict type */
export type pharmacyUptimeFileParseSeeDoctorWeekType = Record<
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday",
  Record<"morning" | "afternoon", boolean>
>;
// ----- 健保特約醫事機構-藥局 -----
/**健保特約醫事機構-藥局 type dict
 * @see https://data.nhi.gov.tw/Datasets/DatasetDetail.aspx?id=441&Mid=A111088
 */
export interface pharmacyType {
  /**醫事機構代碼 */
  醫事機構代碼: string;
  /**醫事機構名稱 */
  醫事機構名稱: string;
  /**醫事機構種類 */
  醫事機構種類: string;
  /**電話 */
  電話: string;
  /**地址 */
  地址: string;
  /**分區業務組 */
  分區業務組: string;
  /**特約類別 */
  特約類別: string;
  /**服務項目 */
  服務項目: string;
  /**診療科別 */
  診療科別: string;
  /**終止合約或歇業日期 */
  終止合約或歇業日期: string;
  /**固定看診時段 */
  固定看診時段: string;
  /**備註 */
  備註: string;
  /**縣市別代碼 */
  縣市別代碼: string;
}
/**健保特約醫事機構-藥局 type list
 * @see https://data.nhi.gov.tw/Datasets/DatasetDetail.aspx?id=441&Mid=A111088
 */
export type pharmacyTypeList = pharmacyType[];
/**健保特約醫事機構-藥局 api type
 * @see https://data.nhi.gov.tw/Datasets/DatasetDetail.aspx?id=441&Mid=A111088
 */
export interface pharmacyFileType {
  [code: string]: {
    /**醫事機構代碼 */
    code: number;
    /**醫事機構名稱 */
    name: string;
    /**醫事機構種類 */
    type: string;
    /**電話 */
    phone: string;
    /**地址 */
    address: string;
    /**分區業務組 */
    regional_service_group: string;
    /**特約類別 */
    special_category: string;
    /**服務項目 */
    service_items: string | null;
    /**診療科別 */
    departments: string | null;
    /**終止合約或歇業日 */
    termination_or_close_date: string | null;
    /**固定看診時段 */
    time: string;
    /**備註 */
    note: string | null;
    /**縣市別代碼 */
    city_code: number;
  };
}
