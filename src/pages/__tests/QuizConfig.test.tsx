/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import { QuizConfig } from '../QuizConfig.tsx';
import { beforeEach } from 'vitest';
import * as WaniKaniApi from '../../api/waniKaniApi.ts';
import { userEvent } from '@testing-library/user-event';
import { when } from 'jest-when';

vi.mock('../../api/waniKaniApi.ts');

describe('QuizConfig', () => {
    const fetchQuizItemsSpy = vi.spyOn(WaniKaniApi, 'fetchQuizItems');

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

    it('calls WaniKani with correct form arguments', async () => {
        when(WaniKaniApi.fetchQuizItems).mockImplementation(() => Promise.resolve());
        await userEvent.click(screen.getByRole('checkbox', { name: 'Radicals' }));
        await userEvent.click(screen.getByRole('checkbox', { name: 'Vocabulary' }));
        await userEvent.click(screen.getByRole('button', { name: 'Generate Quiz' }));
        expect(fetchQuizItemsSpy).toBeCalledWith({
            radicals: true,
            kanji: false,
            vocabulary: true,
        });
    });
});
