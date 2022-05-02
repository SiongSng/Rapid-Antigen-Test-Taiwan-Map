/**健保特約機構防疫家用快篩剩餘數量明細
 * @see https://data.nhi.gov.tw/Datasets/DatasetDetail.aspx?id=698
 */
export interface AntigenAPIType {
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
    /**看診星期 */
    open_week: PharmacyUptimeSeeDoctorWeekAPIType;
  };
}

/**健保特約醫事機構-藥局
 * @see https://data.nhi.gov.tw/Datasets/DatasetDetail.aspx?id=441&Mid=A111088
 */
export interface PharmacyAPIType {
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

/**全民健康保險特約院所固定服務時段
 * @see https://data.nhi.gov.tw/Datasets/DatasetDetail.aspx?id=441&Mid=A111088
 */
export interface PharmacyUptimeAPIType {
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
    see_doctor_week: PharmacyUptimeSeeDoctorWeekAPIType;
    /**看診備註 */
    note: string | null;
    /**開業狀況 */
    open_status: number;
    /**資料集更新時間 */
    updated_at: number;
  };
}

/**全民健康保險特約院所固定服務時段 看診星期 dict type */
export type PharmacyUptimeSeeDoctorWeekAPIType = Record<
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday",
  Record<"morning" | "afternoon" | "evening", boolean>
>;
