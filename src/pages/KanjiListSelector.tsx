import {Button, ButtonGroup, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, Stack} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {Dispatch, useRef, useState} from "react";

type KanjiListSelectorProps = {
  options: string[];
  kanjiLists: number[][];
  setQuizItems: Dispatch<number[]>;
}

export const KanjiListSelector = (props: KanjiListSelectorProps) => {

  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleDropdownClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setDropdownOpen(false);
  };

  const handleMenuItemClick = (_event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
    setSelectedOption(index);
    setDropdownOpen(false);
  };

  const handleSubmit = () => {
    props.setQuizItems(props.kanjiLists[selectedOption]);
  };

  return (
    <Stack>
      <ButtonGroup
        variant='contained'
        ref={anchorRef}
      >
        <Button fullWidth onClick={handleSubmit}>{props.options[selectedOption]}</Button>
        <Button
          size='small'
          data-testid={`${props.options[0].slice(0, 4).toLowerCase()}-selector`}
          aria-controls={dropdownOpen ? 'split-button-menu' : undefined}
          aria-expanded={dropdownOpen ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={() => {
            setDropdownOpen((prevOpen) => !prevOpen)
          }}
        >
          <ArrowDropDownIcon/>
        </Button>
      </ButtonGroup>
      <Popper
        sx={{zIndex: 1}}
        open={dropdownOpen}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({TransitionProps, placement}) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleDropdownClose}>
                <MenuList autoFocusItem>
                  {props.options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedOption}
                      onClick={(event) => handleMenuItemClick(event, index)}
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
  )
}