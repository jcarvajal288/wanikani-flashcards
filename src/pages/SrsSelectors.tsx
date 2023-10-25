import { Checkbox, FormControlLabel, FormGroup, Paper, Stack, Typography } from '@mui/material';
import { ChangeEvent } from 'react';

export type SrsLevels = {
    apprentice_1: boolean;
    apprentice_2: boolean;
    apprentice_3: boolean;
    apprentice_4: boolean;
    guru_1: boolean;
    guru_2: boolean;
    master: boolean;
    enlightened: boolean;
    burned: boolean;
};

interface SrsSelectorsParams {
    toggleApp1: (e: ChangeEvent<HTMLInputElement>) => void;
    toggleApp2: (e: ChangeEvent<HTMLInputElement>) => void;
    toggleApp3: (e: ChangeEvent<HTMLInputElement>) => void;
    toggleApp4: (e: ChangeEvent<HTMLInputElement>) => void;
    toggleGuru1: (e: ChangeEvent<HTMLInputElement>) => void;
    toggleGuru2: (e: ChangeEvent<HTMLInputElement>) => void;
    toggleMaster: (e: ChangeEvent<HTMLInputElement>) => void;
    toggleEnlightened: (e: ChangeEvent<HTMLInputElement>) => void;
    toggleBurned: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const SrsSelectors = (props: SrsSelectorsParams) => (
    <Paper>
        <Stack direction='column'>
            <Typography variant='h5'>SRS Levels</Typography>
            <FormGroup>
                <Stack direction='row'>
                    <Stack>
                        <FormControlLabel
                            control={<Checkbox onChange={props.toggleApp1} />}
                            label={'Apprentice 1'}
                        />
                        <FormControlLabel
                            control={<Checkbox onChange={props.toggleApp2} />}
                            label={'Apprentice 2'}
                        />
                        <FormControlLabel
                            control={<Checkbox onChange={props.toggleApp3} />}
                            label={'Apprentice 3'}
                        />
                        <FormControlLabel
                            control={<Checkbox onChange={props.toggleApp4} />}
                            label={'Apprentice 4'}
                        />
                    </Stack>
                    <Stack>
                        <FormControlLabel
                            control={<Checkbox onChange={props.toggleGuru1} />}
                            label={'Guru 1'}
                        />
                        <FormControlLabel
                            control={<Checkbox onChange={props.toggleGuru2} />}
                            label={'Guru 2'}
                        />
                        <FormControlLabel
                            control={<Checkbox onChange={props.toggleMaster} />}
                            label={'Master'}
                        />
                        <FormControlLabel
                            control={<Checkbox onChange={props.toggleEnlightened} />}
                            label={'Enlightened'}
                        />
                        <FormControlLabel
                            control={<Checkbox onChange={props.toggleBurned} />}
                            label={'Burned'}
                        />
                    </Stack>
                </Stack>
            </FormGroup>
        </Stack>
    </Paper>
);
