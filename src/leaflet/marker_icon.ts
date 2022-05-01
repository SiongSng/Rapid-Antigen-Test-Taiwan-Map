import Leaflet from "leaflet";

class MakerIcon extends Leaflet.Icon {
  constructor(iconUrl: string) {
    super({
      iconUrl: "https://siongsng.github.io/Rapid-Antigen-Test-Taiwan-Map/" + iconUrl,
      iconSize: [30, 30],
      iconAnchor: [18, 36],
      popupAnchor: [0, -38],
    });
  }
}

export default MakerIcon;
