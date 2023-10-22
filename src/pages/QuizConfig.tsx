import { Button, Checkbox, FormControlLabel, FormGroup, Paper, Stack, TextField, Typography } from '@mui/material';
import { FormEvent, useState } from 'react';
import { fetchAndPostWaniKaniSubjectData, fetchQuizItems } from '../api/waniKaniApi.ts';

export type QuizConfigFormData = {
    apiKey: string;
    subjectTypes: SubjectTypes;
    srsLevels: SrsLevels;
};

export type SubjectTypes = {
    radical: boolean;
    kanji: boolean;
    vocabulary: boolean;
};

export type SrsLevels = {
    apprentice_1: boolean;
    apprentice_2: boolean;
    apprentice_3: boolean;
    apprentice_4: boolean;
    apprentice_5: boolean;
    guru_1: boolean;
    guru_2: boolean;
    master: boolean;
    enlightened: boolean;
    burned: boolean;
};

export const QuizConfig = () => {
    const [formData, setFormData] = useState<QuizConfigFormData>({
        apiKey: '',
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
            apprentice_5: false,
            guru_1: false,
            guru_2: false,
            master: false,
            enlightened: false,
            burned: false,
        },
    });

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

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchQuizItems(formData);
    };

    const handleDatabaseRefresh = async () => {
        if (formData.apiKey === '') {
            alert('You must enter your API Key before performing this action.');
        } else {
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
                            <Stack direction='row'>
                                <Paper>
                                    <Stack direction='column'>
                                        <Typography variant='h5'>Item Types</Typography>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        onChange={(e) => setSubjectType({ radical: e.target.checked })}
                                                    />
                                                }
                                                label={'Radicals'}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        onChange={(e) => setSubjectType({ kanji: e.target.checked })}
                                                    />
                                                }
                                                label={'Kanji'}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        onChange={(e) =>
                                                            setSubjectType({ vocabulary: e.target.checked })
                                                        }
                                                    />
                                                }
                                                label={'Vocabulary'}
                                            />
                                        </FormGroup>
                                    </Stack>
                                </Paper>
                                <Paper>
                                    <Stack direction='column'>
                                        <Typography variant='h5'>SRS Levels</Typography>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        onChange={(e) =>
                                                            setSrsLevel({ apprentice_1: e.target.checked })
                                                        }
                                                    />
                                                }
                                                label={'Apprentice 1'}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        onChange={(e) =>
                                                            setSrsLevel({ apprentice_2: e.target.checked })
                                                        }
                                                    />
                                                }
                                                label={'Apprentice 2'}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        onChange={(e) =>
                                                            setSrsLevel({ apprentice_3: e.target.checked })
                                                        }
                                                    />
                                                }
                                                label={'Apprentice 3'}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        onChange={(e) =>
                                                            setSrsLevel({ apprentice_4: e.target.checked })
                                                        }
                                                    />
                                                }
                                                label={'Apprentice 4'}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        onChange={(e) =>
                                                            setSrsLevel({ apprentice_5: e.target.checked })
                                                        }
                                                    />
                                                }
                                                label={'Apprentice 5'}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        onChange={(e) => setSrsLevel({ guru_1: e.target.checked })}
                                                    />
                                                }
                                                label={'Guru 1'}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        onChange={(e) => setSrsLevel({ guru_2: e.target.checked })}
                                                    />
                                                }
                                                label={'Guru 2'}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        onChange={(e) => setSrsLevel({ master: e.target.checked })}
                                                    />
                                                }
                                                label={'Master'}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        onChange={(e) => setSrsLevel({ enlightened: e.target.checked })}
                                                    />
                                                }
                                                label={'Enlightened'}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        onChange={(e) => setSrsLevel({ burned: e.target.checked })}
                                                    />
                                                }
                                                label={'Burned'}
                                            />
                                        </FormGroup>
                                    </Stack>
                                </Paper>
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
