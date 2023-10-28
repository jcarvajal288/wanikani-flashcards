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
    }, [subjects?.length]);

    if (!subjects) {
        return <Typography>Loading...</Typography>;
    } else {
        return (
            <>
                {subjects && (
                    <Stack>
                        <Typography variant='h1'>{subjects[0].data.characters}</Typography>
                    </Stack>
                )}
            </>
        );
    }
};
