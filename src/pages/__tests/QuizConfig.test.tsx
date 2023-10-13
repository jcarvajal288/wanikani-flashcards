/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import { QuizConfig } from '../QuizConfig.tsx';
import { beforeEach } from 'vitest';

describe('QuizConfig', () => {
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
        expect(screen.getByText('Radicals'));
        expect(screen.getByText('Kanji'));
        expect(screen.getByText('Vocabulary'));
    });

    it('shows Generate Quiz button', () => {
        expect(screen.getByRole('button', { name: 'Generate Quiz' }));
    });
});
