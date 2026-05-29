import z from "zod";

export class GenericError {
    constructor(
        public name: string,
        public message: string,
        public metadata: {
            stack?: string[];
            cause?: GenericError;
        } & JSONObject,
    ) {}
}

function toJSONSerializableObject(value: object): JSONObject {
    return JSON.parse(JSON.stringify(value)) as JSONObject;
}

function toMetadata(value: unknown): JSONObject | undefined {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        return { value };
    }

    if (typeof value === "undefined" || value === null) {
        return undefined;
    }

    if (typeof value === "function" || typeof value === "bigint" || typeof value === "symbol") {
        return undefined;
    }

    return toJSONSerializableObject(value);
}

function toErrorStack(stack: undefined): undefined;
function toErrorStack(stack: string): string[];
function toErrorStack(stack: string | undefined): string[] | undefined;
function toErrorStack(stack: string | undefined) {
    if (stack === undefined) {
        return undefined;
    }

    return stack.split("\n").map((l) => l.trim());
}

export function toGenericError(error: Error, name?: string, message?: string, metadata?: JSONObject): GenericError;
export function toGenericError(error: z.ZodError, name?: string, message?: string, metadata?: JSONObject): GenericError;
export function toGenericError(error: GenericError): GenericError;

export function toGenericError(
    error: Error | z.ZodError | GenericError,
    name?: string,
    message?: string,
    metadata?: JSONObject,
): GenericError {
    if (error instanceof GenericError) {
        return error;
    }

    if (error instanceof z.ZodError) {
        return new GenericError(name ?? "ZOD", message ?? error.message, {
            stack: toErrorStack(error.stack),
            errors: JSON.parse(error.message),
            ...metadata,
        });
    }

    return new GenericError(name ?? "GENERIC", message ?? error.message, {
        ...(error.cause instanceof GenericError
            ? { cause: error.cause }
            : error.cause instanceof Error || error.cause instanceof z.ZodError
              ? { cause: toGenericError(error.cause) }
              : toMetadata(error.cause)),

        ...(error.stack ? { stack: toErrorStack(error.stack) } : {}),
        ...metadata,
    });
}
