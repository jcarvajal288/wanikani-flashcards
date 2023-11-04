import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { loadSubjects } from '../api/backendApi.ts';
import { WaniKaniSubject } from '../types.ts';
import { toHiragana } from 'wanakana';

const radicalColor = '#00AAFF';
const kanjiColor = '#FF00AA';
const vocabColor = '#AA00FF';

interface QuizParams {
    quizItems: number[];
    returnHome: () => void;
}

export const Quiz = (props: QuizParams) => {
    const [subjects, setSubjects] = useState<WaniKaniSubject[] | null>(null);
    const [currentSubjectIndex, setCurrentSubjectIndex] = useState<number>(0);
    const [answerInputValue, setAnswerInputValue] = useState<string>('');

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

    const convertRomaji = (romaji: string): void => {
        const newCharacter = romaji.slice(answerInputValue.length);
        if (newCharacter === 'n') {
            if (answerInputValue.charAt(answerInputValue.length - 1) === 'n') {
                setAnswerInputValue(answerInputValue.slice(0, -1) + 'ん');
            } else {
                setAnswerInputValue(romaji);
            }
        } else {
            setAnswerInputValue(toHiragana(romaji));
        }
    };

    const checkAnswer = (): void => {
        if (subjects === null) return;

        const acceptedReadings = subjects[currentSubjectIndex].data.readings.map((r) => r.reading);
        if (acceptedReadings.includes(answerInputValue)) {
            setCurrentSubjectIndex(currentSubjectIndex + 1);
            setAnswerInputValue('');
        }
    };

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
            <>
                {subjects && (
                    <Stack>
                        <Paper
                            sx={{
                                bgcolor: determineColor(subjects[currentSubjectIndex]),
                                color: '#FFFFFF',
                            }}
                        >
                            <Typography
                                variant='h1'
                                fontWeight={400}
                                marginTop='20px'
                            >
                                {subjects[currentSubjectIndex].data.characters}
                            </Typography>
                        </Paper>
                        <TextField
                            value={answerInputValue}
                            onChange={(event) => convertRomaji(event.target.value)}
                        />
                        <Button onClick={checkAnswer}>Check Answer</Button>
                    </Stack>
                )}
            </>
        );
    }
};
