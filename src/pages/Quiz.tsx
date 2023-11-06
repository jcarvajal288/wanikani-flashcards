import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { loadSubjects } from '../api/backendApi.ts';
import { WaniKaniSubject } from '../types.ts';
import { Question } from './Question.tsx';

interface QuizParams {
    quizItems: number[];
    returnHome: () => void;
}

export const Quiz = (props: QuizParams) => {
    const [subjects, setSubjects] = useState<WaniKaniSubject[] | null>(null);
    const [currentSubjectIndex, setCurrentSubjectIndex] = useState<number>(0);

    useEffect(() => {
        loadSubjects(props.quizItems).then((fetchedSubjects: WaniKaniSubject[]) => {
            setSubjects(fetchedSubjects);
        });
    }, [props.quizItems]);

    if (!subjects) {
        return <Typography>Loading...</Typography>;
    } else if (currentSubjectIndex >= subjects.length) {
        return (
            <>
                <Typography variant='h1'>Quiz Finished!</Typography>
                <Button onClick={props.returnHome}>Return to Configuration</Button>
            </>
        );
    } else {
        return (
            <Question
                subject={subjects[currentSubjectIndex]}
                moveToNextSubject={() => setCurrentSubjectIndex(currentSubjectIndex + 1)}
            />
        );
    }
};
