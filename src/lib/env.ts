import z from "zod";
import { zodParseAsync } from "../utils/zodParseAsync";
import { env } from "cloudflare:workers";

const EnvSchema = z.object({
    GITHUB_OAUTH_CLIENT_ID: z.string().min(1),
    GITHUB_OAUTH_CLIENT_SECRET: z.string().min(1),
});

export const EnvResult = zodParseAsync(EnvSchema)(env);
