import './App.css';
import { QuizConfig } from './pages/QuizConfig.tsx';
import { useState } from 'react';
import { JSONValue } from './types.ts';
import { Stack, Typography } from '@mui/material';

const App = () => {
    const [quizItems, setQuizItems] = useState<JSONValue | null>(null);
    return (
        <>
            {quizItems === null ? (
                <QuizConfig setQuizItems={setQuizItems} />
            ) : (
                <Stack>
                    <Typography>Quiz contains:</Typography>
                    <Typography>{JSON.stringify(quizItems)}</Typography>
                </Stack>
            )}
        </>
    );
};

export default App;
