import { beforeEach, expect } from 'vitest';
import {
    fetchAndPostWaniKaniSubjectData,
    fetchQuizItems
} from '../waniKaniApi.ts';
import axios from 'axios';
import * as BackendApi from '../backendApi.ts';
import {CRITICAL_CONDITION_THRESHOLD, QuizConfigFormData} from "../../types.ts";

vitest.mock('axios');
vitest.mock('../backendApi.ts');

describe('WaniKani API', () => {
    const postSubjectsSpy = vi.spyOn(BackendApi, 'postSubjects');
    const axiosGetSpy = vi.spyOn(axios, 'get');

    const baseQuizConfig: QuizConfigFormData = {
        apiKey: 'apiKey',
        percentageCorrectThreshold: 100,
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
            axiosGetSpy.mockResolvedValue({ data: { data: [] } });
        });

        it('for kanji', () => {
            const quizConfig: QuizConfigFormData = {
                ...baseQuizConfig,
                subjectTypes: {
                    ...baseQuizConfig.subjectTypes,
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
                ...baseQuizConfig,
                subjectTypes: {
                    ...baseQuizConfig.subjectTypes,
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
                ...baseQuizConfig,
                srsLevels: {
                    ...baseQuizConfig.srsLevels,
                    apprentice_1: true,
                },
            };
            fetchQuizItems(quizConfig);
            expect(axiosGetSpy).toHaveBeenCalledWith('https://api.wanikani.com/v2/assignments?srs_stages=1', headers);
        });

        it('for multiple SRS levels', () => {
            const quizConfig: QuizConfigFormData = {
                ...baseQuizConfig,
                srsLevels: {
                    ...baseQuizConfig.srsLevels,
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
                ...baseQuizConfig,
                subjectTypes: {
                    ...baseQuizConfig.subjectTypes,
                    kanji: true,
                },
                srsLevels: {
                    ...baseQuizConfig.srsLevels,
                    apprentice_1: true,
                },
            };
            fetchQuizItems(quizConfig);
            expect(axiosGetSpy).toHaveBeenCalledWith(
                'https://api.wanikani.com/v2/assignments?subject_types=kanji&srs_stages=1',
                headers,
            );
        });

        it('for critical condition items', () => {
            const quizConfig: QuizConfigFormData = {
                ...baseQuizConfig,
                percentageCorrectThreshold: CRITICAL_CONDITION_THRESHOLD
            };
            fetchQuizItems(quizConfig);
            expect(axiosGetSpy).toHaveBeenCalledWith(
                `https://api.wanikani.com/v2/review_statistics?percentages_less_than=${CRITICAL_CONDITION_THRESHOLD}`,
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
            data: {
                data: [
                    { data: { subject_id: 1 } },
                    { data: { subject_id: 23 } },
                    { data: { subject_id: 8 } },
                    { data: { subject_id: 365 } },
                ],
            },
        });
        expect(await fetchQuizItems(baseQuizConfig)).toEqual([1, 23, 8, 365]);
    });

    it('filter output of fetchQuizItems with Critical Condition items', async () => {
        axiosGetSpy.mockResolvedValueOnce({ // fetchAssignments get
            data: {
                data: [
                    { data: { subject_id: 1 } },
                    { data: { subject_id: 2 } },
                    { data: { subject_id: 3 } },
                    { data: { subject_id: 4 } },
                    { data: { subject_id: 5 } },
                ],
            },
        });
        axiosGetSpy.mockResolvedValueOnce({ // fetchCriticalConditionItems get
            data: {
                data: [
                    { data: { subject_id: 2 } },
                    { data: { subject_id: 4 } },
                    { data: { subject_id: 6 } },
                    { data: { subject_id: 8 } },
                ],
            },
        });
        const quizConfig = {
            ...baseQuizConfig,
            percentageCorrectThreshold: CRITICAL_CONDITION_THRESHOLD
        }
        expect(await fetchQuizItems(quizConfig)).toEqual([2, 4]);
    })

    it('if no critical items are in assignments, return critical items', async () => {
        // this often happens when only critical items is checked
        axiosGetSpy.mockResolvedValueOnce({ // fetchAssignments get
            data: {
                data: [
                    { data: { subject_id: 1 } },
                    { data: { subject_id: 2 } },
                    { data: { subject_id: 3 } },
                    { data: { subject_id: 4 } },
                    { data: { subject_id: 5 } },
                ],
            },
        });
        axiosGetSpy.mockResolvedValueOnce({ // fetchCriticalConditionItems get
            data: {
                data: [
                    { data: { subject_id: 6 } },
                    { data: { subject_id: 8 } },
                ],
            },
        });
        const quizConfig = {
            ...baseQuizConfig,
            percentageCorrectThreshold: CRITICAL_CONDITION_THRESHOLD
        }
        expect(await fetchQuizItems(quizConfig)).toEqual([6, 8]);
    })
});
