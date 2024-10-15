import { useState } from 'react';
import { useFormState } from 'react-dom';

export default function PolylineTranscoder() {
    const [coordsValue, setCoordValue] = useState('');
    const [polylineValue, setPolylineValue] = useState('');

    const [coordFormState, coordFormAction] = useFormState();

    function updateCoords(event) {
        setCoordValue(event.target.value);
    }

    function updatePolyline(event) {
        setPolylineValue(event.target.value);
    }

    return (
        <>
            <form>
                <textarea
                    name="coords"
                    onChange={updateCoords}
                    value={coordsValue}
                ></textarea>
                <button type="submit">Encode</button>
            </form>

            <form>
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
