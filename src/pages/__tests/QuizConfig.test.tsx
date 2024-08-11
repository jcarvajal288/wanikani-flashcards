/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import { QuizConfig } from '../QuizConfig.tsx';
import { beforeEach, vitest } from 'vitest';
import * as WaniKaniApi from '../../api/waniKaniApi.ts';
import * as BackendApi from '../../api/backendApi.ts';
import { userEvent } from '@testing-library/user-event';
import { CRITICAL_CONDITION_THRESHOLD } from '../../types.ts';
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
    JOYO_KANJI_GRADE_5_IDS,
} from '../../assets/kanjiLists.tsx';

vi.mock('../../api/waniKaniApi.ts');

describe('QuizConfig', () => {
    const deleteAllSubjectsSpy = vi.spyOn(BackendApi, 'deleteAllSubjects');
    const fetchQuizItemsSpy = vi.spyOn(WaniKaniApi, 'fetchQuizItems');
    const fetchWanikaniSubjectDataSpy = vi.spyOn(WaniKaniApi, 'fetchAndPostWaniKaniSubjectData');
    const setQuizItemsSpy = vi.fn();
    const setIsPronunciationTestSpy = vi.fn();

    beforeEach(() => {
        render(
            <QuizConfig
                setQuizItems={setQuizItemsSpy}
                setIsPronunciationTest={setIsPronunciationTestSpy}
            />,
        );
    });

    it('has a title', () => {
        expect(screen.getByText('Configure Quiz')).toBeVisible();
    });

    it('shows item type selectors', () => {
        expect(screen.getByText('Item Types'));
        expect(screen.getByRole('checkbox', { name: 'Radicals' }));
        expect(screen.getByRole('checkbox', { name: 'Kanji' }));
        expect(screen.getByRole('checkbox', { name: 'Vocabulary' }));
    });

    it('shows srs selectors', () => {
        expect(screen.getByText('SRS Levels'));
        expect(screen.getByRole('checkbox', { name: 'Apprentice 1' }));
        expect(screen.getByRole('checkbox', { name: 'Apprentice 2' }));
        expect(screen.getByRole('checkbox', { name: 'Apprentice 3' }));
        expect(screen.getByRole('checkbox', { name: 'Apprentice 4' }));
        expect(screen.getByRole('checkbox', { name: 'Guru 1' }));
        expect(screen.getByRole('checkbox', { name: 'Guru 2' }));
        expect(screen.getByRole('checkbox', { name: 'Master' }));
        expect(screen.getByRole('checkbox', { name: 'Enlightened' }));
        expect(screen.getByRole('checkbox', { name: 'Burned' }));
    });

    it('shows critical items selector', () => {
        expect(screen.getByText('Miscellaneous'));
        expect(screen.getByRole('checkbox', { name: 'Critical Condition' }));
    });

    it('shows pronunciation quiz selector', async () => {
        await userEvent.click(screen.getByRole('checkbox', { name: 'Test Pronunciation' }));
        expect(setIsPronunciationTestSpy).toHaveBeenCalledWith(true);
        await userEvent.click(screen.getByRole('checkbox', { name: 'Test Pronunciation' }));
        expect(setIsPronunciationTestSpy).toHaveBeenCalledWith(false);
    });

    it('alerts the user when they press the Generate Quiz button without inputting their API Key', async () => {
        vitest.spyOn(window, 'alert').mockImplementation(() => {});
        await userEvent.click(screen.getByRole('button', { name: /Generate Quiz/i }));
        expect(fetchQuizItemsSpy).not.toHaveBeenCalled();
        expect(window.alert).toBeCalledWith('You must enter your API Key before performing this action.');
    });

    it('alerts the user when they press the Update Wanikani Data button without inputting their API Key', async () => {
        vitest.spyOn(window, 'alert').mockImplementation(() => {});
        await userEvent.click(screen.getByRole('button', { name: /Update Wanikani Data/i }));
        expect(fetchWanikaniSubjectDataSpy).not.toHaveBeenCalled();
        expect(window.alert).toBeCalledWith('You must enter your API Key before performing this action.');
    });

    it('triggers database refresh when clicking Update Wanikani Data button', async () => {
        deleteAllSubjectsSpy.mockImplementation(() => Promise.resolve());
        await userEvent.click(screen.getByRole('textbox', { name: 'API Key' }));
        await userEvent.paste('apiKey');
        await userEvent.click(screen.getByRole('button', { name: /Update Wanikani Data/i }));
        expect(deleteAllSubjectsSpy).toHaveBeenCalled();
        expect(fetchWanikaniSubjectDataSpy).toHaveBeenCalledWith('apiKey');
    });

    it('calls WaniKani with all form arguments checked', async () => {
        await userEvent.click(screen.getByRole('textbox', { name: 'API Key' }));
        await userEvent.paste('apiKey');
        await userEvent.click(screen.getByRole('checkbox', { name: 'Radicals' }));
        await userEvent.click(screen.getByRole('checkbox', { name: 'Kanji' }));
        await userEvent.click(screen.getByRole('checkbox', { name: 'Vocabulary' }));
        await userEvent.click(screen.getByRole('checkbox', { name: 'Apprentice 1' }));
        await userEvent.click(screen.getByRole('checkbox', { name: 'Apprentice 2' }));
        await userEvent.click(screen.getByRole('checkbox', { name: 'Apprentice 3' }));
        await userEvent.click(screen.getByRole('checkbox', { name: 'Apprentice 4' }));
        await userEvent.click(screen.getByRole('checkbox', { name: 'Guru 1' }));
        await userEvent.click(screen.getByRole('checkbox', { name: 'Guru 2' }));
        await userEvent.click(screen.getByRole('checkbox', { name: 'Master' }));
        await userEvent.click(screen.getByRole('checkbox', { name: 'Enlightened' }));
        await userEvent.click(screen.getByRole('checkbox', { name: 'Burned' }));
        await userEvent.click(screen.getByRole('checkbox', { name: 'Critical Condition' }));
        await userEvent.click(screen.getByRole('checkbox', { name: 'Test Pronunciation' }));
        await userEvent.click(screen.getByRole('button', { name: 'Generate Quiz' }));
        expect(fetchQuizItemsSpy).toBeCalledWith({
            apiKey: 'apiKey',
            percentageCorrectThreshold: CRITICAL_CONDITION_THRESHOLD,
            subjectTypes: {
                radical: true,
                kanji: true,
                vocabulary: true,
            },
            srsLevels: {
                apprentice_1: true,
                apprentice_2: true,
                apprentice_3: true,
                apprentice_4: true,
                guru_1: true,
                guru_2: true,
                master: true,
                enlightened: true,
                burned: true,
            },
        });
    });

    it('calls WaniKani with correct form arguments', async () => {
        await userEvent.click(screen.getByRole('textbox', { name: 'API Key' }));
        await userEvent.paste('apiKey');
        await userEvent.click(screen.getByRole('checkbox', { name: 'Radicals' }));
        await userEvent.click(screen.getByRole('checkbox', { name: 'Vocabulary' }));
        await userEvent.click(screen.getByRole('checkbox', { name: 'Apprentice 1' }));
        await userEvent.click(screen.getByRole('checkbox', { name: 'Guru 2' }));
        await userEvent.click(screen.getByRole('button', { name: 'Generate Quiz' }));
        expect(fetchQuizItemsSpy).toBeCalledWith({
            apiKey: 'apiKey',
            percentageCorrectThreshold: 100,
            subjectTypes: {
                radical: true,
                kanji: false,
                vocabulary: true,
            },
            srsLevels: {
                apprentice_1: true,
                apprentice_2: false,
                apprentice_3: false,
                apprentice_4: false,
                guru_1: false,
                guru_2: true,
                master: false,
                enlightened: false,
                burned: false,
            },
        });
    });

    describe('JLPT Selector', () => {
        it('creates a JLPT5 quiz when the JLPT5 button is clicked', async () => {
            await userEvent.click(screen.getByRole('button', { name: 'JLPT5' }));
            expect(setQuizItemsSpy).toBeCalledWith(JLPT_N5_KANJI_IDS);
        });

        it('creates a JLPT4 quiz when the JLPT4 button is clicked', async () => {
            await userEvent.click(screen.getByTestId('jlpt-selector'));
            await userEvent.click(screen.getByRole('menuitem', { name: 'JLPT4' }));
            await userEvent.click(screen.getByRole('button', { name: 'JLPT4' }));
            expect(setQuizItemsSpy).toBeCalledWith(JLPT_N4_KANJI_IDS);
        });

        it('creates a JLPT3 quiz when the JLPT3 button is clicked', async () => {
            await userEvent.click(screen.getByTestId('jlpt-selector'));
            await userEvent.click(screen.getByRole('menuitem', { name: 'JLPT3' }));
            await userEvent.click(screen.getByRole('button', { name: 'JLPT3' }));
            expect(setQuizItemsSpy).toBeCalledWith(JLPT_N3_KANJI_IDS);
        });

        it('creates a JLPT2 quiz when the JLPT2 button is clicked', async () => {
            await userEvent.click(screen.getByTestId('jlpt-selector'));
            await userEvent.click(screen.getByRole('menuitem', { name: 'JLPT2' }));
            await userEvent.click(screen.getByRole('button', { name: 'JLPT2' }));
            expect(setQuizItemsSpy).toBeCalledWith(JLPT_N2_KANJI_IDS);
        });

        it('creates a JLPT1 quiz when the JLPT1 button is clicked', async () => {
            await userEvent.click(screen.getByTestId('jlpt-selector'));
            await userEvent.click(screen.getByRole('menuitem', { name: 'JLPT1' }));
            await userEvent.click(screen.getByRole('button', { name: 'JLPT1' }));
            expect(setQuizItemsSpy).toBeCalledWith(JLPT_N1_KANJI_IDS);
        });
    });

    describe('JOYO Selector', () => {
        it('creates a JOYO1 quiz when the JOYO1 button is clicked', async () => {
            await userEvent.click(screen.getByRole('button', { name: 'JOYO1' }));
            expect(setQuizItemsSpy).toBeCalledWith(JOYO_KANJI_GRADE_1_IDS);
        });

        it('creates a JOYO2 quiz when the JOYO2 button is clicked', async () => {
            await userEvent.click(screen.getByTestId('joyo-selector'));
            await userEvent.click(screen.getByRole('menuitem', { name: 'JOYO2' }));
            await userEvent.click(screen.getByRole('button', { name: 'JOYO2' }));
            expect(setQuizItemsSpy).toBeCalledWith(JOYO_KANJI_GRADE_2_IDS);
        });

        it('creates a JOYO3 quiz when the JOYO3 button is clicked', async () => {
            await userEvent.click(screen.getByTestId('joyo-selector'));
            await userEvent.click(screen.getByRole('menuitem', { name: 'JOYO3' }));
            await userEvent.click(screen.getByRole('button', { name: 'JOYO3' }));
            expect(setQuizItemsSpy).toBeCalledWith(JOYO_KANJI_GRADE_3_IDS);
        });

        it('creates a JOYO4 quiz when the JOYO4 button is clicked', async () => {
            await userEvent.click(screen.getByTestId('joyo-selector'));
            await userEvent.click(screen.getByRole('menuitem', { name: 'JOYO4' }));
            await userEvent.click(screen.getByRole('button', { name: 'JOYO4' }));
            expect(setQuizItemsSpy).toBeCalledWith(JOYO_KANJI_GRADE_4_IDS);
        });

        it('creates a JOYO5 quiz when the JOYO5 button is clicked', async () => {
            await userEvent.click(screen.getByTestId('joyo-selector'));
            await userEvent.click(screen.getByRole('menuitem', { name: 'JOYO5' }));
            await userEvent.click(screen.getByRole('button', { name: 'JOYO5' }));
            expect(setQuizItemsSpy).toBeCalledWith(JOYO_KANJI_GRADE_5_IDS);
        });
    });
});
