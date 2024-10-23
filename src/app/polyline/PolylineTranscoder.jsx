'use client';

import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';

import styles from './polyline.module.css';
import { handleCoordEncode, handleDecode } from './transcoding';

export default function PolylineTranscoder() {
    const [coordsValue, setCoordValue] = useState('10, 12\n12, 10\n15, 15');
    const [polylineValue, setPolylineValue] = useState('');
    const [info, setInfo] = useState(null);

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
    function updateCoords(event) {
        setCoordValue(event.target.value);
    }

    function updatePolyline(event) {
        setPolylineValue(event.target.value);
    }

    return (
        <div className={styles.formWrapper}>
            <form
                style={{ minWidth: '33%' }}
                action={coordFormAction}
                className={styles.transcodeForm}
            >
                <textarea
                    className={styles.textarea}
                    name="coords"
                    onChange={updateCoords}
                    value={coordsValue}
                ></textarea>
                <button type="submit">Encode</button>
            </form>

            <form
                style={{ minWidth: '33%' }}
                action={polylineFormAction}
                className={styles.transcodeForm}
            >
                <textarea
                    className={styles.textarea}
                    name="polyline"
                    onChange={updatePolyline}
                    value={polylineValue}
                ></textarea>
                <button type="submit">Decode</button>
            </form>
        </div>
    );
}
