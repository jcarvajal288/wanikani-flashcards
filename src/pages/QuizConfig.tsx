import { Button, Checkbox, FormControlLabel, FormGroup, Paper, Stack, TextField, Typography } from '@mui/material';

export const QuizConfig = () => (
    <>
        <Typography variant='h2'>Configure Quiz</Typography>
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
                            control={<Checkbox />}
                            label={'Radicals'}
                        />
                        <FormControlLabel
                            control={<Checkbox />}
                            label={'Kanji'}
                        />
                        <FormControlLabel
                            control={<Checkbox />}
                            label={'Vocabulary'}
                        />
                    </FormGroup>
                </Stack>
            </Paper>
            <Button variant='contained'>Generate Quiz</Button>
        </Stack>
    </>
);
