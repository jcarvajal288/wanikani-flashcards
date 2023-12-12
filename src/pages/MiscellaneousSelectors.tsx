import { Checkbox, FormControlLabel, FormGroup, Paper, Stack, Typography } from '@mui/material';
import { ChangeEvent } from 'react';

export type MiscellaneousTypes = {
    criticalCondition: boolean;
};

interface ItemTypesParams {
    toggleCriticalCondition: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const MiscellaneousSelectors = (props: ItemTypesParams) => (
    <Paper>
        <Stack
            padding='16px'
            direction='column'
        >
            <Typography variant='h5'>Miscellaneous</Typography>
            <FormGroup>
                <FormControlLabel
                    control={<Checkbox onChange={props.toggleCriticalCondition} />}
                    label={'Critical Condition'}
                />
            </FormGroup>
        </Stack>
    </Paper>
);
