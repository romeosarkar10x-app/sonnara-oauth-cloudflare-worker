import { env } from "cloudflare:workers";
import { Hono } from "hono";
import { corsHeaders } from "./constants";
import { EnvResult } from "./lib/env";
import { httpRequest } from "./utils/http-request";
import { packageJSON } from "./utils/package-json";

export const app = new Hono();

function textResponse(message: string) {
    return new Response(message, {
        status: 200,
        headers: {
            "Content-Type": "text/plain",
        },
    });
}

function errorResponse(message: string) {
    return new Response(message, {
        status: 500,
        headers: {
            "Content-Type": "text/plain",
        },
    });
}

app.get("/health", (ctx) => {
    const ip = ctx.req.header("CF-Connecting-IP");

    if (ip === undefined) {
        return textResponse("Hi!");
    }

    return textResponse(`Hi ${ip}!`);
});

app.get("/callback", async (ctx) => {
    const code = ctx.req.param("code");

    if (code === undefined) {
        return errorResponse("Param 'code' is undefined");
    }

    const githubAccessTokenResult = await getGithubAccessToken(code);

    if (githubAccessTokenResult.isErr()) {
        console.error(githubAccessTokenResult.error);
        return errorResponse("Failed to get github access token");
    }

    const githubAccessToken = githubAccessTokenResult.value;
});

function getGithubAccessToken(code: string) {
    return EnvResult.andThen((env) => {
        const searchParams = new URLSearchParams();
        searchParams.append("client_id", env.GITHUB_OAUTH_CLIENT_ID);
        searchParams.append("client_secret", env.GITHUB_OAUTH_CLIENT_SECRET);
        searchParams.append("code", code);

        return httpRequest("https://github.com/login/oauth/access_token?" + searchParams.toString(), {
            headers: {
                Accept: "application/json",
            },
        });
    });
}
