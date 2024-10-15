import { headers } from 'next/headers';

export async function GET(req, res) {
    const headersList = headers();
    const authKey = headersList.get('authKey');

    const searchParams = req.nextUrl.searchParams;

    console.log(searchParams);

    if (authKey != process.env.AUTHKEY) {
        return new Response(
            'Auth Key Incorrect. Supply mapbox api key and use staticMapImage endpoint if not authorized.',
            { status: 401 }
        );
    }

    let data = await fetch(
        `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/path-5+f44-0.5(${searchParams.get(
            'polyline'
        )})/auto/800x400?access_token=${process.env.MAPTOKEN}`
    );

    const blob = await data.blob();

    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Response(buffer);
}
