import { WaniKaniSubject } from '../types.ts';
import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { bind } from 'wanakana';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import parse from 'html-react-parser';

const radicalColor = '#00AAFF';
const kanjiColor = '#FF00AA';
const vocabColor = '#AA00FF';

const correctColor = '#88CC00';
const incorrectColor = '#FF0033';

interface QuestionParams {
    subject: WaniKaniSubject;
    moveToNextSubject: () => void;
    type: 'reading' | 'meaning';
}

export const Question = (props: QuestionParams) => {
    const [answerInputValue, setAnswerInputValue] = useState<string>('');
    const [answerCorrectness, setAnswerCorrectness] = useState<boolean | null>(null);
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
        if (answerCorrectness === null) {
            const acceptedReadings = props.subject.data.readings.map((r) => r.reading);
            setAnswerCorrectness(acceptedReadings.includes(answerInputValue));
            return;
        }
        if (answerCorrectness) {
            props.moveToNextSubject();
        }
        setAnswerCorrectness(null);
        setAnswerInputValue('');
    };

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (answerCorrectness !== null) {
            event.preventDefault();
        }
        if (event.key === 'Enter') {
            checkAnswer();
        }
    };

    const determineInputColor = () => {
        if (answerCorrectness === true) return correctColor;
        else if (answerCorrectness === false) return incorrectColor;
        else return '#FFFFFF';
    };

    const determineTextColor = () => {
        return answerCorrectness === null ? '#000000' : '#FFFFFF';
    };

    const buildTypeHeader = () => {
        const subjectType =
            props.subject.object === 'kana_vocabulary'
                ? 'Vocabulary'
                : props.subject.object[0].toUpperCase() + props.subject.object.slice(1);
        const questionType = 'Reading';
        return `${subjectType} <b>${questionType}</b>`;
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
                <Paper
                    data-testid='type-header'
                    sx={{
                        bgcolor: '#333333',
                        color: '#FFFFFF',
                    }}
                >
                    <Typography variant='h6'>{parse(buildTypeHeader())}</Typography>
                </Paper>
                <TextField
                    value={answerInputValue}
                    inputRef={answerInputRef}
                    onInput={(event: ChangeEvent<HTMLInputElement>) => {
                        setAnswerInputValue(event.target.value);
                    }}
                    onKeyDown={onKeyDown}
                    sx={{
                        bgcolor: determineInputColor(),
                        input: {
                            color: determineTextColor(),
                        },
                    }}
                />
                <Button onClick={checkAnswer}>Check Answer</Button>
            </Stack>
        </>
    );
};
