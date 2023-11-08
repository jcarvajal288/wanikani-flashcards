import { WaniKaniSubject } from '../types.ts';
import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { bind } from 'wanakana';
import {ChangeEvent, KeyboardEvent, useEffect, useRef, useState} from 'react';

const radicalColor = '#00AAFF';
const kanjiColor = '#FF00AA';
const vocabColor = '#AA00FF';

const correctColor = '#00FF00';
const incorrectColor = '#FF0000';

interface QuestionParams {
    subject: WaniKaniSubject;
    moveToNextSubject: () => void;
}

export const Question = (props: QuestionParams) => {
    const [answerInputValue, setAnswerInputValue] = useState<string>('');
    const answerInputRef = useRef(null);

    useEffect(() => {
        bind(answerInputRef.current!);
    }, []);

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

    const checkAnswer = (): void => {
        const acceptedReadings = props.subject.data.readings.map((r) => r.reading);
        if (acceptedReadings.includes(answerInputValue)) {
            setAnswerInputValue('');
            props.moveToNextSubject();
        }
    };

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        console.log(answerInputRef.current);
        if (event.key === 'Enter') {
            checkAnswer();
        }
    };

    return (
        <>
            <Stack>
                <Paper
                    sx={{
                        bgcolor: determineColor(props.subject),
                        color: '#FFFFFF',
                    }}
                >
                    <Typography
                        variant='h1'
                        fontWeight={400}
                        marginTop='20px'
                    >
                        {props.subject.data.characters}
                    </Typography>
                </Paper>
                <TextField
                    value={answerInputValue}
                    inputRef={answerInputRef}
                    onInput={(event: ChangeEvent<HTMLInputElement>) => {
                        setAnswerInputValue(event.target.value);
                    }}
                    onKeyDown={onKeyDown}
                />
                <Button onClick={checkAnswer}>Check Answer</Button>
            </Stack>
        </>
    );
};
