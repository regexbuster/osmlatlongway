'use client';

import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';

import { handleEncode, handleDecode } from './transcoding';

export default function PolylineTranscoder() {
    const [coordsValue, setCoordValue] = useState('');
    const [polylineValue, setPolylineValue] = useState('');

    const [coordFormState, coordFormAction] = useFormState(handleEncode, null);
    const [polylineFormState, polylineFormAction] = useFormState(
        handleDecode,
        null
    );

    useEffect(() => {
        if (coordFormState?.coords && coordFormState?.polyline) {
            setCoordValue(coordFormState.coords);
            setPolylineValue(coordFormState.polyline);
        } else if (coordFormState?.error) {
            alert(coordFormState.error);
        } else {
            console.log(coordFormState);
        }
    }, [coordFormState]);

    useEffect(() => {
        if (polylineFormState?.coords && polylineFormState?.polyline) {
            setCoordValue(polylineFormState.coords);
            setPolylineValue(polylineFormState.polyline);
        } else if (polylineFormState?.error) {
            alert(polylineFormState.error);
        } else {
            console.log(polylineFormState);
        }
    }, [polylineFormState]);

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
