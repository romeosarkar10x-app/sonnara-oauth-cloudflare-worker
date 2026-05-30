import { fromPromise } from "neverthrow";
import { GenericError, toGenericError } from "../types/generic-error";

export function parseResponseJSON(response: Response) {
    return fromPromise(
        (async () => {
            const text = await response.text();

            try {
                return JSON.parse(text);
            } catch (error) {
                throw new GenericError("JSON_PARSE", "Failed to parse response body as json", {
                    cause: toGenericError(error as DOMException | TypeError | SyntaxError),
                    responseBody: text,
                });
            }
        })(),
        (error) => {
            return error as GenericError;
        },
    );
}
