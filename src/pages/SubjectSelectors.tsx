import { Checkbox, FormControlLabel, FormGroup, Paper, Stack, Typography } from '@mui/material';
import { ChangeEvent } from 'react';

export type SubjectTypes = {
    radical: boolean;
    kanji: boolean;
    vocabulary: boolean;
};

interface ItemTypesParams {
    toggleRadical: (e: ChangeEvent<HTMLInputElement>) => void;
    toggleKanji: (e: ChangeEvent<HTMLInputElement>) => void;
    toggleVocabulary: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const SubjectSelectors = (props: ItemTypesParams) => (
    <Paper>
        <Stack
            padding='16px'
            direction='column'
        >
            <Typography variant='h5'>Item Types</Typography>
            <FormGroup>
                <FormControlLabel
                    control={<Checkbox onChange={props.toggleRadical} />}
                    label={'Radicals'}
                />
                <FormControlLabel
                    control={<Checkbox onChange={props.toggleKanji} />}
                    label={'Kanji'}
                />
                <FormControlLabel
                    control={<Checkbox onChange={props.toggleVocabulary} />}
                    label={'Vocabulary'}
                />
            </FormGroup>
        </Stack>
    </Paper>
);
