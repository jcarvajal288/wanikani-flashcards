import {Checkbox, FormControlLabel, FormGroup, Paper, Stack, Typography} from '@mui/material';
import {ChangeEvent, Dispatch} from 'react';
import {
    JLPT_N1_KANJI_IDS,
    JLPT_N2_KANJI_IDS,
    JLPT_N3_KANJI_IDS,
    JLPT_N4_KANJI_IDS,
    JLPT_N5_KANJI_IDS,
    JOYO_KANJI_GRADE_1_IDS,
    JOYO_KANJI_GRADE_2_IDS,
    JOYO_KANJI_GRADE_3_IDS,
    JOYO_KANJI_GRADE_4_IDS,
    JOYO_KANJI_GRADE_5_IDS
} from "../assets/kanjiLists.tsx";
import {KanjiListSelector} from "./KanjiListSelector.tsx";

interface ItemTypesParams {
    toggleCriticalCondition: (e: ChangeEvent<HTMLInputElement>) => void;
    setQuizItems: Dispatch<number[]>;
}

export const MiscellaneousSelectors = (props: ItemTypesParams) => {


    return (
        <Paper>
            <Stack
                padding='16px'
                direction='column'
                spacing={2}
            >
                <Typography variant='h5'>Miscellaneous</Typography>
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox onChange={props.toggleCriticalCondition}/>}
                        label={'Critical Condition'}
                    />
                </FormGroup>
                <KanjiListSelector
                  options={['JLPT5', "JLPT4", "JLPT3", "JLPT2", "JLPT1"]}
                  kanjiLists={[JLPT_N5_KANJI_IDS, JLPT_N4_KANJI_IDS, JLPT_N3_KANJI_IDS, JLPT_N2_KANJI_IDS, JLPT_N1_KANJI_IDS]}
                  setQuizItems={props.setQuizItems}
                />
                <KanjiListSelector
                  options={['JOYO1', "JOYO2", "JOYO3", "JOYO4", "JOYO5"]}
                  kanjiLists={[JOYO_KANJI_GRADE_1_IDS, JOYO_KANJI_GRADE_2_IDS, JOYO_KANJI_GRADE_3_IDS, JOYO_KANJI_GRADE_4_IDS, JOYO_KANJI_GRADE_5_IDS]}
                  setQuizItems={props.setQuizItems}
                />
            </Stack>
        </Paper>
    )
};
