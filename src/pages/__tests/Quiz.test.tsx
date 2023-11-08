/** @jest-environment jsdom */
import { beforeEach, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Quiz } from '../Quiz.tsx';
import * as BackendApi from '../../api/backendApi.ts';
import axios from 'axios';
import { userEvent } from '@testing-library/user-event';

vitest.mock('axios');
vitest.mock('../backendApi.ts');

describe('Quiz', () => {
    const loadSubjectsSpy = vi.spyOn(BackendApi, 'loadSubjects');
    const axiosGetSpy = vi.spyOn(axios, 'get');

    const mockQuizItems = [1, 2, 3];
    const mockSubjects = {
        data: [
            {
                id: 7560,
                data: {
                    characters: '人工',
                    readings: [
                        {
                            reading: 'じんこう',
                        },
                    ],
                },
            },
            {
                id: 1111,
                data: {
                    characters: '大した',
                    readings: [
                        {
                            reading: 'たいした',
                        },
                    ],
                },
            },
        ],
    };

    const submitAnswer = async (answer: string): Promise<void> => {
        const textbox = screen.getByRole('textbox');
        await userEvent.type(textbox, answer);
        await userEvent.click(screen.getByRole('button', { name: 'Check Answer' }));
        await userEvent.click(screen.getByRole('button', { name: 'Check Answer' }));
    };

    beforeEach(async () => {
        axiosGetSpy.mockResolvedValue(mockSubjects);
        await waitFor(() => {
            render(
                <Quiz
                    quizItems={mockQuizItems}
                    returnHome={() => {}}
                />,
            );
        });
        await screen.findByText('人工');
    });

    it('looks up assignment subjects in the database on page load', async () => {
        expect(loadSubjectsSpy).toHaveBeenCalledOnce();
        expect(loadSubjectsSpy).toHaveBeenCalledWith(mockQuizItems);
        expect(axiosGetSpy).toHaveBeenCalledWith(`http://localhost:3001/loadFromDatabase?subject_ids=1,2,3`);
    });

    it('converts romaji typed into the textbox to hiragana', async () => {
        await userEvent.click(await screen.findByRole('textbox'));
        await userEvent.paste('watashi');
        expect(screen.getByDisplayValue('わたし')).toBeVisible();
    });

    it('does not proceed with an incorrect answer', async () => {
        await submitAnswer('asdf');
        expect(screen.queryByText('大した')).toBeNull();
    });

    it('cycles through the quiz with correct answers', async () => {
        await submitAnswer('jinkou');
        expect(screen.queryByText('人工')).toBeNull();
        expect(await screen.findByText('大した')).toBeVisible();

        await submitAnswer('taishita');
        expect(await screen.findByText('Quiz Finished!')).toBeVisible();
    });

    it('correctly handles "nn" as a single ん', async () => {
        await submitAnswer('jinnkou');
        expect(await screen.findByText('大した')).toBeVisible();
    });

    it('submits answer when Enter key is pressed', async () => {
        const textbox = screen.getByRole('textbox');
        await userEvent.type(textbox, 'jinnkou{enter}{enter}');
        expect(await screen.findByText('大した')).toBeVisible();
    });

    it('disables answer input after a submission', async () => {
        const textbox = screen.getByRole('textbox');
        await userEvent.type(textbox, 'jinnkou{enter}wa');
        expect(screen.getByDisplayValue('じんこう')).toBeVisible();
        expect(screen.queryByDisplayValue('じんこうわ')).toBeNull();
    })
});
