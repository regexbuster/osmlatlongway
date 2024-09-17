'use client';

import { useState } from 'react';
import { encode, decode } from '@googlemaps/polyline-codec';

import styles from './page.module.css';

export default function MapImage() {
    const [imageSourceURL, setImageSourceURL] = useState('');
    const [textareaValue, setTextareaValue] = useState('');

    function updateArea(event) {
        setTextareaValue(event.target.value);
    }

    function updatePolyline(data) {
        let splitData = data.split('\n');
        console.log(splitData);

        if (splitData.length <= 1) {
            alert('You need at least two lat and long pairs');
            return { res: null, err: true };
        }

        splitData.forEach((pair, index) => {
            let splitPair = pair.split(',');

            if (splitPair.length <= 1) {
                if (pair.replace(/\s/g, '') !== '') {
                    alert(`Pair (${pair}) is not formatted as <lat>,<long>.`);
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
            alert('You need at least two lat and long pairs');
            return { res: null, err: true };
        }

        return { res: splitData, err: null };
    }

    function updateMap(event) {
        event.preventDefault();

        const { res, err } = updatePolyline(textareaValue);

        if (err != null) {
            return;
        }

        const linevalue = encode(res);

        fetch(`/api?polyline=${linevalue}`)
            .then((res) => {
                return res.blob();
            })
            .then((res) => {
                setImageSourceURL(URL.createObjectURL(res));
            })
            .catch((err) => {
                console.error(err);
            });
    }

    return (
        <>
            <div className={styles.main}>
                <img alt="map" src={imageSourceURL}></img>
                <form className={styles.form}>
                    <textarea
                        name="toods"
                        onChange={updateArea}
                        value={textareaValue}
                        className={styles.area}
                    ></textarea>
                    <button
                        type="submit"
                        className={styles.submit}
                        onClick={updateMap}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </>
    );
}