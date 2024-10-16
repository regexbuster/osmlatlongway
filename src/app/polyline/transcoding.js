'use server';

import { encode, decode } from '@googlemaps/polyline-codec';

export async function handleEncode(state, formData) {
    try {
        const coordStr = formData.get('coords');
        const coordJSON = JSON.parse(coordStr);

        const path = coordJSON.bleeching.path;
        const geo = coordJSON.geo;

        let sortedPath = [];

        Object.keys(path)
            .sort()
            .forEach((key) => {
                sortedPath.push({ ...path[key], geo: geo[path[key].address] });
            });

        let coordPath = [];

        sortedPath.forEach((point, index) => {
            if (point.geo == 'NA') {
                return;
            }

            const pointGeoArr = point.geo
                .split(',')
                .map((value) => value.trim());

            // remove duplicates unless first or previous point is not the same
            if (
                index == 0 ||
                coordPath[coordPath.length - 1].join(', ') != point.geo
            ) {
                coordPath.push(pointGeoArr);
            }
        });

        const encodedPath = encode(coordPath);

        return { coords: coordStr, polyline: encodedPath };
    } catch (err) {
        return { error: JSON.stringify(err, Object.getOwnPropertyNames(err)) };
    }
}

export async function handleDecode(state, formData) {
    try {
        const polylineStr = formData.get('polyline');

        const coordStr = decode(polylineStr);

        return { coords: coordStr, polyline: polylineStr };
    } catch (err) {
        return { error: JSON.stringify(err, Object.getOwnPropertyNames(err)) };
    }
}
