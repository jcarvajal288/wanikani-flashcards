/** @jest-environment jsdom */
import { render, screen } from "@testing-library/react";
import {QuizConfig} from "../QuizConfig.tsx";

describe('QuizConfig', () => {
    it('has a hello world', () => {
        render(<QuizConfig/>)
        expect(screen.getByText("Hello world")).toBeVisible();
    })
});