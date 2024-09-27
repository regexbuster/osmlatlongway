'use client';

import { useEffect, useState } from 'react';

import styles from './page.module.css';

import readyl4smap from './actions/readytest';

import { encode, decode } from '@googlemaps/polyline-codec';

export default function MapImage() {
    const [imageSourceURL, setImageSourceURL] = useState('');
    const [textareaValue, setTextareaValue] = useState('');

    const [getData, setGetData] = useState(0);
    const [encodedPath, setEncodedPath] = useState(null);

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

    // function r4updateMap(event) {
    //     event.preventDefault();

    //     readyl4smap()
    //         .then((res) => {
    //             fetch(`/api?polyline=${res}`)
    //                 .then((res) => {
    //                     return res.blob();
    //                 })
    //                 .then(async (res) => {
    //                     setImageSourceURL(URL.createObjectURL(res));
    //                 })
    //                 .catch((err) => {
    //                     console.error(err);
    //                 });
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //         });
    // }

    function incrementGetData() {
        setGetData(getData + 1);
    }

    async function getEncodedPath() {
        const res = await fetch('https://ready4l4s.cerfca.st/diagnose/', {
            headers: { 'Access-Control-Allow-Origin': '*' },
        });
        const resJson = await res.json();

        let path = resJson.bleeching.path;
        let geo = resJson.geo;

        let sortedPath = [];

        // sort the keys of path
        // sortedPath gets setup with a sorted list of keys
        // we add on geo data if availible or we put NA
        Object.keys(path)
            .sort()
            .forEach((key) => {
                sortedPath.push({
                    ...path[key],
                    geo: geo[path[key].address],
                });
            });

        let coordPath = [];

        sortedPath.forEach((point, index) => {
            if (point.geo == 'NA') {
                return;
            }
            const pointGeoArr = point.geo
                .split(',')
                .map((value) => value.trim());
            if (index == 0 || sortedPath[index - 1].geo != point.geo) {
                coordPath.push(pointGeoArr);
            }
        });

        let encodedPath = encode(coordPath);

        setEncodedPath(encodedPath);
    }

    // when button pressed get coordPath
    useEffect(() => {
        if (getData > 0) {
            getEncodedPath();
        }
    }, [getData]);

    async function getMap() {
        const res = await fetch(`/api?polyline=${encodedPath}`);
        const blob = await res.blob();
        setImageSourceURL(URL.createObjectURL(blob));
    }

    useEffect(() => {
        if (encodedPath) {
            getMap();
        }
    }, [encodedPath]);

    return (
        <>
            <div className={styles.main}>
                <img alt="map" src={imageSourceURL}></img>
                <div>
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
                    <button onClick={incrementGetData}>Am I Ready?</button>
                </div>
            </div>
        </>
    );
}
