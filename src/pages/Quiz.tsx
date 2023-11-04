import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { loadSubjects } from '../api/backendApi.ts';
import { WaniKaniSubject } from '../types.ts';

const radicalColor = '#00AAFF';
const kanjiColor = '#FF00AA';
const vocabColor = '#AA00FF';

interface QuizParams {
    quizItems: number[];
    returnHome: () => void;
}

export const Quiz = (props: QuizParams) => {
    const [subjects, setSubjects] = useState<WaniKaniSubject[] | null>(null);
    const [currentSubject, setCurrentSubject] = useState<number>(0);
    useEffect(() => {
        loadSubjects(props.quizItems).then((fetchedSubjects: WaniKaniSubject[]) => {
            setSubjects(fetchedSubjects);
        });
    }, [props.quizItems]);

    const determineColor = (waniKaniSubject: WaniKaniSubject): string => {
        switch (waniKaniSubject.object) {
            case 'radical':
                return radicalColor;
            case 'kanji':
                return kanjiColor;
            default:
                return vocabColor;
        }
    };
    if (!subjects) {
        return <Typography>Loading...</Typography>;
    } else if (currentSubject >= subjects.length) {
        return (
            <>
                <Typography variant='h1'>Quiz Finished!</Typography>
                <Button onClick={props.returnHome}>Return to Configuration</Button>
            </>
        );
    } else {
        return (
            <>
                {subjects && (
                    <Stack>
                        <Paper
                            sx={{
                                bgcolor: determineColor(subjects[currentSubject]),
                                color: '#FFFFFF',
                            }}
                        >
                            <Typography
                                variant='h1'
                                fontWeight={400}
                                marginTop='20px'
                            >
                                {subjects[currentSubject].data.characters}
                            </Typography>
                        </Paper>
                        <TextField />
                        <Button onClick={() => setCurrentSubject(currentSubject + 1)}>Next Subject</Button>
                    </Stack>
                )}
            </>
        );
    }
};
