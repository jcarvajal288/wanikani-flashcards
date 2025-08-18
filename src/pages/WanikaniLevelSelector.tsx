import { Stack, TextField } from '@mui/material';

type WanikaniLevelSelectorProps = {
    setLevel: (level: number) => void;
};

export const WanikaniLevelSelector = (props: WanikaniLevelSelectorProps) => {
    return (
        <Stack direction={'row'}>
            <TextField
                label='Wanikani Level'
                defaultValue={0}
                inputProps={{
                    type: 'number',
                }}
                onChange={(event) => props.setLevel(parseInt(event.target.value))}
            />
        </Stack>
    );
};
