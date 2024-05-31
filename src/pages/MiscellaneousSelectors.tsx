import {
    Button,
    ButtonGroup,
    Checkbox, ClickAwayListener,
    FormControlLabel,
    FormGroup, Grow, MenuItem, MenuList,
    Paper,
    Popper,
    Stack,
    Typography
} from '@mui/material';
import React, {ChangeEvent, Dispatch, useRef, useState} from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {loadSubjects} from "../api/backendApi.ts";
import {JLPT_N5_KANJI_IDS} from "../assets/kanjiLists.tsx";

export type MiscellaneousTypes = {
    criticalCondition: boolean;
};

interface ItemTypesParams {
    toggleCriticalCondition: (e: ChangeEvent<HTMLInputElement>) => void;
    setQuizItems: Dispatch<number[]>;
}

export const MiscellaneousSelectors = (props: ItemTypesParams) => {

    const jlptOptions = ['JLPT5', "JLPT4", "JLPT3", "JLPT2", "JLPT1"];
    const [selectedJLPT, setSelectedJLPT] = useState<number>(0);
    const [jlptOpen, setJlptOpen] = useState<boolean>(false);
    const anchorRef = useRef<HTMLDivElement>(null);

    const handleJLPTClose = (event: Event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }
        setJlptOpen(false);
    };

    const handleJLPTMenuItemClick = (_event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
        setSelectedJLPT(index);
        setJlptOpen(false);
    };

    const handleJLPTClick = async () => {
        props.setQuizItems(JLPT_N5_KANJI_IDS);
    };

    return (
        <Paper>
            <Stack
                padding='16px'
                direction='column'
            >
                <Typography variant='h5'>Miscellaneous</Typography>
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox onChange={props.toggleCriticalCondition}/>}
                        label={'Critical Condition'}
                    />
                </FormGroup>
                <ButtonGroup
                    variant='contained'
                    ref={anchorRef}
                >
                    <Button fullWidth onClick={handleJLPTClick}>{jlptOptions[selectedJLPT]}</Button>
                    <Button
                        size='small'
                        data-testid='jlpt-selector'
                        aria-controls={jlptOpen ? 'split-button-menu' : undefined}
                        aria-expanded={jlptOpen ? 'true' : undefined}
                        aria-label="select merge strategy"
                        aria-haspopup="menu"
                        onClick={() => {
                            setJlptOpen((prevOpen) => !prevOpen)
                        }}
                    >
                        <ArrowDropDownIcon/>
                    </Button>
                </ButtonGroup>
                <Popper
                    sx={{zIndex: 1}}
                    open={jlptOpen}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === 'bottom' ? 'center top' : 'center bottom',
                      }}
                    >
                    <Paper>
                        <ClickAwayListener onClickAway={handleJLPTClose}>
                            <MenuList autoFocusItem>
                                {jlptOptions.map((option, index) => (
                                    <MenuItem
                                        key={option}
                                        selected={index === selectedJLPT}
                                        onClick={(event) => handleJLPTMenuItemClick(event, index)}
                                    >
                                        {option}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                    </Grow>
                    )}
                </Popper>
            </Stack>
        </Paper>
    )
};
