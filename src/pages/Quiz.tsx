import { Button, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { loadSubjects } from '../api/backendApi.ts';
import { WaniKaniSubject } from '../types.ts';

export const Quiz = (props: { quizItems: number[] }) => {
    const [subjects, setSubjects] = useState<WaniKaniSubject[] | null>(null);
    const [currentSubject, setCurrentSubject] = useState<number>(0);
    useEffect(() => {
        loadSubjects(props.quizItems).then((fetchedSubjects: WaniKaniSubject[]) => {
            setSubjects(fetchedSubjects);
        });
    }, [props.quizItems]);

    if (!subjects) {
        return <Typography>Loading...</Typography>;
    } else if (currentSubject >= subjects.length) {
        return <Typography variant='h1'>Quiz Finished!</Typography>;
    } else {
        return (
            <>
                {subjects && (
                    <Stack>
                        <Typography variant='h1'>{subjects[currentSubject].data.characters}</Typography>
                        <Button onClick={() => setCurrentSubject(currentSubject + 1)}>Next Subject</Button>
                    </Stack>
                )}
            </>
        );
    }
};
