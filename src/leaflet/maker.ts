import { AntigenData } from "@/api/api_types";
import { Feature, Point } from "geojson";
import L from "leaflet";

export const generateMaker = (
  pharmacy: Feature<Point, AntigenData>,
  icon: L.Icon
): L.Marker => {
  const count = pharmacy.properties.count;

  const maker = L.marker(
    [pharmacy.geometry.coordinates[1], pharmacy.geometry.coordinates[0]],
    { icon: icon }
  );
  maker.bindPopup(`<p><strong style="font-size: 20px;">${pharmacy.properties.name}</strong></p>
       <strong style="font-size: 16px;">品牌: ${pharmacy.properties.brands}</br>
      <strong style="font-size: 16px;">剩餘 
      ${count} 份 (每份五個)
      </strong><br>
      地址: ${pharmacy.properties.address}<br>
      電話: ${pharmacy.properties.phone}<br>
      備註: ${pharmacy.properties.note}<br>
      <small>最後更新時間: ${pharmacy.properties.updated_at}</small>`);

  return maker;
};
