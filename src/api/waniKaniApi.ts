import axios from 'axios';
import { postSubjects } from './backendApi.ts';
import {QuizConfigFormData} from "../types.ts";

const waniKaniApiUrl = 'https://api.wanikani.com/v2';

const buildHeaders = (quizConfig: QuizConfigFormData) => {
    return {
        headers: { Authorization: `Bearer ${quizConfig.apiKey}` },
    };
};

const constructQueryString = (qc: QuizConfigFormData): string => {
    const buildSubjectParam = (qc: QuizConfigFormData): string => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const subjectKeys = Object.keys(qc.subjectTypes).filter((key) => qc.subjectTypes[key]);
        if (subjectKeys.length === 0) return '';
        const initialString = subjectKeys.join(',');
        return `subject_types=${initialString}` + (qc.subjectTypes.vocabulary ? ',kana_vocabulary' : '');
    };

    const buildSrsParam = (qc: QuizConfigFormData): string => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const srsKeys = Object.entries(qc.srsLevels);
        const srsStages = srsKeys
            .map((entry) => [srsKeys.indexOf(entry), entry[1]])
            .filter((entry) => entry[1])
            .map((entry) => Number(entry[0]) + 1);
        if (srsStages.length > 0) {
            return 'srs_stages=' + srsStages.join(',');
        } else return '';
    };

    const parameters = [buildSubjectParam(qc), buildSrsParam(qc)].filter((p) => p.length > 0).join('&');
    return `${waniKaniApiUrl}/assignments?${parameters}`;
};

export const fetchQuizItems = async (quizConfig: QuizConfigFormData): Promise<number[]> => {
    const queryString = constructQueryString(quizConfig);
    return await axios.get(queryString, buildHeaders(quizConfig)).then((response) => {
        return response.data.data.map((assignment: { data: { subject_id: number } }) => assignment.data.subject_id);
    });
};

export const fetchAndPostWaniKaniSubjectData = async (apiKey: string): Promise<void> => {
    const fetchAndPost = async (apiKey: string, url: string) => {
        await axios
            .get(url, {
                headers: { Authorization: `Bearer ${apiKey}` },
            })
            .then(async (response) => {
                const subjects = response.data.data;
                const nextUrl = response.data.pages.next_url;
                await postSubjects(subjects);
                if (nextUrl) {
                    await fetchAndPost(apiKey, nextUrl);
                }
            });
    };
    await fetchAndPost(apiKey, `${waniKaniApiUrl}/subjects`);
};

export const fetchCriticalConditionItems = async (quizConfig: QuizConfigFormData): Promise<number[]> => {
    const threshold = quizConfig.percentageCorrectThreshold;
    return axios.get(`https://api.wanikani.com/v2/review_statistics?percentages_less_than=${threshold}`, buildHeaders(quizConfig))
}

