<template>
  <div id="app">
    <!-- 顯示藥局位置 -->
    <div id="map"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import L from "leaflet";
import "leaflet.locatecontrol";
import "leaflet.markercluster";

import { Feature, Point } from "geojson";
import ClusterIcon from "@/leaflet/cluster_icon";
import { generateMaker } from "./leaflet/maker";
import { getAntigenData } from "./api/get_antigen_data";
import { AntigenData } from "./api/api_types";

let openStreetMap: L.Map;

@Options({
  components: {},
  data: () => ({
    antigenData: [],
    select: {},
  }),
  watch: {
    antigenData() {
      this.updateMap();
    },
  },
  methods: {
    updateMap() {
      if (openStreetMap == null) return;

      // clear map markers
      openStreetMap.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          openStreetMap?.removeLayer(layer);
        }
      });

      const icons = {
        green: new ClusterIcon("https://i.imgur.com/1KRTaAO.png"),
        yellow: new ClusterIcon("https://i.imgur.com/raxi9vh.png"),
        red: new ClusterIcon("https://i.imgur.com/Ed6iMMC.png"),
        none: new ClusterIcon("https://i.imgur.com/mfATTxs.png"),
      };

      const cluster = L.markerClusterGroup({
        chunkedLoading: true,
        disableClusteringAtZoom: 15,
        spiderfyOnMaxZoom: false,
      });

      /// add map markers
      const data = this.antigenData as Feature<Point, AntigenData>[];
      data.forEach((pharmacy) => {
        const count = pharmacy.properties.count;

        if (count == 0) {
          cluster.addLayer(generateMaker(pharmacy, icons.none));
        } else if (count <= 10) {
          cluster.addLayer(generateMaker(pharmacy, icons.red));
        } else if (count <= 40) {
          cluster.addLayer(generateMaker(pharmacy, icons.yellow));
        } else {
          cluster.addLayer(generateMaker(pharmacy, icons.green));
        }
      });

      openStreetMap.addLayer(cluster);
    },
  },
  mounted() {
    let zoom = 16;

    const title = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      }
    );

    openStreetMap = L.map("map", {
      center: [25.042474, 121.513729],
      layers: [title],
      zoom: zoom,
    });
    L.control
      .locate({
        position: "topleft",
        initialZoomLevel: zoom,
        strings: { title: "定位到目前位置", popup: "目前位置" },
      })
      .addTo(openStreetMap)
      .start();

    getAntigenData().then((data) => {
      this.antigenData = data;
      setInterval(async () => {
        console.log("update");
        this.antigenData = await getAntigenData();
        console.log("update done");
      }, 1000 * 60);
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
