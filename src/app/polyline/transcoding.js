'use server';

import { encode, decode } from '@googlemaps/polyline-codec';

export async function handleCoordParse(state, formData) {
    try {
        const coordStr = formData.get('coords');

        // splits coords into lat and long pairs
        let splitData = coordStr.split('\n');

        if (splitData.length <= 1) {
            return { error: 'You need at least two lat and long pairs' };
        }

        let info = [];

        splitData.forEach((pair, index) => {
            let splitPair = pair.split(',');

            if (splitPair.length <= 1) {
                // regex any whitespace to "" then check if empty
                // if handles malformed pairs
                // else splices blank lines out
                if (pair.replace(/\s/g, '') !== '') {
                    info.push(
                        `Pair (${pair}) is not formatted as <lat>,<long> and was removed from encoded data.`
                    );
                }

                splitData.splice(index, 1);
                return;
            }

            splitData[index] = [
                parseFloat(splitPair[0]),
                parseFloat(splitPair[1]),
            ];
        });

        if (splitData.length <= 1) {
            return { error: 'You need at least two lat and long pairs' };
        }

        return {
            coords: splitData.join('\n'),
            polyline: encode(splitData),
            info,
        };
    } catch (err) {
        return { error: JSON.stringify(err, Object.getOwnPropertyNames(err)) };
    }
}

export async function handleBleechingEncode(state, formData) {
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

        return { coords: coordPath, polyline: encodedPath };
    } catch (err) {
        return { error: JSON.stringify(err, Object.getOwnPropertyNames(err)) };
    }
}

export async function handleDecode(state, formData) {
    try {
        const polylineStr = formData.get('polyline');

        const coordStr = decode(polylineStr);

        return { coords: coordStr.join('\n'), polyline: polylineStr };
    } catch (err) {
        return { error: JSON.stringify(err, Object.getOwnPropertyNames(err)) };
    }
}
