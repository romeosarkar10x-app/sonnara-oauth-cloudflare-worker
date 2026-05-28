import { fromPromise } from "neverthrow";

export function httpRequest(input: RequestInfo | URL, init?: RequestInit<RequestInitCfProperties>) {
    return fromPromise(fetch(input, init), (error) => {
        return error as DOMException | TypeError;
    });
}
