import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { loadSubjects } from '../api/backendApi.ts';
import { JSONValue } from '../types.ts';

export const Quiz = (props: { quizItems: number[] }) => {
    const [subjects, setSubjects] = useState<JSONValue[] | null>(null);
    useEffect(() => {
        loadSubjects(props.quizItems).then((fetchedSubjects: JSONValue[]) => {
            setSubjects(fetchedSubjects);
        });
    }, []);

    return (
        <>
        {
            subjects != null && (
            <Stack>
                <Typography>QUIZ</Typography>
                <Typography variant='h1'>{subjects[0].data.slug}</Typography>
            </Stack>
        )
        }
        </>
    );
};
