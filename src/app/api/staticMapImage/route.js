import { headers } from 'next/headers';

export async function GET(req, res) {
    const headersList = headers();
    const mapKey = headersList.get('mapAPIKey');

    const searchParams = req.nextUrl.searchParams;

    console.log(searchParams);

    let data = await fetch(
        `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/path-5+f44-0.5(${searchParams.get(
            'polyline'
        )})/auto/800x400?access_token=${mapKey}`
    );

    const blob = await data.blob();

    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Response(buffer);
}
