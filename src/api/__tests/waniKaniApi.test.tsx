import { beforeEach, expect } from 'vitest';
import { QuizConfigFormData } from '../../pages/QuizConfig.tsx';
import { fetchAndPostWaniKaniSubjectData, fetchQuizItems } from '../waniKaniApi.ts';
import axios from 'axios';
import * as BackendApi from '../backendApi.ts';

vitest.mock('axios');
vitest.mock('../backendApi.ts');

describe('WaniKani API', () => {
    const postSubjectsSpy = vi.spyOn(BackendApi, 'postSubjects');
    const axiosGetSpy = vi.spyOn(axios, 'get');

    const baseQueryConfig: QuizConfigFormData = {
        apiKey: 'apiKey',
        subjectTypes: {
            radical: false,
            kanji: false,
            vocabulary: false,
        },
        srsLevels: {
            apprentice_1: false,
            apprentice_2: false,
            apprentice_3: false,
            apprentice_4: false,
            guru_1: false,
            guru_2: false,
            master: false,
            enlightened: false,
            burned: false,
        },
    };

    describe('can construct a query string', () => {
        const headers = {
            headers: { Authorization: 'Bearer apiKey' },
        };

        beforeEach(() => {
            axiosGetSpy.mockResolvedValue({ data: [] });
        });

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

        it('for a single SRS level', () => {
            const quizConfig: QuizConfigFormData = {
                ...baseQueryConfig,
                srsLevels: {
                    ...baseQueryConfig.srsLevels,
                    apprentice_1: true,
                },
            };
            fetchQuizItems(quizConfig);
            expect(axiosGetSpy).toHaveBeenCalledWith('https://api.wanikani.com/v2/assignments?srs_stages=1', headers);
        });

        it('for multiple SRS levels', () => {
            const quizConfig: QuizConfigFormData = {
                ...baseQueryConfig,
                srsLevels: {
                    ...baseQueryConfig.srsLevels,
                    apprentice_1: true,
                    apprentice_2: true,
                    guru_1: true,
                },
            };
            fetchQuizItems(quizConfig);
            expect(axiosGetSpy).toHaveBeenCalledWith(
                'https://api.wanikani.com/v2/assignments?srs_stages=1,2,5',
                headers,
            );
        });

        it('for subjects and srs levels', () => {
            const quizConfig: QuizConfigFormData = {
                ...baseQueryConfig,
                subjectTypes: {
                    ...baseQueryConfig.subjectTypes,
                    kanji: true,
                },
                srsLevels: {
                    ...baseQueryConfig.srsLevels,
                    apprentice_1: true,
                },
            };
            fetchQuizItems(quizConfig);
            expect(axiosGetSpy).toHaveBeenCalledWith(
                'https://api.wanikani.com/v2/assignments?subject_types=kanji&srs_stages=1',
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
        expect(axiosGetSpy).toHaveBeenCalledWith('https://api.wanikani.com/v2/subjects', headers);
        expect(axiosGetSpy).toHaveBeenCalledWith('next-url', headers);
        expect(postSubjectsSpy).toHaveBeenCalledTimes(2);
    });

    it('fetchQuizItems returns an array of subject IDs', async () => {
        axiosGetSpy.mockResolvedValue({
            data: [
                { data: { subject_id: 1 } },
                { data: { subject_id: 23 } },
                { data: { subject_id: 8 } },
                { data: { subject_id: 365 } },
            ],
        });
        expect(await fetchQuizItems(baseQueryConfig)).toEqual([1, 23, 8, 365]);
    });
});
