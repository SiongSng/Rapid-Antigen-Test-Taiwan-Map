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
import "leaflet.locatecontrol";
import "leaflet.markercluster";
import { Feature, Point } from "geojson";
import ClusterIcon from "@/leaflet/cluster_icon";
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

      const icons = {
        green: new ClusterIcon("https://i.imgur.com/1KRTaAO.png"),
        red: new ClusterIcon("https://i.imgur.com/Ed6iMMC.png"),
        unknown: new ClusterIcon("https://i.imgur.com/mfATTxs.png"),
        yellow: new ClusterIcon("https://i.imgur.com/raxi9vh.png"),
      };

      const maker = (
        pharmacy: Feature<Point, { [name: string]: unknown }>,
        icon: Leaflet.Icon
      ): Leaflet.Marker => {
        const count = pharmacy.properties.count as number;

        return Leaflet.marker(
          [pharmacy.geometry.coordinates[1], pharmacy.geometry.coordinates[0]],
          { icon: icon }
        ).bindPopup(`<p><strong style="font-size: 20px;">${
          pharmacy.properties.name
        }</strong></p>
           <strong style="font-size: 16px;">品牌: ${
             pharmacy.properties.brands as Array<unknown>[0]
           }</br>
          <strong style="font-size: 16px;">剩餘 
          ${count} 份 (每份五個)
          </strong><br>
          地址: ${pharmacy.properties.address}<br>
          電話: ${pharmacy.properties.phone}<br>
          備註: ${pharmacy.properties.note}<br>
          <small>最後更新時間: ${pharmacy.properties.updated_at}</small>`);
      };

      const cluster = Leaflet.markerClusterGroup({
        chunkedLoading: true,
        disableClusteringAtZoom: 15,
        spiderfyOnMaxZoom: false,
      });

      /// add map markers
      this.pharmacies.forEach(
        (pharmacy: Feature<Point, { [name: string]: unknown }>) => {
          const count = pharmacy.properties.count as number;

          if (count == 0) {
            cluster.addLayer(maker(pharmacy, icons.red));
          } else if (count <= 30) {
            cluster.addLayer(maker(pharmacy, icons.yellow));
          } else {
            cluster.addLayer(maker(pharmacy, icons.green));
          }
        }
      );

      openStreetMap.addLayer(cluster);
    },
  },
  mounted() {
    let zoom = 16;

    const title = Leaflet.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      }
    );

    openStreetMap = Leaflet.map("map", {
      center: [25.042474, 121.513729],
      layers: [title],
      zoom: zoom,
    });
    Leaflet.control
      .locate({
        position: "topleft",
        initialZoomLevel: zoom,
        strings: { title: "定位到目前位置", popup: "目前位置" },
      })
      .addTo(openStreetMap)
      .start();

    const antigenAPIUrl =
      "https://raw.githubusercontent.com/SiongSng/Rapid-Antigen-Test-Taiwan-Map/data/data/antigen_open_street_map.json";
    this.$http.get(antigenAPIUrl).then((response: AxiosResponse) => {
      /// save antigen data
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
