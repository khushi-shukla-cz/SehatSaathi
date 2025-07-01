import { useState, useEffect } from 'react';
import { Check, X, ChevronRight, Trophy, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

type Question = {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  difficulty: string;
  category: string;
};

type QuizAttempt = {
  score: number;
  total_questions: number;
  completed_at: string;
};

export default function FirstAidQuiz() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    const initializeQuestions = async () => {
      // Check if questions exist
      const { count } = await supabase
        .from('first_aid_questions')
        .select('*', { count: 'exact', head: true });

      if (count === 0) {
        // Add sample questions
        const { error } = await supabase.from('first_aid_questions').insert([
          {
            question: 'What is the first step in CPR?',
            options: ['Check for breathing', 'Call emergency services', 'Begin chest compressions', 'Give rescue breaths'],
            correct_answer: 1,
            explanation: 'Always check if the person is breathing before starting CPR. If unresponsive and not breathing normally, call emergency services immediately.',
            difficulty: 'easy',
            category: 'CPR'
          },
          {
            question: 'How should you treat a nosebleed?',
            options: ['Tilt head back', 'Pinch soft part of nose', 'Lie down flat', 'Put cotton in nostrils'],
            correct_answer: 1,
            explanation: 'Pinch the soft part of the nose for 10-15 minutes while leaning slightly forward. Tilting head back can cause blood to go down the throat.',
            difficulty: 'easy',
            category: 'Bleeding'
          },
          {
            question: 'What should you do for a sprained ankle?',
            options: ['Apply heat immediately', 'Use the RICE method', 'Massage the area', 'Continue walking on it'],
            correct_answer: 1,
            explanation: 'Use Rest, Ice, Compression, and Elevation (RICE) to reduce swelling and pain. Heat and massage can increase swelling in the first 48 hours.',
            difficulty: 'medium',
            category: 'Sprains'
          }
        ]);

        if (error) console.error('Error adding sample questions:', error);
        else fetchQuestions(); // Refresh questions
      } else {
        fetchQuestions();
      }
    };

    initializeQuestions();
    if (user) fetchAttempts();
  }, [user]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('first_aid_questions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttempts = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('score, total_questions, completed_at')
        .eq('user_id', user?.id || '')
        .order('completed_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setAttempts(data || []);
    } catch (error) {
      console.error('Error fetching attempts:', error);
    }
  };

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.correct_answer) {
      setScore(score + 1);
    }
    
    setShowExplanation(true);
  };

  const continueQuiz = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = async () => {
    setQuizCompleted(true);
    
    if (user) {
      try {
        const { error } = await supabase
          .from('quiz_attempts')
          .insert([{
            user_id: user.id,
            score,
            total_questions: questions.length
          }]);

        if (error) throw error;
        fetchAttempts();
      } catch (error) {
        console.error('Error saving quiz attempt:', error);
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizCompleted(false);
    setShowExplanation(false);
    fetchQuestions();
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Loading questions...</div>;
  if (questions.length === 0) return <div className="container mx-auto px-4 py-8">No questions available</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + (selectedOption !== null ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>First Aid Quiz</span>
            <span className="text-sm font-normal">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!quizCompleted ? (
            <div className="space-y-6">
              <Progress value={progress} className="h-2" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
                
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedOption === index ? 'default' : 'outline'}
                      className={`w-full justify-start ${selectedOption !== null && 
                        index === currentQuestion.correct_answer ? 'bg-green-100 dark:bg-green-900' : ''}`}
                      onClick={() => !showExplanation && handleOptionSelect(index)}
                      disabled={showExplanation}
                    >
                      {selectedOption !== null && (
                        <span className="mr-2">
                          {index === currentQuestion.correct_answer ? (
                            <Check className="h-4 w-4" />
                          ) : selectedOption === index ? (
                            <X className="h-4 w-4" />
                          ) : null}
                        </span>
                      )}
                      {option}
                    </Button>
                  ))}
                </div>
                
                {showExplanation && (
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                    <p className="font-medium">Explanation:</p>
                    <p>{currentQuestion.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-4">
                <Trophy className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Quiz Completed!</h3>
              <p className="text-xl">
                Your score: {score} out of {questions.length}
              </p>
              <p className="text-lg">
                {score === questions.length ? 'Perfect! 🎉' : 
                 score >= questions.length * 0.7 ? 'Great job! 👍' : 
                 'Keep practicing! 💪'}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {!quizCompleted ? (
            <>
              <div className="text-sm text-gray-500">
                Difficulty: {currentQuestion.difficulty}
              </div>
              {!showExplanation ? (
                <Button 
                  onClick={handleNextQuestion}
                  disabled={selectedOption === null}
                >
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={continueQuiz}>
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </>
          ) : (
            <Button onClick={restartQuiz} className="w-full">
              Start New Quiz
            </Button>
          )}
        </CardFooter>
      </Card>

      {attempts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Previous Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attempts.map((attempt, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {new Date(attempt.completed_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="font-medium">
                    {attempt.score}/{attempt.total_questions} (
                    {Math.round((attempt.score / attempt.total_questions) * 100)}%)
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
