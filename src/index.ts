export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext) {
        const url = new URL(request.url);
        const path = url.pathname;

        // CORS headers for all responses
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        };

        // Handle preflight
        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        // Simple router
        if (path === "/" || path === "") {
            return json({ message: "Hello from Cloudflare Workers!", version: "1.0.0" }, corsHeaders);
        }

        if (path === "/health") {
            return json({ status: "ok", timestamp: new Date().toISOString() }, corsHeaders);
        }

        if (path === "/echo" && request.method === "POST") {
            const body = await request.json().catch(() => null);
            if (!body) {
                return json({ error: "Invalid JSON body" }, corsHeaders, 400);
            }
            return json({ echo: body }, corsHeaders);
        }

        // 404 fallback
        return json({ error: "Not found", path }, corsHeaders, 404);
    },
};

function json(data: object, extraHeaders = {}, status = 200) {
    return new Response(JSON.stringify(data, null, 2), {
        status,
        headers: {
            "Content-Type": "application/json",
            ...extraHeaders,
        },
    });
}
