import { getRequestCount } from "@/lib/metrics";

export async function GET() {
    const data = await getRequestCount();

    return Response.json(data);
}
