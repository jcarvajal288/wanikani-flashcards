export type JSONValue = string | number | boolean | JSONObject | JSONArray;

interface JSONObject {
    [x: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}

type SubjectReading = {
    reading: string;
};

export type WaniKaniSubject = {
    data: {
        characters: string;
        readings: SubjectReading[];
    };
    object: 'radical' | 'kanji' | 'vocabulary' | 'kana_vocabulary';
};
