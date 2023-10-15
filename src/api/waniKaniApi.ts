import { QuizConfigFormData } from '../pages/QuizConfig.tsx';
import axios from 'axios';

const waniKaniApiUrl = 'https://api.wanikani.com/v2';

export const fetchQuizItems = (quizConfig: QuizConfigFormData) => {
    console.log(JSON.stringify(quizConfig));
};

export const fetchWaniKaniSubjectData = (apiKey: string) => {
    console.log('fetching WaniKani subject data');
    axios
        .get(`${waniKaniApiUrl}/subjects`, {
            headers: { Authorization: `Bearer ${apiKey}` },
        })
        .then((response) => {
            console.log(`Number of subjects fetched: ${response.data.data.length}`);
        });
};
