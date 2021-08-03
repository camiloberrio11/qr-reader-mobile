import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare var mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {
  latitud: string;
  longitud: string;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    let geo: string = this.route.snapshot.paramMap.get('geo');
    geo = geo.substr(4);
    [this.latitud, this.longitud] = geo.split(',');
  }

  ngAfterViewInit() {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiY2FtaWxvYmVycmlvMTEiLCJhIjoiY2tyd2F5dHFrMGVzaTJwbWl6bjk2eXczbyJ9.PYzrIm4z2AG9chxBb5EYJA';
    const map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v10',
      center: [+this.longitud, +this.latitud],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: 'map',
      antialias: true,
    });

    map.on('load', () => {
      map.resize();
      // Marker
      new mapboxgl.Marker({
        draggable: true
        })
        .setLngLat([+this.longitud, +this.latitud])
        .addTo(map);



      // Insert the layer beneath any symbol layer.
      const layers = map.getStyle().layers;
      let labelLayerId;
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      // The 'building' layer in the Mapbox Streets
      // vector tileset contains building height data
      // from OpenStreetMap.
      map.addLayer(
        {
          id: 'add-3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#aaa',

            // Use an 'interpolate' expression to
            // add a smooth transition effect to
            // the buildings as the user zooms in.
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height'],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height'],
            ],
            'fill-extrusion-opacity': 0.6,
          },
        },

        labelLayerId
      );
    });
  }
}
