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
    code: string;
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
