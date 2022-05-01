import { AntigenFeature } from "@/api/api_types";
import MakerIcon from "@/leaflet/marker_icon";
import L from "leaflet";

export const generateMarker = (
  pharmacy: AntigenFeature,
  icon: MakerIcon
): L.Marker => {
  const count = pharmacy.properties.count;

  const maker = L.marker(
    [pharmacy.geometry.coordinates[1], pharmacy.geometry.coordinates[0]],
    { icon: icon }
  );
  maker.bindPopup(
    `<p><strong style="font-size: 20px;">${
      pharmacy.properties.name
    }</strong></p>
       <strong style="font-size: 16px;">品牌: ${pharmacy.properties.brands}</br>
      <strong style="font-size: 16px;">剩餘 
      ${count} 份 (每份五個)
      </strong><br>
      地址: ${pharmacy.properties.address}<br>
      電話: ${pharmacy.properties.phone}<br>
      備註: ${pharmacy.properties.note}<br>
      <small>最後更新時間: ${
        pharmacy.properties.updated_at
      }</small><br>${googleMap(pharmacy)}`
  );

  return maker;
};

function googleMap(pharmacy: AntigenFeature): string {
  const url = `https://www.google.com/maps/search/${pharmacy.properties.address.trim()}`;

  return `<a class="btn btn-dark btn-block text-white mt-3" href="${url}" role="button" target="_blank">Google 地圖</a>`;
}
