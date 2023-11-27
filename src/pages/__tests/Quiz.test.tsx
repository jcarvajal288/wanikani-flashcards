/** @jest-environment jsdom */
import { expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Quiz } from '../Quiz.tsx';
import * as BackendApi from '../../api/backendApi.ts';
import axios from 'axios';
import { userEvent } from '@testing-library/user-event';
import { WaniKaniSubject } from '../../types.ts';

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
                        },
                    ],
                    document_url: 'www.test.com'
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
                        },
                    ],
                    document_url: 'www.test.com'
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

    const renderQuiz = async (subjects: { data: WaniKaniSubject[] }) => {
        axiosGetSpy.mockResolvedValue(subjects);
        await waitFor(() => {
            render(
                <Quiz
                    quizItems={mockQuizItems}
                    returnHome={() => {}}
                    shuffle={false}
                />,
            );
        });
        await screen.findByText('Check Answer');
    };

    it('looks up assignment subjects in the database on page load', async () => {
        await renderQuiz(mockSubjects);
        expect(loadSubjectsSpy).toHaveBeenCalledOnce();
        expect(loadSubjectsSpy).toHaveBeenCalledWith(mockQuizItems);
        expect(axiosGetSpy).toHaveBeenCalledWith(`http://localhost:3001/loadFromDatabase?subject_ids=1,2,3`);
    });

    it('does not proceed with an incorrect answer', async () => {
        await renderQuiz(mockSubjects);
        const textbox = screen.getByRole('textbox');
        await userEvent.type(textbox, 'asdf');
        await userEvent.click(screen.getByRole('button', { name: 'Check Answer' }));
        expect(screen.queryByRole('button', { name: 'Check Answer' })).toBeNull();
        expect(screen.getByRole('button', { name: 'Retry' })).toBeVisible();
        expect(screen.queryByText('大した')).toBeNull();
    });

    it('cycles through the quiz with correct answers', async () => {
        await renderQuiz(mockSubjects);
        expect(screen.getByText('1/4')).toBeVisible()
        await submitAnswerAndContinue('jinkou');
        expect(screen.getByText('2/4')).toBeVisible()
        await submitAnswerAndContinue('construction');
        expect(screen.queryByText('人工')).toBeNull();
        expect(await screen.findByText('大した')).toBeVisible();

        expect(screen.getByText('3/4')).toBeVisible()
        await submitAnswerAndContinue('taishita');
        expect(screen.getByText('4/4')).toBeVisible()
        await submitAnswerAndContinue('great');
        expect(await screen.findByText('Quiz Finished!')).toBeVisible();
    });

    it('only shows meaning questions for radicals', async () => {
        await renderQuiz({
            data: [
                {
                    data: {
                        characters: '罒',
                        meanings: [
                            {
                                meaning: 'net',
                            },
                        ],
                        document_url: 'www.test.com'
                    },
                    object: 'radical',
                },
            ],
        });
        await submitAnswerAndContinue('net');
        expect(await screen.findByText('Quiz Finished!')).toBeVisible();
    });
});
