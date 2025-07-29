import { Button, Stack, TextField } from '@mui/material';
import { Dispatch, useState } from 'react';
import { WANIKANI_LEVELS } from '../assets/wanikaniLevels.tsx';

type WanikaniLevelSelectorProps = {
    setQuizItems: Dispatch<number[]>;
};

export const WanikaniLevelSelector = (props: WanikaniLevelSelectorProps) => {
    const [selectedLevel, setSelectedLevel] = useState<number>(1);

    const handleSubmit = () => {
        props.setQuizItems(WANIKANI_LEVELS[selectedLevel]);
    };

    return (
        <Stack direction={'row'}>
            <TextField
                label='Wanikani Level'
                defaultValue={1}
                inputProps={{
                    type: 'number',
                }}
                onChange={(event) => setSelectedLevel(parseInt(event.target.value))}
            />
            <Button
                variant={'contained'}
                onClick={handleSubmit}
            >
                Go
            </Button>
        </Stack>
    );
};
