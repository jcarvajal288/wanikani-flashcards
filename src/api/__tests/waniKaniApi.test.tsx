import { expect } from 'vitest';
import { QuizConfigFormData } from '../../pages/QuizConfig.tsx';
import { fetchAndPostWaniKaniSubjectData, fetchQuizItems } from '../waniKaniApi.ts';
import axios from 'axios';
import * as BackendApi from '../backendApi.ts';

vitest.mock('axios');
vitest.mock('../backendApi.ts');

describe('WaniKani API', () => {
    const postSubjectsSpy = vi.spyOn(BackendApi, 'postSubjects');
    const axiosGetSpy = vi.spyOn(axios, 'get');

    describe('can construct a query string', () => {
        const baseQueryConfig: QuizConfigFormData = {
            apiKey: 'apiKey',
            subjectTypes: {
                radical: false,
                kanji: false,
                vocabulary: false,
            },
        };

        const headers = {
            headers: { Authorization: 'Bearer apiKey' },
        };

        it('for kanji', () => {
            const quizConfig: QuizConfigFormData = {
                ...baseQueryConfig,
                subjectTypes: {
                    ...baseQueryConfig.subjectTypes,
                    kanji: true,
                },
            };
            fetchQuizItems(quizConfig);
            expect(axiosGetSpy).toHaveBeenCalledWith(
                'https://api.wanikani.com/v2/assignments?subject_types=kanji',
                headers,
            );
        });

        it('for radicals and vocabulary', () => {
            const quizConfig: QuizConfigFormData = {
                ...baseQueryConfig,
                subjectTypes: {
                    ...baseQueryConfig.subjectTypes,
                    radical: true,
                    vocabulary: true,
                },
            };
            fetchQuizItems(quizConfig);
            expect(axiosGetSpy).toHaveBeenCalledWith(
                'https://api.wanikani.com/v2/assignments?subject_types=radical,vocabulary,kana_vocabulary',
                headers,
            );
        });
    });

    it('can fetch WaniKani subjects and follow the next_url link', async () => {
        axiosGetSpy.mockResolvedValueOnce({
            data: {
                pages: {
                    next_url: 'next-url',
                },
            },
        });
        axiosGetSpy.mockResolvedValue({
            data: {
                pages: {
                    next_url: null,
                },
            },
        });
        const headers = {
            headers: { Authorization: 'Bearer apiKey' },
        };
        await fetchAndPostWaniKaniSubjectData('apiKey');
        postSubjectsSpy.mockImplementation(() => Promise.resolve());
        expect(axiosGetSpy).toHaveBeenCalledWith('https://api.wanikani.com/v2/subjects', headers);
        expect(axiosGetSpy).toHaveBeenCalledWith('next-url', headers);
        expect(postSubjectsSpy).toHaveBeenCalledTimes(2);
    });
});
