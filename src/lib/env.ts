import z from "zod";
import { zodParseAsync } from "../utils/zod-parse-async";
import { env } from "cloudflare:workers";

const EnvSchema = z.object({
    GIT_COMMIT_SHA: z.hex().length(40),
    GITHUB_OAUTH_CLIENT_ID: z.string().min(1),
    GITHUB_OAUTH_CLIENT_SECRET: z.string().min(1),
});

export const EnvResultAsync = zodParseAsync(EnvSchema)(env);
