import { Feature, Point } from "geojson";

/**健保特約機構防疫家用快篩剩餘數量明細
 * @see https://data.nhi.gov.tw/Datasets/DatasetDetail.aspx?id=698
 */
export interface AntigenData {
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
  open_week: PharmacyUptimeSeeDoctorWeek;
}

/**全民健康保險特約院所固定服務時段 看診星期 dict type */
export type PharmacyUptimeSeeDoctorWeek = Record<
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday",
  Record<"morning" | "afternoon", boolean>
>;

export type AntigenFeature = Feature<Point, AntigenData>;
