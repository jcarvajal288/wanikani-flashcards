import { WaniKaniSubject } from '../types.ts';
import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import {bind, unbind} from 'wanakana';
import {ChangeEvent, KeyboardEvent, useEffect, useRef, useState} from 'react';
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
    numberOfSubjectsCompleted: number;
    totalSubjects: number;
}

export const Question = (props: QuestionParams) => {
    const [answerInputValue, setAnswerInputValue] = useState<string>('');
    const [answerCorrectness, setAnswerCorrectness] = useState<boolean | null>(null);
    const answerInputRef = useRef(null);
    const [isRefBound, setIsRefBound] = useState<boolean>(false);

    useEffect(() => {
        if (props.type === 'reading' && !isRefBound) {
            bind(answerInputRef.current!);
            setIsRefBound(true);
        } else if (isRefBound) {
            unbind(answerInputRef.current!);
            setIsRefBound(false);
        }
    }, [props.type]);

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
            const acceptedAnswers = props.type === 'reading'
                ? props.subject.data.readings!.map((r) => r.reading)
                : props.subject.data.meanings.map((m) => m.meaning.toLowerCase());
            setAnswerCorrectness(acceptedAnswers.includes(answerInputValue.toLowerCase()));
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
        const questionType = props.type === 'reading' ? 'Reading' : 'Meaning';
        return `${subjectType} <b>${questionType}</b>`;
    };

    const determineSubmitButtonText = () => {
        if (answerCorrectness === true) return 'Next';
        else if (answerCorrectness === false) return 'Retry';
        else return 'Check Answer';
    }

    return (
        <>
            <Stack>
                <Typography>{`${props.numberOfSubjectsCompleted + 1}/${props.totalSubjects}`}</Typography>
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
                            textAlign: 'center',
                            fontSize: 20
                        },
                    }}
                />
                <Stack
                    direction='row'
                    justifyContent='space-between'
                >
                    <Button disabled={true}></Button>
                    <Button onClick={checkAnswer}>{determineSubmitButtonText()}</Button>
                    <Button href={props.subject.data.document_url} target='_blank'>Subject Page</Button>
                </Stack>
            </Stack>
        </>
    );
};
