import z from "zod";
import { EnvResult } from "../lib/env";
import { httpRequest } from "./http-request";
import { parseResponseJSON } from "./parse-response-json";
import { zodParseAsync } from "./zod-parse-async";

export function fetchGithubAccessToken(code: string) {
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
    })
        .andThen(parseResponseJSON)
        .andThen(
            zodParseAsync(
                z
                    .object({
                        access_token: z.string().startsWith("gho_"),
                        scope: z.string(),
                        token_type: z.enum(["bearer"]),
                    })
                    .transform(({ access_token, scope }) => ({ accessToken: access_token, scope })),
            ),
        );
}
