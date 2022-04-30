export const openStreetMap = (
  antigen: {
    longitude: string | number;
    latitude: string | number;
  }[]
) => ({
  type: "FeatureCollection",
  features: antigen.map((element) => ({
    type: "Feature",
    properties: element,
    geometry: {
      type: "Point",
      coordinates: [+element["longitude"], +element["latitude"]],
    },
  })),
});

export default openStreetMap;
