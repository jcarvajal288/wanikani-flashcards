/** @jest-environment jsdom */
import { beforeEach, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Quiz } from '../Quiz.tsx';
import * as BackendApi from '../../api/backendApi.ts';
import axios from 'axios';

vitest.mock('axios');
vitest.mock('../backendApi.ts');

describe('Quiz', () => {
    const mockQuizItems = [1, 2, 3];
    const loadSubjectsSpy = vi.spyOn(BackendApi, 'loadSubjects');
    const axiosGetSpy = vi.spyOn(axios, 'get');

    const mockSubjects = [{
        id: 7560,
        data: {
            slug: '人工'
        }
    }]

    beforeEach(async () => {
        axiosGetSpy.mockResolvedValue(mockSubjects)
        await waitFor(() => {
            render(<Quiz quizItems={mockQuizItems} />);
        });
    });

    it('looks up assignment subjects in the database on page load', async () => {
        expect(loadSubjectsSpy).toHaveBeenCalledOnce();
        expect(loadSubjectsSpy).toHaveBeenCalledWith(mockQuizItems);
        expect(axiosGetSpy).toHaveBeenCalledWith(`http://localhost:3001/loadFromDatabase?subject_ids=1,2,3`);
    });

    it('displays the subject slug as a header', () => {
        expect(screen.getByText('人工')).toBeVisible();
    })
});
