/** @jest-environment jsdom */
import { beforeEach, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Quiz } from '../Quiz.tsx';
import * as BackendApi from '../../api/backendApi.ts';
import axios from 'axios';
import { userEvent } from '@testing-library/user-event';
import {WaniKaniSubject} from "../../types.ts";

vitest.mock('axios');
vitest.mock('../backendApi.ts');

describe('Quiz', () => {
    const loadSubjectsSpy = vi.spyOn(BackendApi, 'loadSubjects');
    const axiosGetSpy = vi.spyOn(axios, 'get');

    const mockQuizItems = [1, 2, 3];
    const mockSubjects: { data: WaniKaniSubject[] } = {
        data: [
            {
                data: {
                    characters: '人工',
                    readings: [
                        {
                            reading: 'じんこう',
                        },
                    ],
                    meanings: [
                        {
                            meaning: 'construction',
                        }
                    ]
                },
                object: 'vocabulary',
            },
            {
                data: {
                    characters: '大した',
                    readings: [
                        {
                            reading: 'たいした',
                        },
                    ],
                    meanings: [
                        {
                            meaning: 'great',
                        }
                    ]
                },
                object: 'vocabulary',
            },
        ],
    };

    const submitAnswerAndContinue = async (answer: string): Promise<void> => {
        const textbox = screen.getByRole('textbox');
        await userEvent.type(textbox, answer);
        await userEvent.click(screen.getByRole('button', { name: 'Check Answer' }));
        await userEvent.click(screen.getByRole('button', { name: 'Next' }));
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

    it('does not proceed with an incorrect answer', async () => {
        const textbox = screen.getByRole('textbox');
        await userEvent.type(textbox, 'asdf');
        await userEvent.click(screen.getByRole('button', { name: 'Check Answer' }));
        expect(screen.queryByRole('button', { name: 'Check Answer'})).toBeNull();
        expect(screen.getByRole('button', { name: 'Retry'})).toBeVisible();
        expect(screen.queryByText('大した')).toBeNull();
    });

    it('cycles through the quiz with correct answers', async () => {
        await submitAnswerAndContinue('jinkou');
        expect(screen.queryByText('人工')).toBeNull();
        expect(await screen.findByText('大した')).toBeVisible();

        await submitAnswerAndContinue('taishita');
        expect(await screen.findByText('Quiz Finished!')).toBeVisible();
    });

    it('submits answer when Enter key is pressed', async () => {
        const textbox = screen.getByRole('textbox');
        await userEvent.type(textbox, 'jinnkou{enter}{enter}');
        expect(await screen.findByText('大した')).toBeVisible();
    });
});
