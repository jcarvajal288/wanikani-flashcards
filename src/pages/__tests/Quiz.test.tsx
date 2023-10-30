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
                },
            },
            {
                id: 1111,
                data: {
                    characters: '大した',
                },
            },
        ],
    };

    beforeEach(async () => {
        axiosGetSpy.mockResolvedValue(mockSubjects);
        await waitFor(() => {
            render(<Quiz quizItems={mockQuizItems} />);
        });
    });

    it('looks up assignment subjects in the database on page load', async () => {
        expect(loadSubjectsSpy).toHaveBeenCalledOnce();
        expect(loadSubjectsSpy).toHaveBeenCalledWith(mockQuizItems);
        expect(axiosGetSpy).toHaveBeenCalledWith(`http://localhost:3001/loadFromDatabase?subject_ids=1,2,3`);
    });

    it('displays the subject slug as a header', async () => {
        expect(await screen.findByText('人工')).toBeVisible();
    });

    it('loads next subject when the Next Subject button is pressed', async () => {
        expect(await screen.findByText('人工')).toBeVisible();
        await userEvent.click(screen.getByRole('button', { name: 'Next Subject' }));
        expect(await screen.findByText('大した')).toBeVisible();
    });
});
