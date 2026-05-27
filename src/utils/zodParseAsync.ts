import { fromPromise } from "neverthrow";
import z, { ZodError } from "zod";

export function zodParseAsync<T extends z.ZodType>(zodSchema: T) {
    return function (data: unknown) {
        return fromPromise(zodSchema.parseAsync(data), (error: unknown) => {
            return error as ZodError;
        });
    };
}
