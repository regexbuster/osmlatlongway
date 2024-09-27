// import { encode, decode } from '@googlemaps/polyline-codec';

async function readyl4smap() {
    const res = await fetch('https://ready4l4s.cerfca.st/diagnose/').then(
        (res) => {
            return res.json();
        }
    );

    // grab relevant data
    let path = res.bleeching.path;
    let geo = res.geo;

    // combine path and geo objects
    Object.keys(path).forEach((hop) => {
        path[hop] = {
            ...path[hop],
            geo: geo[`${path[hop].address}`]
                .split(',')
                .map((geo) => geo.trim()),
        };
    });

    // find sorted keys of path to sort hops
    const sortedKeys = Object.keys(path).sort((a, b) => {
        return parseInt(a) - parseInt(b);
    });

    // use sorted keys to create sorted path
    let sortedPath = [];
    sortedKeys.forEach((key) => {
        sortedPath.push(path[key]);
    });

    // filter NA
    let filteredPath = sortedPath.filter((hop) => {
        return hop.geo != 'NA';
    });

    const geoPath = {};

    filteredPath.forEach((hop) => {
        const cleanGeo = hop.geo.join(', ');
        if (Object.keys(geoPath).includes(cleanGeo)) {
            geoPath[`${cleanGeo}`].indexes.push(hop.index);
        } else {
            geoPath[`${cleanGeo}`] = { indexes: [hop.index] };
        }
    });

    if (Object.keys(geoPath).length == 1) {
        const loc = Object.keys(geoPath)[0]
            .split(', ')
            .map((coord) => {
                return (parseFloat(coord) + 0.001).toFixed(4);
            })
            .join(', ');
        geoPath[loc] = {};
    }

    let encodedPath = encode(
        Object.keys(geoPath).map((item) => item.split(', '))
    );

    console.log(
        filteredPath,
        geoPath,
        Object.keys(geoPath).map((item) => item.split(', ')),
        encodedPath,
        geo
    );

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

(async function () {
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

    console.log(coordPath);
})();
