import { QuizConfigFormData } from '../pages/QuizConfig.tsx';
import axios from 'axios';
import { postSubjects } from './backendApi.ts';

const waniKaniApiUrl = 'https://api.wanikani.com/v2';

export const fetchQuizItems = (quizConfig: QuizConfigFormData) => {
    console.log(JSON.stringify(quizConfig));
};

export const fetchAndPostWaniKaniSubjectData = async (apiKey: string): Promise<void> => {
    const fetchAndPost = async (apiKey: string, url: string) => {
        console.log(`GET: ${url}`);
        await axios
            .get(url, {
                headers: { Authorization: `Bearer ${apiKey}` },
            })
            .then(async (response) => {
                const subjects = response.data.data;
                const nextUrl = response.data.pages.next_url;
                console.log(`Number of subjects fetched: ${subjects.length}`);
                await postSubjects(subjects);
                if (nextUrl) {
                    await fetchAndPost(apiKey, nextUrl);
                }
            });
    };
    await fetchAndPost(apiKey, `${waniKaniApiUrl}/subjects`);
};
