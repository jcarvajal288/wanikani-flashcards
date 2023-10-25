import './App.css';
import { QuizConfig } from './pages/QuizConfig.tsx';
import { useState } from 'react';
import { JSONValue } from './types.ts';
import { Quiz } from './pages/Quiz.tsx';

const App = () => {
    const [quizItems, setQuizItems] = useState<JSONValue | null>(null);
    return <>{quizItems === null ? <QuizConfig setQuizItems={setQuizItems} /> : <Quiz quizItems={quizItems} />}</>;
};

export default App;
