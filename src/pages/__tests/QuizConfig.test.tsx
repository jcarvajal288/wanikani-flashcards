/** @jest-environment jsdom */
import {render, screen} from '@testing-library/react';
import { QuizConfig } from '../QuizConfig.tsx';
import { beforeEach, vitest } from 'vitest';
import * as WaniKaniApi from '../../api/waniKaniApi.ts';
import * as BackendApi from '../../api/backendApi.ts';
import { userEvent } from '@testing-library/user-event';
import {CRITICAL_CONDITION_THRESHOLD} from "../../types.ts";

vi.mock('../../api/waniKaniApi.ts');

describe('QuizConfig', () => {
    const deleteAllSubjectsSpy = vi.spyOn(BackendApi, 'deleteAllSubjects');
    const fetchQuizItemsSpy = vi.spyOn(WaniKaniApi, 'fetchQuizItems');
    const fetchWanikaniSubjectDataSpy = vi.spyOn(WaniKaniApi, 'fetchAndPostWaniKaniSubjectData');

    beforeEach(() => {
        render(<QuizConfig setQuizItems={() => {}} />);
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
        expect(screen.getByText('Miscellaneous'))
        expect(screen.getByRole('checkbox', { name: 'Critical Condition' }));
    })

    it('shows JLPT options', () => {
        expect(screen.getByRole('button', { name: 'JLPT5' }));
    })

    it('allows selecting different JLPT quizzes', async () => {
        await userEvent.click(screen.getByTestId('jlpt-selector'));
        expect(await screen.findByRole('button', { name: 'JLPT4'}));
        expect(await screen.findByRole('button', { name: 'JLPT3'}));
        expect(await screen.findByRole('button', { name: 'JLPT2'}));
        expect(await screen.findByRole('button', { name: 'JLPT1'}));
    })

    it('shows Generate Quiz button', () => {
        expect(screen.getByRole('button', { name: 'Generate Quiz' }));
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
});
