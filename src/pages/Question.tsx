import {WaniKaniSubject} from '../types.ts';
import {Button, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import {bind, unbind} from 'wanakana';
import {ChangeEvent, KeyboardEvent, useEffect, useRef, useState} from 'react';
import parse from 'html-react-parser';

const radicalColor = '#00AAFF';
const kanjiColor = '#FF00AA';
const vocabColor = '#AA00FF';

const correctColor = '#88CC00';
const halfCorrectColor = '#FFD700';
const incorrectColor = '#FF0033';

type AnswerCorrectness = 'correct' | 'incorrect' | 'half-correct'

type SubjectAnswer = {
    answer: string;
    primary: boolean;
}

type QuestionParams = {
    subject: WaniKaniSubject;
    moveToNextSubject: () => void;
    type: 'reading' | 'meaning';
    numberOfSubjectsCompleted: number;
    totalSubjects: number;
}

export const Question = (props: QuestionParams) => {
    const [answerInputValue, setAnswerInputValue] = useState<string>('');
    const [answerCorrectness, setAnswerCorrectness] = useState<AnswerCorrectness | null>(null);
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

    const determineSubjectColor = (waniKaniSubject: WaniKaniSubject): string => {
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
            const acceptedAnswers: SubjectAnswer[] = props.type === 'reading'
                ? props.subject.data.readings!.map((r): SubjectAnswer => ({
                      answer: r.reading,
                      primary: r.primary
                  }))
                : props.subject.data.meanings.map((m): SubjectAnswer => ({
                      answer: m.meaning.toLowerCase(),
                      primary: true
                  }));
            const answer = acceptedAnswers.find(a => a.answer === answerInputValue.toLowerCase());
            if (answer) {
                if (answer.primary) setAnswerCorrectness('correct');
                else setAnswerCorrectness('half-correct')
            } else {
                setAnswerCorrectness('incorrect');
            }
            return;
        }
        if (answerCorrectness === 'correct') {
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
        if (answerCorrectness === 'correct') return correctColor;
        else if (answerCorrectness === 'half-correct') return halfCorrectColor;
        else if (answerCorrectness === 'incorrect') return incorrectColor;
        else return '#FFFFFF';
    };

    const determineTextColor = () => {
        return answerCorrectness === null || answerCorrectness === 'half-correct'
          ? '#000000' : '#FFFFFF';
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
        if (answerCorrectness === 'correct')
            return 'Next';
        else if (answerCorrectness === 'half-correct' || answerCorrectness === 'incorrect')
            return 'Retry';
        else
            return 'Check Answer';
    }

    return (
        <>
            <Stack>
                <Typography>{`${props.numberOfSubjectsCompleted + 1}/${props.totalSubjects}`}</Typography>
                <Paper
                    sx={{
                        bgcolor: determineSubjectColor(props.subject),
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
                <Grid
                  container
                  columns={{ xs: 3 }}
                >
                    <Grid item xs={1}></Grid>
                    <Grid item xs={1}>
                        <Button onClick={checkAnswer}>{determineSubmitButtonText()}</Button>
                    </Grid>
                    <Grid item xs={1}>
                        <Stack direction='row' justifyContent='flex-end'>
                            <Button href={props.subject.data.document_url} target='_blank'>Subject Page</Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>
        </>
    );
};
