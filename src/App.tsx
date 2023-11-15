import './App.css';
import { QuizConfig } from './pages/QuizConfig.tsx';
import { useState } from 'react';
import { Quiz } from './pages/Quiz.tsx';

const App = () => {
    const [quizItems, setQuizItems] = useState<number[]>([]);
    return (
        <>
            {quizItems.length === 0 ? (
                <QuizConfig setQuizItems={setQuizItems} />
            ) : (
                <Quiz
                    quizItems={quizItems}
                    returnHome={() => setQuizItems([])}
                    shuffle={true}
                />
            )}
        </>
    );
};

export default App;
