import ImageLayer from "ol/layer/Image.js";
import Map from "ol/Map.js";
import { Projection, fromLonLat, transformExtent } from "ol/proj";
import Static from "ol/source/ImageStatic.js";
import View from "ol/View.js";
import { getCenter } from "ol/extent.js";
import Draw from "ol/interaction/Draw.js";
import { Vector as VectorSource } from "ol/source.js";
import { Layer, Vector as VectorLayer } from "ol/layer.js";
import GeoJSON from "ol/format/GeoJSON";
import Feature from "ol/Feature";
import { Fill, Stroke, Style } from "ol/style";
import { Overlay } from "ol";
import Heatmap from "ol/layer/Heatmap";
import "ol/ol.css";

const source = new VectorSource({ wrapX: false });

const vector = new VectorLayer({
  source: source,
});

// Map views always need a projection.  Here we just want to map image
// coordinates directly to map coordinates, so we create a projection that uses
// the image extent in pixels.
const extent = [0, 0, 1000, 703];
const projection = new Projection({
  code: "xkcd-image",
  units: "pixels",
  extent: extent,
});
let view = null;
let selectedArea = "";

function init() {
  const mapData = initMap();
  function addInteraction(map) {
    let draw = new Draw({
      source: source,
      type: "Polygon",
    });
    map.addInteraction(draw);

    draw.on("drawend", (evt) => {
      console.log(evt.feature.getGeometry()?.getExtent());

      const geom = [];
      geom.push(new Feature(evt.feature.getGeometry()));
      const writer = new GeoJSON();
      const geoJsonStr = writer.writeFeatures(geom);
      console.log(geoJsonStr);
    });
  }

  function capitalizeEachWord(text) {
    const words = text.split(" ");

    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    return words.join(" ");
  }

  async function initAreas(map) {
    let polygonData = {};
    try {
      const raw = await fetch(
        "https://rawcdn.githack.com/jasjuslover/wano-maps/a4b3166e9238c11e0ba64a9e72f7b42153f549b5/areas.json"
      );
      const res = await raw.json();
      polygonData = res?.data || {};
    } catch (error) {
      console.log(error);
    }

    Object.keys(polygonData).forEach(async (x) => {
      const source = new VectorSource({
        features: new GeoJSON().readFeatures(
          JSON.parse(polygonData[x].geoJson)
        ),
      });
      const layer = new VectorLayer({
        source,
        style: [
          new Style({
            fill: new Fill({
              color: polygonData[x].fill,
            }),
          }),
        ],
      });

      const aTag = document.createElement("a");
      aTag.setAttribute("id", x);
      aTag.setAttribute("class", "overlay");
      aTag.setAttribute("style", "background-color: " + polygonData[x].color);
      aTag.setAttribute("data-area", JSON.stringify(polygonData[x]));
      aTag.innerText = capitalizeEachWord(x);

      //   Modal section
      const modal = document.getElementById("myModal");
      aTag.onclick = () => {
        const area = JSON.parse(aTag.getAttribute("data-area"));

        // show modal just when zoom level == 3 or active, and current selected area == clicked area
        if (view.getZoom() === 3 && selectedArea === area.color) {
          modal.style.display = "block";

          const title = document.getElementById("title");
          title.innerText = capitalizeEachWord(x);
          const image = document.getElementById("image");
          image.src = area.image;
          const desc = document.getElementById("desc");
          desc.innerHTML = area.description;
          const close = modal.getElementsByClassName("close");
          close[0].onclick = () => {
            modal.style.display = "none";
          };
          window.onclick = (event) => {
            if (event.target == modal) {
              modal.style.display = "none";
            }
          };
        }

        // just zoom when area is different with selected area
        if (selectedArea !== area.color) {
          selectedArea = area.color;
          const coord = getCenter(source.getExtent());
          zoomInto(parseFloat(coord[0]), parseFloat(coord[1]));
          mapData.getAllLayers().forEach((x, i) => {
            if (i > 0) mapData.removeLayer(x);
          });

          const singleLayer = new VectorLayer({
            source,
            style: [
              new Style({
                fill: new Fill({
                  color: polygonData[x].fillSelected,
                }),
              }),
            ],
          });
          mapData.addLayer(singleLayer);
        }
      };
      map.addLayer(layer);
      map.addOverlay(
        new Overlay({
          position: getCenter(source.getExtent()),
          positioning: x === "kibi" ? "bottom-right" : "center-center",
          element: aTag,
        })
      );
    });
  }

  async function initHeatmap(map) {
    try {
      const raw = await fetch(
        "https://rawcdn.githack.com/jasjuslover/wano-maps/a4b3166e9238c11e0ba64a9e72f7b42153f549b5/heatmap.json"
      );
      const res = await raw.json();

      const heatSource = new VectorSource({
        features: new GeoJSON().readFeatures(res),
      });

      const heatLayer = new Heatmap({
        title: "Heatmap",
        source: heatSource,
        blur: 20,
        radius: 10,
        weight: function (feature) {
          return 50;
        },
      });

      map.addLayer(heatLayer);
    } catch (error) {
      console.log(error);
    }
    // const heatmap = new Heatmap({

    // })
  }

  function initMap() {
    try {
      view = new View({
        projection: projection,
        center: getCenter(extent),
        extent: [-100, -100, 1100, 803],
        zoom: 2,
        maxZoom: 8,
      });
      let map = new Map({
        layers: [
          new ImageLayer({
            source: new Static({
              attributions:
                '© <a href="https://xkcd.com/license.html">xkcd</a>',
              url: "https://rawcdn.githack.com/jasjuslover/wano-maps/a4b3166e9238c11e0ba64a9e72f7b42153f549b5/wano.png",
              projection: projection,
              imageExtent: extent,
            }),
            opacity: 0.8,
          }),
        ],
        target: "map",
        view,
      });

      // get query params
      const urlSearchParams = new URLSearchParams(window.location.search);
      if (urlSearchParams.get("interaction") === "true") {
        addInteraction(map);
      }
      if (urlSearchParams.get("areas") === "true") {
        initAreas(map);
      }
      if (urlSearchParams.get("heatmap") === "true") {
        initHeatmap(map);
      }
      if (urlSearchParams.get("longlatclick") === "true") {
        map.on("click", (e) => {
          console.log(e.coordinate);
        });
      }

      return map;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  function zoomInto(x, y) {
    try {
      view.animate({
        center: [x, y],
        zoom: 3,
        duration: 1500,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

init();
