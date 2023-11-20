import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { loadSubjects } from '../api/backendApi.ts';
import { QuizQuestion, WaniKaniSubject } from '../types.ts';
import { Question } from './Question.tsx';

interface QuizParams {
    quizItems: number[];
    returnHome: () => void;
    shuffle: boolean;
}

export const Quiz = (props: QuizParams) => {
    const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

    const shuffle = (unshuffled: WaniKaniSubject[]) =>
        unshuffled
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);

    useEffect(() => {
        loadSubjects(props.quizItems).then((fetchedSubjects: WaniKaniSubject[]) => {
            const subjects = props.shuffle ? shuffle(fetchedSubjects) : fetchedSubjects;
            const questions: QuizQuestion[] = subjects
                .map((subject) => {
                    if (Object.hasOwn(subject.data, 'readings')) {
                        return [
                            { subject: subject, type: 'reading' as const },
                            { subject: subject, type: 'meaning' as const },
                        ];
                    } else {
                        return [{ subject: subject, type: 'meaning' as const }];
                    }
                })
                .flat();
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
