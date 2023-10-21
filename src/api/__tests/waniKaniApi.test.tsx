import { expect } from 'vitest';
import { QuizConfigFormData } from '../../pages/QuizConfig.tsx';
import { fetchQuizItems } from '../waniKaniApi.ts';
import axios from 'axios';

vitest.mock('axios');

describe('WaniKani API', () => {
    describe('can construct a query string', () => {
        const axiosGetSpy = vi.spyOn(axios, 'get');

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

        it('for kanji', async () => {
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
});
