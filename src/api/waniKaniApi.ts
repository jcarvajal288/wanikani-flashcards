import { QuizConfigFormData } from '../pages/QuizConfig.tsx';
import axios from 'axios';
import { postSubjects } from './backendApi.ts';

const waniKaniApiUrl = 'https://api.wanikani.com/v2';

const buildHeaders = (quizConfig: QuizConfigFormData) => {
    return {
        headers: { Authorization: `Bearer ${quizConfig.apiKey}` },
    };
};

const constructQueryString = (qc: QuizConfigFormData): string => {
    const subjectTypes = (qc: QuizConfigFormData): string => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const subjectKeys = Object.keys(qc.subjectTypes).filter((key) => qc.subjectTypes[key]);
        if (subjectKeys.length === 0) return '';
        const initialString = subjectKeys.join(',');
        return `subject_types=${initialString}` + (qc.subjectTypes.vocabulary ? ',kana_vocabulary' : '');
    };
    return `${waniKaniApiUrl}/assignments?${subjectTypes(qc)}`;
};

export const fetchQuizItems = async (quizConfig: QuizConfigFormData) => {
    const queryString = constructQueryString(quizConfig);
    return await axios.get(queryString, buildHeaders(quizConfig));
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
                    console.log('in next url');
                    await fetchAndPost(apiKey, nextUrl);
                }
            });
    };
    await fetchAndPost(apiKey, `${waniKaniApiUrl}/subjects`);
};
