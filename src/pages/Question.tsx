import { WaniKaniSubject } from '../types.ts';
import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { toHiragana } from 'wanakana';
import { KeyboardEvent, useState } from 'react';

const radicalColor = '#00AAFF';
const kanjiColor = '#FF00AA';
const vocabColor = '#AA00FF';

interface QuestionParams {
    subject: WaniKaniSubject;
    moveToNextSubject: () => void;
}

export const Question = (props: QuestionParams) => {
    const [answerInputValue, setAnswerInputValue] = useState<string>('');

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
        const acceptedReadings = props.subject.data.readings.map((r) => r.reading);
        if (acceptedReadings.includes(answerInputValue)) {
            setAnswerInputValue('');
            props.moveToNextSubject();
        }
    };

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
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
                    onChange={(event) => convertRomaji(event.target.value)}
                    onKeyDown={onKeyDown}
                />
                <Button onClick={checkAnswer}>Check Answer</Button>
            </Stack>
        </>
    );
};
