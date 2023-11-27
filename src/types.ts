export type JSONValue = string | number | boolean | JSONObject | JSONArray;

interface JSONObject {
    [x: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}

type SubjectReading = {
    reading: string;
};

type SubjectMeaning = {
    meaning: string;
};

export type WaniKaniSubject = {
    data: {
        characters: string;
        readings?: SubjectReading[];
        meanings: SubjectMeaning[];
        document_url: string;
    };
    object: 'radical' | 'kanji' | 'vocabulary' | 'kana_vocabulary';
};

export type QuizQuestion = {
    subject: WaniKaniSubject;
    type: 'reading' | 'meaning';
};
