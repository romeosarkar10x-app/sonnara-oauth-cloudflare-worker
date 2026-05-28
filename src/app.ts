import { Hono } from "hono";
import { packageJSON } from "./utils/package-json";
import { cors } from "hono/cors";
import { fetchGithubAccessToken } from "./utils/fetch-github-access-token";
import { fetchUserProfile } from "./utils/fetch-user-profile";

export const app = new Hono();

app.use(
    "/",
    cors({
        allowMethods: ["POST", "GET", "OPTIONS"],
    }),
);

function textResponse(message: string) {
    return new Response(message, {
        status: 200,
        headers: {
            "Content-Type": "text/plain",
        },
    });
}

function jsonResponse(data: unknown) {
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
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

app.get("/version", () => {
    const version = packageJSON.version;
    return textResponse(version);
});

app.get("/callback", async (ctx) => {
    const code = ctx.req.param("code");

    if (code === undefined) {
        return errorResponse("Param 'code' is undefined");
    }

    const githubAccessTokenResult = await fetchGithubAccessToken(code);

    if (githubAccessTokenResult.isErr()) {
        console.error(githubAccessTokenResult.error);
        return errorResponse("Failed to get github access token");
    }

    const githubAccessToken = githubAccessTokenResult.value;
    const userProfileResult = await fetchUserProfile(githubAccessToken.accessToken);

    if (userProfileResult.isErr()) {
        console.error(userProfileResult.error);
        return errorResponse("Failed to get user profile");
    }

    const userProfile = userProfileResult.value;
    console.log("User profile:", userProfile);

    return jsonResponse(userProfile);
});
