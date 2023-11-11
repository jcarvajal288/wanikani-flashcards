/** @jest-environment jsdom */
import { userEvent } from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, expect } from 'vitest';
import { Question } from '../Question.tsx';
import { WaniKaniSubject } from '../../types.ts';

describe('Question', () => {
    const mockSubject: WaniKaniSubject = {
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

    beforeEach(async () => {
        await waitFor(() => {
            render(
                <Question
                    subject={mockSubject}
                    moveToNextSubject={() => {}}
                />,
            );
        });
        await screen.findByText('人工');
    });

    it('converts romaji typed into the textbox to hiragana', async () => {
        await userEvent.click(await screen.findByRole('textbox'));
        await userEvent.paste('watashi');
        expect(screen.getByDisplayValue('わたし')).toBeVisible();
    });

    it('correctly handles "nn" as a single ん', async () => {
        await userEvent.type(screen.getByRole('textbox'), 'jinnkou');
        expect(screen.getByDisplayValue('じんこう')).toBeVisible();
    });

    it('disables answer input after a submission', async () => {
        const textbox = screen.getByRole('textbox');
        await userEvent.type(textbox, 'jinnkou{enter}wa');
        expect(screen.getByDisplayValue('じんこう')).toBeVisible();
        expect(screen.queryByDisplayValue('じんこうわ')).toBeNull();
    });
});
