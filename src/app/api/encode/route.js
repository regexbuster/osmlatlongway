import { encode, decode } from '@googlemaps/polyline-codec';

export async function POST(req, res) {
    const jsonData = await req.json();
    const encodedData = encode(jsonData.coords);

    return Response.json({ encoded: encodedData });
}
