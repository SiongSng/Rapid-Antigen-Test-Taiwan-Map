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

import MarkerIcon from "@/leaflet/marker_icon";
import { generateMarker } from "@/leaflet/marker";
import { getAntigenData } from "@/api/get_antigen_data";
import { AntigenFeature } from "@/api/api_types";

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
        green: new MarkerIcon("/assets/green_marker_icon.png"),
        yellow: new MarkerIcon("/assets/yellow_marker_icon.png"),
        red: new MarkerIcon("/assets/red_marker_icon.png"),
        grey: new MarkerIcon("/assets/grey_marker_icon.png"),
      };

      const cluster = L.markerClusterGroup({
        chunkedLoading: true,
        disableClusteringAtZoom: 15,
        spiderfyOnMaxZoom: false,
        removeOutsideVisibleBounds: true,
      });

      /// add map markers
      const data = this.antigenData as AntigenFeature[];
      data.forEach((pharmacy) => {
        const count = pharmacy.properties.count;

        if (count == 0) {
          cluster.addLayer(generateMarker(pharmacy, icons.grey));
        } else if (count <= 10) {
          cluster.addLayer(generateMarker(pharmacy, icons.red));
        } else if (count <= 40) {
          cluster.addLayer(generateMarker(pharmacy, icons.yellow));
        } else {
          cluster.addLayer(generateMarker(pharmacy, icons.green));
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
      /// updates every 2 minutes
      setInterval(async () => {
        this.antigenData = await getAntigenData();
      }, 1000 * 60 * 2);
    });
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import "bootstrap/scss/bootstrap";

#map {
  position: relative;
  height: 100vh;
  width: 100%;
}
</style>
