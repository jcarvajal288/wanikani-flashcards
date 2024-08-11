import './App.css';
import { QuizConfig } from './pages/QuizConfig.tsx';
import { useState } from 'react';
import { Quiz } from './pages/Quiz.tsx';

const App = () => {
    const [quizItems, setQuizItems] = useState<number[]>([]);
    const [isPronunciationTest, setIsPronunciationTest] = useState<boolean>(false);
    return (
        <>
            {quizItems.length === 0 ? (
                <QuizConfig
                    setQuizItems={setQuizItems}
                    setIsPronunciationTest={setIsPronunciationTest}
                />
            ) : (
                <Quiz
                    quizItems={quizItems}
                    returnHome={() => setQuizItems([])}
                    shuffle={true}
                    isPronunciationTest={isPronunciationTest}
                />
            )}
        </>
    );
};

export default App;
