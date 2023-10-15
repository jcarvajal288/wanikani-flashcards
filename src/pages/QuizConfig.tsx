import { Button, Checkbox, FormControlLabel, FormGroup, Paper, Stack, TextField, Typography } from '@mui/material';
import { FormEvent, useState } from 'react';
import { fetchQuizItems, fetchWaniKaniSubjectData } from '../api/waniKaniApi.ts';

export type QuizConfigFormData = {
    apiKey: string;
    radicals: boolean;
    kanji: boolean;
    vocabulary: boolean;
};

export const QuizConfig = () => {
    const [formData, setFormData] = useState<QuizConfigFormData>({
        apiKey: '',
        radicals: false,
        kanji: false,
        vocabulary: false,
    });

    const setFormValue = (field: Partial<QuizConfigFormData>) => {
        setFormData({
            ...formData,
            ...field,
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchQuizItems(formData);
    };

    const handleDatabaseRefresh = () => {
        if (formData.apiKey === '') {
            alert('You must enter your API Key before performing this action.');
        } else {
            fetchWaniKaniSubjectData(formData.apiKey);
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
                            <Paper>
                                <Stack direction='column'>
                                    <Typography variant='h5'>Item Types</Typography>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    onChange={(e) => setFormValue({ radicals: e.target.checked })}
                                                />
                                            }
                                            label={'Radicals'}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox onChange={(e) => setFormValue({ kanji: e.target.checked })} />
                                            }
                                            label={'Kanji'}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    onChange={(e) => setFormValue({ vocabulary: e.target.checked })}
                                                />
                                            }
                                            label={'Vocabulary'}
                                        />
                                    </FormGroup>
                                </Stack>
                            </Paper>
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
