/** @jest-environment jsdom */
import { userEvent } from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import App from '../App.tsx';

vi.mock('../api/waniKaniApi.ts');

describe('App', () => {
    it('proceeds to Quiz page when Generate Quiz button is pressed', async () => {
        render(<App />);
        await userEvent.click(screen.getByRole('textbox', { name: 'API Key' }));
        await userEvent.paste('apiKey');
        await userEvent.click(screen.getByRole('button', { name: 'Generate Quiz' }));
        expect(await screen.findByText('Quiz contains:')).toBeVisible();
    });
});
