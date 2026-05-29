import { GenericError } from "../types/generic-error";
import { errorToJSON } from "./error-to-json";

export function errorToString(error: GenericError) {
    return JSON.stringify(errorToJSON(error));
}
