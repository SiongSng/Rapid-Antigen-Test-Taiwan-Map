import { JsonArrayType } from "./util";

function openStreetMap(antigen: JsonArrayType): Record<string, JsonArrayType | string> {
    const features: JsonArrayType = antigen.map(element => {
        return {
            "type": "Feature",
            "properties": element,
            "geometry": {
                "type": "Point",
                "coordinates": [element["longitude"], element["latitude"]],
            }
        };
    });

    return {
        "type": "FeatureCollection",
        "features": features,
    };
}

export default openStreetMap;