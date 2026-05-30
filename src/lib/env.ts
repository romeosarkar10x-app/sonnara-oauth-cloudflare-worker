import z from "zod";
import { zodParseAsync } from "../utils/zod-parse-async";
import { env } from "cloudflare:workers";

const EnvSchema = z.object({
    GITHUB_OAUTH_CLIENT_ID: z.string().min(1),
    GITHUB_OAUTH_CLIENT_SECRET: z.string().min(1),
});

export const EnvResultAsync = zodParseAsync(EnvSchema)(env);
