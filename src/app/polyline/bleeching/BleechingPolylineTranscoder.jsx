'use client';

import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';

import {
    handleBleechingParse,
    handleCoordEncode,
    handleDecode,
} from '../transcoding';

export default function BleechingPolylineTranscoder() {
    const [bleechingValue, setBleechingValue] = useState();
    const [coordsValue, setCoordValue] = useState('');
    const [polylineValue, setPolylineValue] = useState('');
    const [info, setInfo] = useState(null);

    const [bleechingFormState, bleechingFormAction] = useFormState(
        handleBleechingParse,
        null
    );
    const [coordFormState, coordFormAction] = useFormState(
        handleCoordEncode,
        null
    );
    const [polylineFormState, polylineFormAction] = useFormState(
        handleDecode,
        null
    );

    // triggers when form state changes and populates text areas
    useEffect(() => {
        console.log(bleechingFormState);

        if (bleechingFormState?.parse) {
            setBleechingValue(bleechingFormState.parse.join('\n'));
        } else if (bleechingFormState?.error) {
            alert(bleechingFormState.error);
        } else {
            console.log(bleechingFormState);
        }
    }, [bleechingFormState]);

    useEffect(() => {
        if (coordFormState?.coords && coordFormState?.polyline) {
            setCoordValue(coordFormState.coords);
            setPolylineValue(coordFormState.polyline);
            if (coordFormState?.info) {
                setInfo(coordFormState.info);
            }
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

    // for managing text area content with state variable
    function updateBleeching(event) {
        setBleechingValue(event.target.value);
    }

    function updateCoords(event) {
        setCoordValue(event.target.value);
    }

    function updatePolyline(event) {
        setPolylineValue(event.target.value);
    }

    return (
        <>
            <form action={bleechingFormAction}>
                <textarea
                    name="bleeching"
                    onChange={updateBleeching}
                    value={bleechingValue}
                ></textarea>
                <button type="submit">Parse</button>
            </form>

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
