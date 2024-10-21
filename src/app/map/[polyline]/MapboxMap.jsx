'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useParams } from 'next/navigation';

import { decode } from '@googlemaps/polyline-codec';

const PolylineStatus = {
    NoPolyline: 'nopolyline',
    DecodeFailed: 'decodefail',
    Success: 'success',
    Unknown: 'unknown',
};

// long and lat gets flipped for some reason so I do it here too :/
function FlipArr(arr) {
    return [arr[1], arr[0]];
}

function LatLongToLongLat(arr) {
    return arr.map((val) => [val[1], val[0]]);
}

function geoMidpoint(posArr) {
    let lat = { min: posArr[0][0], max: posArr[0][0] };
    let long = { min: posArr[1][1], max: posArr[1][1] };

    posArr.forEach((position) => {
        if (position[0] < lat.min) {
            lat.min = position[0];
        } else if (position[0] > lat.max) {
            lat.max = position[0];
        }
        if (position[1] < long.min) {
            long.min = position[1];
        } else if (position[1] > long.max) {
            long.max = position[1];
        }
    });

    return [(lat.min + lat.max) / 2, (long.min + long.max) / 2];
}

function getPolylineArray(params) {
    try {
        if (!params.polyline) {
            return { status: PolylineStatus.NoPolyline };
        }

        // decodeURIComponent because some characters get messed with in the URL and need to come back
        const decodedPolyline = decode(decodeURIComponent(params.polyline));

        return {
            status: PolylineStatus.Success,
            line: decodedPolyline,
            mid: geoMidpoint(decodedPolyline),
        };
    } catch (err) {
        console.error(err);
        return { status: PolylineStatus.DecodeFailed };
    }
}

export default function MapboxMap() {
    const mapNode = useRef(null);
    const mapContainer = useRef(null);

    const params = useParams();

    const status = useRef(PolylineStatus.Unknown);

    useEffect(() => {
        const node = mapContainer.current;

        // no windown = rendered on server or no dom initialized
        if (typeof window === 'undefined' || node === null) {
            console.log('womp', typeof window === 'undefined', node === null);
            return;
        }

        const polylineRes = getPolylineArray(params);

        status.current = polylineRes.status;

        if (polylineRes.status != PolylineStatus.Success) {
            console.log('womp womp');
            return;
        }

        mapNode.current = new mapboxgl.Map({
            container: mapContainer.current,
            accessToken: process.env.NEXT_PUBLIC_MAPTOKEN,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: FlipArr(polylineRes.mid),
            zoom: 5,
        });

        mapNode.current.on('load', () => {
            console.log(polylineRes.line);

            mapNode.current.addSource('route', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: LatLongToLongLat(polylineRes.line),
                    },
                },
            });

            mapNode.current.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                },
                paint: {
                    'line-color': '#FF0000',
                    'line-width': 8,
                },
            });
        });

        return () => {
            mapNode.current.remove();
            mapNode.current = null;
        };
    }, []);

    // return <div ref={mapNode} style={{ width: '100vw', height: '100vh' }} />;
    /*
        {status.current == PolylineStatus.NoPolyline && (
                <p>No Polyline Detected in URL</p>
            )}
            {status.current == PolylineStatus.DecodeFailed && (
                <p>Invalid Polyline in URL</p>
            )}
            {status.current == PolylineStatus.Success && <p>Success</p>}
            {status.current == PolylineStatus.Unknown && <p>Invalid</p>}
    */
    return (
        <>
            <div
                ref={mapContainer}
                style={{ width: '100vw', height: '100vh' }}
            />
        </>
    );
}
