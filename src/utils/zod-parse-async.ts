import { fromPromise } from "neverthrow";
import z from "zod";
import { toGenericError } from "../types/generic-error";

export function zodParseAsync<T extends z.ZodType>(zodSchema: T) {
    return function (data: unknown) {
        return fromPromise(zodSchema.parseAsync(data), (error: unknown) => {
            return toGenericError(
                error as z.ZodError,
                undefined,
                "Failed to parse zod schema" + zodSchema.description ? " " + zodSchema.description : "",
                { input: data },
            );
        });
    };
}
