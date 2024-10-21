// 'use client';

// import React, { useEffect, useRef, useState } from 'react';
// import mapboxgl from 'mapbox-gl';

// import 'mapbox-gl/dist/mapbox-gl.css';

// const MapboxExample = () => {
//     const mapContainerRef = useRef(null);
//     const mapRef = useRef(null);

//     useEffect(() => {
//         mapRef.current = null;

//         // TO MAKE THE MAP APPEAR YOU MUST
//         // ADD YOUR ACCESS TOKEN FROM
//         // https://account.mapbox.com
//         mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPTOKEN;

//         mapRef.current = new mapboxgl.Map({
//             container: mapContainerRef.current,
//             style: 'mapbox://styles/mapbox/streets-v12',
//             center: [-122.486052, 37.830348],
//             zoom: 14,
//         });

//         mapRef.current.on('load', () => {
//             mapRef.current.addSource('route', {
//                 type: 'geojson',
//                 data: {
//                     type: 'Feature',
//                     properties: {},
//                     geometry: {
//                         type: 'LineString',
//                         coordinates: [
//                             [-122.483696, 37.833818],
//                             [-122.483482, 37.833174],
//                             [-122.483396, 37.8327],
//                             [-122.483568, 37.832056],
//                             [-122.48404, 37.831141],
//                             [-122.48404, 37.830497],
//                             [-122.483482, 37.82992],
//                             [-122.483568, 37.829548],
//                             [-122.48507, 37.829446],
//                             [-122.4861, 37.828802],
//                             [-122.486958, 37.82931],
//                             [-122.487001, 37.830802],
//                             [-122.487516, 37.831683],
//                             [-122.488031, 37.832158],
//                             [-122.488889, 37.832971],
//                             [-122.489876, 37.832632],
//                             [-122.490434, 37.832937],
//                             [-122.49125, 37.832429],
//                             [-122.491636, 37.832564],
//                             [-122.492237, 37.833378],
//                             [-122.493782, 37.833683],
//                         ],
//                     },
//                 },
//             });

//             mapRef.current.addLayer({
//                 id: 'route',
//                 type: 'line',
//                 source: 'route',
//                 layout: {
//                     'line-join': 'round',
//                     'line-cap': 'round',
//                 },
//                 paint: {
//                     'line-color': '#888',
//                     'line-width': 8,
//                 },
//             });
//         });
//     }, []);

//     return (
//         <div
//             style={{ height: '100%' }}
//             ref={mapContainerRef}
//             className="map-container"
//         ></div>
//     );
// };

// export default MapboxExample;

import MapboxMap from './MapboxMap';

export default function MapboxPage() {
    return <MapboxMap />;
}
