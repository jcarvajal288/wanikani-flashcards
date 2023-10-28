/** @jest-environment jsdom */
import { userEvent } from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import App from '../App.tsx';
import * as WaniKaniApi from '../api/waniKaniApi.ts';
import * as BackendApi from '../api/backendApi.ts';

vitest.mock('axios');
vi.mock('../api/waniKaniApi.ts');
vi.mock('../api/backendApi.ts');

describe('App', () => {
    const fetchQuizItemsSpy = vi.spyOn(WaniKaniApi, 'fetchQuizItems');
    const loadSubjectsSpy = vi.spyOn(BackendApi, 'loadSubjects');

    it('proceeds to Quiz page when Generate Quiz button is pressed', async () => {
        fetchQuizItemsSpy.mockResolvedValue([1, 2, 3]);
        loadSubjectsSpy.mockResolvedValue([
            {
                data: {
                    characters: '出す',
                },
            },
        ]);
        render(<App />);
        await userEvent.click(screen.getByRole('textbox', { name: 'API Key' }));
        await userEvent.paste('apiKey');
        await userEvent.click(screen.getByRole('button', { name: 'Generate Quiz' }));
        expect(await screen.findByText('出す')).toBeVisible();
    });
});
