import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { loadSubjects } from '../api/backendApi.ts';
import {QuizQuestion, WaniKaniSubject} from '../types.ts';
import { Question } from './Question.tsx';

interface QuizParams {
    quizItems: number[];
    returnHome: () => void;
}

export const Quiz = (props: QuizParams) => {
    const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

    useEffect(() => {
        loadSubjects(props.quizItems).then((fetchedSubjects: WaniKaniSubject[]) => {
            const questions: QuizQuestion[] = fetchedSubjects.map((subject) => {
                return [{subject: subject, type: 'reading' as const}, {subject: subject, type: 'meaning' as const}]
            }).flat()
            setQuestions(questions);
        });
    }, [props.quizItems]);

    if (!questions) {
        return <Typography>Loading...</Typography>;
    } else if (currentQuestionIndex >= questions.length) {
        return (
            <>
                <Typography variant='h1'>Quiz Finished!</Typography>
                <Button onClick={props.returnHome}>Return to Configuration</Button>
            </>
        );
    } else {
        return (
            <Question
                subject={questions[currentQuestionIndex].subject}
                moveToNextSubject={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                type={questions[currentQuestionIndex].type}
            />
        );
    }
};
