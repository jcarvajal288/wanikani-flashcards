import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { loadSubjects } from '../api/backendApi.ts';
import { JSONValue } from '../types.ts';

export const Quiz = (props: { quizItems: number[] }) => {
    const [subjects, setSubjects] = useState<JSONValue[]>([]);
    useEffect(() => {
        loadSubjects(props.quizItems).then((fetchedSubjects: JSONValue[]) => {
            setSubjects(fetchedSubjects);
        });
    }, [props.quizItems]);

    return (
        <Stack>
            <Typography>Quiz contains:</Typography>
            <Typography>{JSON.stringify(props.quizItems)}</Typography>
        </Stack>
    );
};
