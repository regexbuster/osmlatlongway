'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';

import { encode, decode } from '@googlemaps/polyline-codec';

async function handleEncode(coordStr) {
    'use server';

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

        const pointGeoArr = point.geo.split(',').map((value) => value.trim());

        // remove duplicates unless first or previous point is not the same
        if (
            index == 0 ||
            coordPath[coordPath.length - 1].join(', ') != point.geo
        ) {
            coordPath.push(pointGeoArr);
        }

        const encodedPath = encode(coordPath);
    });
}

async function handleDecode(polylineStr) {
    'use server';
}

export default function PolylineTranscoder() {
    const [coordsValue, setCoordValue] = useState('');
    const [polylineValue, setPolylineValue] = useState('');

    const [coordFormState, coordFormAction] = useFormState(handleEncode, {});
    const [polylineFormState, polylineFormAction] = useFormState(
        handleDecode,
        {}
    );

    function updateCoords(event) {
        setCoordValue(event.target.value);
    }

    function updatePolyline(event) {
        setPolylineValue(event.target.value);
    }

    return (
        <>
            <form action={coordFormAction}>
                <textarea
                    name="coords"
                    onChange={updateCoords}
                    value={coordsValue}
                ></textarea>
                <button type="submit">Encode</button>
            </form>

            <form action={polylineFormAction}>
                <textarea
                    name="polyline"
                    onChange={updatePolyline}
                    value={polylineValue}
                ></textarea>
                <button type="submit">Decode</button>
            </form>
        </>
    );
}
