import { Hono } from "hono";
import { packageJSON } from "./utils/package-json";
import { cors } from "hono/cors";
import { fetchGithubAccessToken } from "./utils/fetch-github-access-token";
import { fetchUserProfile } from "./utils/fetch-user-profile";
import { errorToString } from "./utils/error-to-string";
import { toGenericError } from "./types/generic-error";

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

function errorResponse(error: Error) {
    return new Response(errorToString(toGenericError(error)));
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
    const code = ctx.req.query("code");

    if (code === undefined) {
        return errorResponse(new Error("Query param 'code' is undefined"));
    }

    const githubAccessTokenResult = await fetchGithubAccessToken(code);

    if (githubAccessTokenResult.isErr()) {
        console.error(githubAccessTokenResult.error);
        return errorResponse(new Error("Failed to get github access token", { cause: githubAccessTokenResult.error }));
    }

    const githubAccessToken = githubAccessTokenResult.value;
    const userProfileResult = await fetchUserProfile(githubAccessToken.accessToken);

    if (userProfileResult.isErr()) {
        console.error(userProfileResult.error);
        return errorResponse(new Error("Failed to get user profile", { cause: userProfileResult.error }));
    }

    const userProfile = userProfileResult.value;
    console.log("User profile:", userProfile);

    return jsonResponse(userProfile);
});
