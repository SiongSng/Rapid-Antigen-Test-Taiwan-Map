import Leaflet from "leaflet";

class ClusterIcon extends Leaflet.Icon {
  constructor(iconUrl: string) {
    super({
      iconUrl: iconUrl,
      iconAnchor: [18, 36],
      iconSize: [36, 36],
      popupAnchor: [0, -38],
    });
  }
}

export default ClusterIcon;
