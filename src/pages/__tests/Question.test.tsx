/** @jest-environment jsdom */
import { userEvent } from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { expect } from 'vitest';
import { Question } from '../Question.tsx';
import { WaniKaniSubject } from '../../types.ts';

describe('Question', () => {
    const mockKanjiSubject: WaniKaniSubject = {
        data: {
            characters: '角',
            readings: [
                {
                    reading: 'かく',
                },
            ],
        },
        object: 'kanji',
    };

    const mockVocabSubject: WaniKaniSubject = {
        data: {
            characters: '人工',
            readings: [
                {
                    reading: 'じんこう',
                },
            ],
        },
        object: 'vocabulary',
    };

    const renderReadingQuestion = (subject: WaniKaniSubject) => {
        render(
            <Question
                subject={subject}
                moveToNextSubject={() => {}}
                type='reading'
            />,
        );
    };

    it('displays if it is a kanji reading question', () => {
        renderReadingQuestion(mockKanjiSubject);
        expect(screen.getByTestId('type-header').textContent).toEqual('Kanji Reading');
    });

    it('displays if it is a vocabulary reading question', () => {
        renderReadingQuestion(mockVocabSubject);
        expect(screen.getByTestId('type-header').textContent).toEqual('Vocabulary Reading');
    });

    it('converts romaji typed into the textbox to hiragana', async () => {
        renderReadingQuestion(mockVocabSubject);
        await userEvent.click(await screen.findByRole('textbox'));
        await userEvent.paste('watashi');
        expect(screen.getByDisplayValue('わたし')).toBeVisible();
    });

    it('correctly handles "nn" as a single ん', async () => {
        renderReadingQuestion(mockVocabSubject);
        await userEvent.type(screen.getByRole('textbox'), 'jinnkou');
        expect(screen.getByDisplayValue('じんこう')).toBeVisible();
    });

    it('disables answer input after a submission', async () => {
        renderReadingQuestion(mockVocabSubject);
        const textbox = screen.getByRole('textbox');
        await userEvent.type(textbox, 'jinnkou{enter}wa');
        expect(screen.getByDisplayValue('じんこう')).toBeVisible();
        expect(screen.queryByDisplayValue('じんこうわ')).toBeNull();
    });
});
