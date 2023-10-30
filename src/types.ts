export type JSONValue = string | number | boolean | JSONObject | JSONArray;

interface JSONObject {
    [x: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}

export type WaniKaniSubject = {
    data: {
        characters: string;
    };
    object: 'radical' | 'kanji' | 'vocabulary' | 'kana_vocabulary';
};
