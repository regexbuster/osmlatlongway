import { decode } from '@googlemaps/polyline-codec';

export async function POST(req, res) {
    const jsonData = await req.json();
    const decodedData = decode(jsonData.polyline);

    return Response.json({ coords: decodedData });
}
