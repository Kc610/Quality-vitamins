
import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { Category } from '../types';
import { ChevronRight, ChevronLeft, Target, Trophy, Sparkles, ShoppingBag } from 'lucide-react';

interface QuizProps {
  navigate: (page: any) => void;
}

const Quiz: React.FC<QuizProps> = ({ navigate }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (questionId: number, option: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const getRecommendation = () => {
    // Basic logic: prioritize the first question's goal
    const goalAnswer = answers[1];
    return goalAnswer ? goalAnswer.recommendation : Category.PROTEINS;
  };

  if (isFinished) {
    const recommended = getRecommendation();
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 animate-in zoom-in duration-500">
        <div className="max-w-2xl w-full text-center">
          <div className="w-24 h-24 bg-hh-green/20 rounded-full flex items-center justify-center text-hh-green mx-auto mb-8 animate-bounce">
            <Trophy className="w-12 h-12" />
          </div>
          <h2 className="font-heading text-4xl font-black italic uppercase mb-4">
            YOUR TRANSFORMATION <span className="text-hh-green">PATH</span>
          </h2>
          <p className="text-gray-500 mb-12">Based on your goals, we recommend starting with our <span className="text-hh-dark font-bold">{recommended}</span> collection.</p>
          
          <div className="bg-hh-light p-8 rounded-[2rem] border-2 border-dashed border-hh-green/30 mb-10">
            <Sparkles className="w-6 h-6 text-hh-orange mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold mb-2">Exclusive Quiz Discount!</h3>
            <p className="text-sm font-bold uppercase text-hh-green tracking-widest mb-6">Use code: TRANSFORMATION10</p>
            <button 
              onClick={() => navigate('shop')}
              className="px-10 py-4 bg-hh-dark text-white font-heading font-bold rounded-full hover:bg-hh-green transition-all shadow-xl flex items-center justify-center gap-2 mx-auto"
            >
              SHOP YOUR RESULTS <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
          
          <button 
            onClick={() => { setIsFinished(false); setCurrentStep(0); setAnswers({}); }}
            className="text-gray-400 font-bold uppercase text-xs hover:text-hh-dark underline"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = QUIZ_QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20 bg-hh-light">
      <div className="max-w-2xl w-full">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4 font-heading font-bold uppercase tracking-widest text-[10px] text-gray-400">
            <span>Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
            <span className="text-hh-green">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-hh-green transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl animate-in slide-in-from-right duration-300">
          <div className="w-12 h-12 bg-hh-orange/10 rounded-xl flex items-center justify-center text-hh-orange mb-6">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="font-heading text-3xl font-black italic uppercase leading-none mb-10">
            {currentQuestion.text}
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(currentQuestion.id, option)}
                className="group w-full p-6 text-left border-2 border-gray-50 rounded-2xl hover:border-hh-green hover:bg-hh-green/5 transition-all flex items-center justify-between"
              >
                <span className="font-bold text-lg text-hh-dark group-hover:text-hh-green">{option.label}</span>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-hh-green translate-x-0 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>

          <div className="mt-10 pt-10 border-t border-gray-50 flex items-center justify-between">
            <button 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-2 font-heading font-bold text-gray-400 hover:text-hh-dark disabled:opacity-0 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" /> PREVIOUS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
