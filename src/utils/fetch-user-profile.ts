import { httpRequest } from "./http-request";
import { parseResponseJSON } from "./parse-response-json";
import { zodParseAsync } from "./zod-parse-async";
import z from "zod";

export function fetchUserProfile(githubToken: string) {
    return httpRequest("https://api.github.com/user", {
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${githubToken}`,
        },
    })
        .andThen(parseResponseJSON)
        .andThen(
            zodParseAsync(
                z
                    .object({
                        login: z.string(),
                        id: z.number(),
                        node_id: z.string(),
                        name: z.string(),
                        email: z.string(),
                        avatar_url: z.string(),
                        created_at: z.coerce.date(),
                        updated_at: z.coerce.date(),
                    })
                    .transform((v) => ({
                        username: v.login,
                        userID: v.id,
                        nodeID: v.node_id,
                        name: v.name,
                        email: v.email,
                        avatarURL: v.avatar_url,
                        createdAt: v.created_at,
                        updatedAt: v.updated_at,
                    })),
            ),
        );
}
