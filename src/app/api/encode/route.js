import { encode } from '@googlemaps/polyline-codec';

export async function POST(req, res) {
    const jsonData = await req.json();
    const encodedData = encode(jsonData.coords);

    return Response.json({ polyline: encodedData });
}
