<template>
  <div id="app">
    <!-- 顯示藥局位置 -->
    <div id="map"></div>
  </div>
</template>

<script lang="ts">
import { AxiosResponse } from "axios";
import { Options, Vue } from "vue-class-component";

import Leaflet from "leaflet";
import { Feature, Point } from "geojson";
let openStreetMap: Leaflet.Map;

@Options({
  components: {},
  data: () => ({
    data: [],
    select: {},
  }),
  computed: {
    pharmacies(): Feature<Point, { [name: string]: string }>[] {
      return this.data;
    },
  },
  watch: {
    pharmacies() {
      this.updateMap();
    },
  },
  methods: {
    updateMap() {
      if (openStreetMap == null) return;

      // clear map markers
      openStreetMap.eachLayer((layer) => {
        if (layer instanceof Leaflet.Marker) {
          openStreetMap?.removeLayer(layer);
        }
      });

      /// add map markers
      this.pharmacies.forEach(
        (pharmacy: Feature<Point, { [name: string]: string }>) => {
          Leaflet.marker([
            pharmacy.geometry.coordinates[1],
            pharmacy.geometry.coordinates[0],
          ]).addTo(openStreetMap)
            .bindPopup(`<p><strong style="font-size: 20px;">${
            pharmacy.properties.name
          }</strong></p>
           <strong style="font-size: 16px;">品牌: ${
             pharmacy.properties.brands[0]
           }</br>
          <strong style="font-size: 16px;">剩餘 ${
            pharmacy.properties.count
              ? `${pharmacy.properties.count} 份 (每份五個)`
              : "未取得資料"
          } 
          </strong><br>
          地址: ${pharmacy.properties.address}<br>
          電話: ${pharmacy.properties.phone}<br>
          備註: ${pharmacy.properties.note}<br>
          <small>最後更新時間: ${pharmacy.properties.updated_at}</small>`);
        }
      );
    },
  },
  mounted() {
    let zoom = 16;
    let maxZoom = 19;

    openStreetMap = Leaflet.map("map", {
      center: [25.042474, 121.513729],
      zoom: zoom,
    });
    openStreetMap.locate({
      setView: true,
      maxZoom: zoom,
    });

    Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: maxZoom,
    }).addTo(openStreetMap);

    const pharmacyAPIUrl =
      "https://raw.githubusercontent.com/SiongSng/Rapid-Antigen-Test-Taiwan-Map/data/data/antigen_open_street_map.json";
    this.$http.get(pharmacyAPIUrl).then((response: AxiosResponse) => {
      /// save pharmacy data
      this.data = response.data.features;
    });
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import "bootstrap/scss/bootstrap";

#map {
  position: relative;
  height: 98vh;
}
</style>
