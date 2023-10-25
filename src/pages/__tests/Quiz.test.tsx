/** @jest-environment jsdom */
import { beforeEach, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Quiz } from '../Quiz.tsx';
import * as BackendApi from '../../api/backendApi.ts';

vitest.mock('../backendApi.ts');

describe('Quiz', () => {
    const mockQuizItems = [1, 2, 3];
    const loadSubjectsSpy = vi.spyOn(BackendApi, 'loadSubjects');

    beforeEach(() => {
        render(<Quiz quizItems={mockQuizItems} />);
    });

    it('looks up assignment subjects in the database on page load', () => {
        expect(loadSubjectsSpy).toHaveBeenCalledWith(mockQuizItems);
    });
});
