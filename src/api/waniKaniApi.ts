import { QuizConfigFormData } from '../pages/QuizConfig.tsx';
import axios from 'axios';

const waniKaniApiUrl = 'https://api.wanikani.com/v2';

export const fetchQuizItems = (quizConfig: QuizConfigFormData) => {
    console.log(JSON.stringify(quizConfig));
};

export const fetchWaniKaniSubjectData = async (apiKey: string) => {
    console.log('fetching WaniKani subject data');
    return await axios
        .get(`${waniKaniApiUrl}/subjects`, {
            headers: { Authorization: `Bearer ${apiKey}` },
        })
        .then((response) => {
            const subjects = response.data.data;
            console.log(`Number of subjects fetched: ${subjects.length}`);
            return subjects;
        });
};
