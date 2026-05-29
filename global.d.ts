declare global {
    type JSONString = string;
    type JSONNumber = number;
    type JSONBoolean = boolean;
    type JSONNull = null;

    type JSONObject = {
        [key: string]: JSONString | JSONNumber | JSONBoolean | JSONNull | JSONUndefined | JSONArray;
    };

    type JSONArray = (JSONString | JSONNumber | JSONBoolean | JSONNull | JSONObject | JSONArray)[];

    type JSONValue = JSONString | JSONNumber | JSONBoolean | JSONObject | JSONArray;

    interface JSON {
        parse(text: string, reviver?: (this: unknown, key: string, value: unknown) => unknown): JSONValue;
    }
}

export {};
