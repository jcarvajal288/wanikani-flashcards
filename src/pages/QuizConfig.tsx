import { Button, Stack, TextField, Typography } from '@mui/material';
import { Dispatch, FormEvent, useState } from 'react';
import { fetchAndPostWaniKaniSubjectData, fetchQuizItems } from '../api/waniKaniApi.ts';
import { SubjectSelectors, SubjectTypes } from './SubjectSelectors.tsx';
import { SrsLevels, SrsSelectors } from './SrsSelectors.tsx';
import { deleteAllSubjects } from '../api/backendApi.ts';
import { CRITICAL_CONDITION_THRESHOLD, QuizConfigFormData } from '../types.ts';
import { MiscellaneousSelectors } from './MiscellaneousSelectors.tsx';

type QuizConfigParams = {
    setQuizItems: Dispatch<number[]>;
    setIsPronunciationTest: Dispatch<boolean>;
};

export const QuizConfig = (props: QuizConfigParams) => {
    const baseFormState: QuizConfigFormData = {
        apiKey: '',
        percentageCorrectThreshold: 100,
        subjectTypes: {
            radical: false,
            kanji: false,
            vocabulary: false,
        },
        srsLevels: {
            apprentice_1: false,
            apprentice_2: false,
            apprentice_3: false,
            apprentice_4: false,
            guru_1: false,
            guru_2: false,
            master: false,
            enlightened: false,
            burned: false,
        },
    };

    const [formData, setFormData] = useState<QuizConfigFormData>(baseFormState);

    const setFormValue = (field: Partial<QuizConfigFormData>) => {
        setFormData({
            ...formData,
            ...field,
        });
    };

    const setSubjectType = (field: Partial<SubjectTypes>) => {
        setFormData({
            ...formData,
            subjectTypes: {
                ...formData.subjectTypes,
                ...field,
            },
        });
    };

    const setSrsLevel = (field: Partial<SrsLevels>) => {
        setFormData({
            ...formData,
            srsLevels: {
                ...formData.srsLevels,
                ...field,
            },
        });
    };

    const setPercentageCorrectThreshold = (isCriticalConditionChecked: boolean) => {
        setFormData({
            ...formData,
            percentageCorrectThreshold: isCriticalConditionChecked ? CRITICAL_CONDITION_THRESHOLD : 100,
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.apiKey === '') {
            alert('You must enter your API Key before performing this action.');
        } else {
            const quizItems = await fetchQuizItems(formData);
            props.setQuizItems(quizItems);
        }
    };

    const handleDatabaseRefresh = async () => {
        if (formData.apiKey === '') {
            alert('You must enter your API Key before performing this action.');
        } else {
            await deleteAllSubjects();
            await fetchAndPostWaniKaniSubjectData(formData.apiKey);
        }
    };

    return (
        <>
            <Stack
                height='95vh'
                justifyContent='space-between'
            >
                <Stack>
                    <Typography variant='h2'>Configure Quiz</Typography>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <Stack>
                            <TextField
                                id='api-key-input'
                                label='API Key'
                                variant='outlined'
                                onChange={(e) => setFormValue({ apiKey: e.target.value })}
                            />
                            <Stack
                                direction='row'
                                justifyContent='space-evenly'
                                margin='16px'
                                gap='16px'
                            >
                                <SubjectSelectors
                                    toggleRadical={(e) => setSubjectType({ radical: e.target.checked })}
                                    toggleKanji={(e) => setSubjectType({ kanji: e.target.checked })}
                                    toggleVocabulary={(e) => setSubjectType({ vocabulary: e.target.checked })}
                                />
                                <SrsSelectors
                                    toggleApp1={(e) => setSrsLevel({ apprentice_1: e.target.checked })}
                                    toggleApp2={(e) => setSrsLevel({ apprentice_2: e.target.checked })}
                                    toggleApp3={(e) => setSrsLevel({ apprentice_3: e.target.checked })}
                                    toggleApp4={(e) => setSrsLevel({ apprentice_4: e.target.checked })}
                                    toggleGuru1={(e) => setSrsLevel({ guru_1: e.target.checked })}
                                    toggleGuru2={(e) => setSrsLevel({ guru_2: e.target.checked })}
                                    toggleMaster={(e) => setSrsLevel({ master: e.target.checked })}
                                    toggleEnlightened={(e) => setSrsLevel({ enlightened: e.target.checked })}
                                    toggleBurned={(e) => setSrsLevel({ burned: e.target.checked })}
                                />
                                <MiscellaneousSelectors
                                    toggleCriticalCondition={(e) => setPercentageCorrectThreshold(e.target.checked)}
                                    setQuizItems={props.setQuizItems}
                                    setIsPronunciationTest={props.setIsPronunciationTest}
                                />
                            </Stack>
                            <Button
                                variant='contained'
                                type='submit'
                            >
                                Generate Quiz
                            </Button>
                        </Stack>
                    </form>
                </Stack>
                <Button onClick={handleDatabaseRefresh}>Update WaniKani data</Button>
            </Stack>
        </>
    );
};

export default QuizConfig;
