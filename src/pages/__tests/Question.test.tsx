/** @jest-environment jsdom */
import { userEvent } from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { expect } from 'vitest';
import { Question } from '../Question.tsx';
import { WaniKaniSubject } from '../../types.ts';

describe('Question', () => {
    const mockKanjiSubject: WaniKaniSubject = {
        data: {
            characters: '角',
            readings: [
                {
                    reading: 'かく',
                    primary: true
                },
                {
                    reading: 'かど',
                    primary: false
                },
            ],
            meanings: [
                {
                    meaning: 'Angle',
                }
            ],
            document_url: 'https://test.com'
        },
        id: 1,
        object: 'kanji',
    };

    const mockVocabSubject: WaniKaniSubject = {
        data: {
            characters: '人工',
            readings: [
                {
                    reading: 'じんこう',
                    primary: true
                },

            ],
            meanings: [
                {
                    meaning: 'Construction',
                }
            ],
            document_url: 'https://test.com'
        },
        id: 2,
        object: 'vocabulary',
    };

    const renderReadingQuestion = (subject: WaniKaniSubject) => {
        render(
            <Question
                subject={subject}
                moveToNextSubject={() => {}}
                type='reading'
                numberOfSubjectsCompleted={0}
                totalSubjects={10}
            />,
        );
    };

    const renderMeaningQuestion = (subject: WaniKaniSubject) => {
        render(
            <Question
                subject={subject}
                moveToNextSubject={() => {}}
                type='meaning'
                numberOfSubjectsCompleted={0}
                totalSubjects={10}
            />,
        );
    };

    const submitAnswer = async (submission: string) => {
        const textbox = screen.getByRole('textbox');
        await userEvent.type(textbox, `${submission}{enter}`);
    };

    describe('Reading Questions', () => {
        it('displays kanji reading header', () => {
            renderReadingQuestion(mockKanjiSubject);
            expect(screen.getByTestId('type-header').textContent).toEqual('Kanji Reading');
        });

        it('displays vocabulary reading header', () => {
            renderReadingQuestion(mockVocabSubject);
            expect(screen.getByTestId('type-header').textContent).toEqual('Vocabulary Reading');
        });

        it('converts romaji typed into the textbox to hiragana', async () => {
            renderReadingQuestion(mockVocabSubject);
            await userEvent.click(await screen.findByRole('textbox'));
            await userEvent.paste('watashi');
            expect(screen.getByDisplayValue('わたし')).toBeVisible();
        });

        it('correctly handles "nn" as a single ん', async () => {
            renderReadingQuestion(mockVocabSubject);
            await userEvent.type(screen.getByRole('textbox'), 'jinnkou');
            expect(screen.getByDisplayValue('じんこう')).toBeVisible();
        });

        it('evaluates a primary reading submission', async () => {
            renderReadingQuestion(mockVocabSubject);
            await submitAnswer('jinnkou')
            expect(screen.getByText('Next')).toBeVisible();
        })

        it('evaluates a non-primary reading submission', async () => {
            renderReadingQuestion(mockKanjiSubject);
            await submitAnswer('kado')
            expect(screen.getByText('Retry')).toBeVisible();
        })
    });

    describe('Meaning Questions', () => {
        it('displays if it is a kanji meaning question', () => {
            renderMeaningQuestion(mockKanjiSubject);
            expect(screen.getByTestId('type-header').textContent).toEqual('Kanji Meaning');
        });

        it('leaves text typed into the textbox as english', async () => {
            renderMeaningQuestion(mockVocabSubject);
            await submitAnswer('watashi')
            expect(screen.queryByDisplayValue('わたし')).toBeNull();
            expect(screen.getByDisplayValue('watashi')).toBeVisible();
        });

        it('evaluates a meaning submission', async () => {
            renderMeaningQuestion(mockVocabSubject);
            await submitAnswer('construction')
            expect(screen.getByText('Next')).toBeVisible();
        })
    });

    it('disables answer input after a submission', async () => {
        renderReadingQuestion(mockVocabSubject);
        const textbox = screen.getByRole('textbox');
        await userEvent.type(textbox, 'jinnkou{enter}wa');
        expect(screen.getByDisplayValue('じんこう')).toBeVisible();
        expect(screen.queryByDisplayValue('じんこうわ')).toBeNull();
    });

    it('has a Subject Page button that links to the subject\'s WaniKani page', () => {
        renderReadingQuestion(mockVocabSubject);
        const subjectPageButton = screen.getByRole('link', { name: 'Subject Page' });
        expect(subjectPageButton).toHaveAttribute('href', 'https://test.com');
        expect(subjectPageButton).toHaveAttribute('target', '_blank');
    })

    it('displays the number of subjects completed and total subjects in the quiz', () => {
        renderReadingQuestion(mockVocabSubject);
        expect(screen.getByText('1/10')).toBeVisible();
    })
});
