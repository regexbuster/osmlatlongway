'use server';

import { encode, decode } from '@googlemaps/polyline-codec';

export default async function readyl4smap() {
    const res = await fetch('https://ready4l4s.cerfca.st/diagnose/');
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
        const pointGeoArr = point.geo.split(',').map((value) => value.trim());
        if (index == 0 || sortedPath[index - 1].geo != point.geo) {
            coordPath.push(pointGeoArr);
        }
    });

    let encodedPath = encode(coordPath);

    console.log();

    return encodedPath;

    // fetch(`https://osmlatlongway.vercel.app/api?polyline=${encodedPath}`)
    //     .then((res) => {
    //         return res.blob();
    //     })
    //     .then(async (res) => {
    //         var buffer = await res.arrayBuffer();
    //         buffer = Buffer.from(buffer);
    //         fs.createWriteStream('image.png').write(buffer);
    //     });
}
