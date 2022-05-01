import Leaflet from "leaflet";

class ClusterIcon extends Leaflet.Icon {
  constructor(iconUrl: string) {
    super({
      iconUrl: iconUrl,
      iconSize: [30, 30],
      iconAnchor: [18, 36],
      popupAnchor: [0, -38],
    });
  }
}

export default ClusterIcon;
