import { Button, Checkbox, FormControlLabel, FormGroup, Paper, Stack, TextField, Typography } from '@mui/material';
import { FormEvent, useState } from 'react';
import { fetchQuizItems } from '../api/waniKaniApi.ts';

export type QuizConfigFormData = {
    radicals: boolean;
    kanji: boolean;
    vocabulary: boolean;
};

export const QuizConfig = () => {
    const [formData, setFormData] = useState<QuizConfigFormData>({
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

    return (
        <>
            <Typography variant='h2'>Configure Quiz</Typography>
            <form onSubmit={(e) => handleSubmit(e)}>
                <Stack>
                    <TextField
                        id='api-key-input'
                        label='API Key'
                        variant='outlined'
                    />
                    <Paper>
                        <Stack direction='column'>
                            <Typography variant='h5'>Item Types</Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox onChange={(e) => setFormValue({ radicals: e.target.checked })} />
                                    }
                                    label={'Radicals'}
                                />
                                <FormControlLabel
                                    control={<Checkbox onChange={(e) => setFormValue({ kanji: e.target.checked })} />}
                                    label={'Kanji'}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox onChange={(e) => setFormValue({ vocabulary: e.target.checked })} />
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
            <Typography>{JSON.stringify(formData)}</Typography>
        </>
    );
};

export default QuizConfig;
