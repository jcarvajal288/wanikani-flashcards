import { QuizConfigFormData } from '../pages/QuizConfig.tsx';

export const fetchQuizItems = (quizConfig: QuizConfigFormData) => {
    console.log(JSON.stringify(quizConfig));
};

export const fetchWaniKaniSubjectData = () => {
    console.log('fetching WaniKani subject data');
};
