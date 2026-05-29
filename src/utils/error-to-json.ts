import { GenericError } from "../types/generic-error";

export type ErrorJSONType = {
    name: string;
    message: string;
    metadata: {
        stack?: string[];
        cause?: ErrorJSONType;
    } & JSONObject;
};

export function errorToJSON(error: GenericError): ErrorJSONType {
    return {
        ...error,
    };
}
