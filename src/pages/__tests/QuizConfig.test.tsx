/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import { QuizConfig } from '../QuizConfig.tsx';
import { beforeEach, vitest } from 'vitest';
import * as WaniKaniApi from '../../api/waniKaniApi.ts';
import * as BackendApi from '../../api/backendApi.ts';
import { userEvent } from '@testing-library/user-event';
import { when } from 'jest-when';

vi.mock('../../api/waniKaniApi.ts');
vi.mock('../../api/backendApi.ts');

describe('QuizConfig', () => {
    const fetchQuizItemsSpy = vi.spyOn(WaniKaniApi, 'fetchQuizItems');
    const fetchWanikaniSubjectDataSpy = vi.spyOn(WaniKaniApi, 'fetchWaniKaniSubjectData');
    const postSubjectsSpy = vi.spyOn(BackendApi, 'postSubjects');

    beforeEach(() => {
        render(<QuizConfig />);
    });

    it('has a title', () => {
        expect(screen.getByText('Configure Quiz')).toBeVisible();
    });

    it('has an API key input', () => {
        expect(screen.getByRole('textbox', { name: 'API Key' }));
    });

    it('shows type selectors', () => {
        expect(screen.getByText('Item Types'));
        expect(screen.getByRole('checkbox', { name: 'Radicals' }));
        expect(screen.getByRole('checkbox', { name: 'Kanji' }));
        expect(screen.getByRole('checkbox', { name: 'Vocabulary' }));
    });

    it('shows Generate Quiz button', () => {
        expect(screen.getByRole('button', { name: 'Generate Quiz' }));
    });

    it('alerts the user when they press the Update Wanikani Data button without inputting their API Key', async () => {
        vitest.spyOn(window, 'alert').mockImplementation(() => {});
        await userEvent.click(screen.getByRole('button', { name: /Update Wanikani Data/i }));
        expect(fetchWanikaniSubjectDataSpy).not.toHaveBeenCalled();
        expect(window.alert).toBeCalledWith('You must enter your API Key before performing this action.');
    });

    it('triggers database refresh when clicking Update Wanikani Data button', async () => {
        await userEvent.click(screen.getByRole('textbox', { name: 'API Key' }));
        await userEvent.paste('apiKey');
        await userEvent.click(screen.getByRole('button', { name: /Update Wanikani Data/i }));
        expect(fetchWanikaniSubjectDataSpy).toHaveBeenCalledWith('apiKey');
        expect(postSubjectsSpy).toHaveBeenCalled();
    });

    it('calls WaniKani with correct form arguments', async () => {
        when(WaniKaniApi.fetchQuizItems).mockImplementation(() => Promise.resolve());
        await userEvent.click(screen.getByRole('textbox', { name: 'API Key' }));
        await userEvent.paste('apiKey');
        await userEvent.click(screen.getByRole('checkbox', { name: 'Radicals' }));
        await userEvent.click(screen.getByRole('checkbox', { name: 'Vocabulary' }));
        await userEvent.click(screen.getByRole('button', { name: 'Generate Quiz' }));
        expect(fetchQuizItemsSpy).toBeCalledWith({
            apiKey: 'apiKey',
            radicals: true,
            kanji: false,
            vocabulary: true,
        });
    });
});
