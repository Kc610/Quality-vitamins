
import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants.tsx';
import { Category } from '../types.ts';
import { ChevronRight, ChevronLeft, Target, Trophy, Sparkles, ShoppingBag, Activity, ShieldCheck } from 'lucide-react';

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
    const goalAnswer = answers[1];
    return goalAnswer ? goalAnswer.recommendation : Category.PROTEINS;
  };

  if (isFinished) {
    const recommended = getRecommendation();
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-hh-light animate-in zoom-in duration-700">
        <div className="max-w-lg w-full text-center">
          <div className="w-32 h-32 bg-hh-dark rounded-[3.5rem] flex items-center justify-center text-hh-green mx-auto mb-10 shadow-4xl border-4 border-hh-green/20">
            <Trophy className="w-14 h-14" />
          </div>
          <h2 className="font-heading text-5xl font-black italic uppercase mb-4 tracking-tighter">
            SYNTHESIS <span className="text-hh-green">COMPLETE</span>
          </h2>
          <p className="text-gray-500 mb-12 font-bold uppercase tracking-[0.4em] text-[10px] italic">Protocol Optimized for: <span className="text-hh-dark">{recommended}</span></p>
          
          <div className="bg-white p-12 rounded-[4.5rem] shadow-4xl border-4 border-hh-green/10 mb-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-hh-orange/5 rounded-full blur-3xl group-hover:bg-hh-orange/10 transition-all"></div>
            <Sparkles className="w-10 h-10 text-hh-orange mx-auto mb-8 animate-pulse" />
            <h3 className="font-heading text-3xl font-black uppercase italic mb-4 tracking-tighter">BIO-LINK UNLOCKED</h3>
            <p className="text-sm font-black uppercase text-hh-green tracking-[0.5em] mb-10">Deploy code: ELITE10</p>
            <button 
              onClick={() => navigate('shop')}
              className="w-full py-7 bg-hh-dark text-white font-heading font-black rounded-[2.5rem] hover:bg-hh-green transition-all shadow-3xl flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-sm"
            >
              DEPLOY FUEL STACK <ShoppingBag className="w-6 h-6" />
            </button>
          </div>
          
          <button 
            onClick={() => { setIsFinished(false); setCurrentStep(0); setAnswers({}); }}
            className="text-gray-400 font-black uppercase text-[9px] tracking-[0.8em] hover:text-hh-dark transition-colors"
          >
            RE-CALIBRATE NEURAL PROTOCOL
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = QUIZ_QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-32 bg-hh-light">
      <div className="max-w-2xl w-full">
        <div className="mb-12 px-4">
          <div className="flex justify-between items-end mb-6 font-heading font-black uppercase tracking-[0.5em] text-[10px] text-gray-400">
            <span className="flex items-center gap-3"><Activity className="w-5 h-5 text-hh-green" /> NODE {currentStep + 1} / {QUIZ_QUESTIONS.length}</span>
            <span className="text-hh-green">{Math.round(progress)}% ANALYZED</span>
          </div>
          <div className="w-full h-3 bg-white rounded-full overflow-hidden shadow-inner border border-gray-100">
            <div className="h-full bg-hh-green transition-all duration-1000 ease-out shadow-[0_0_20px_#4CAF50]" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-[5rem] p-12 md:p-20 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.1)] border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-hh-green/5 rounded-full blur-[100px]"></div>
          
          <div className="w-20 h-20 bg-hh-dark rounded-[2rem] flex items-center justify-center text-hh-green mb-12 shadow-3xl transform -rotate-6">
            <Target className="w-10 h-10" />
          </div>
          
          <h2 className="font-heading text-4xl md:text-5xl font-black italic uppercase leading-tight mb-16 tracking-tighter text-hh-dark">
            {currentQuestion.text}
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(currentQuestion.id, option)}
                className="group w-full p-8 text-left border-4 border-gray-50 rounded-[2.5rem] hover:border-hh-green hover:bg-hh-green/5 transition-all flex items-center justify-between shadow-sm hover:shadow-2xl transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-6">
                   <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-black text-gray-300 group-hover:bg-hh-green group-hover:text-white transition-all italic text-xs">
                     0{idx + 1}
                   </div>
                   <span className="font-black text-xl text-hh-dark group-hover:text-hh-green tracking-tight uppercase">{option.label}</span>
                </div>
                <ChevronRight className="w-8 h-8 text-gray-200 group-hover:text-hh-green group-hover:translate-x-2 transition-all" />
              </button>
            ))}
          </div>

          <div className="mt-16 pt-12 border-t-2 border-gray-50 flex items-center justify-between">
            <button 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-4 font-heading font-black text-xs text-gray-300 hover:text-hh-dark disabled:opacity-0 transition-all uppercase tracking-[0.4em]"
            >
              <ChevronLeft className="w-6 h-6" /> PREVIOUS NODE
            </button>
            <div className="flex items-center gap-2 opacity-30">
               <ShieldCheck className="w-4 h-4" />
               <span className="text-[8px] font-black uppercase tracking-widest">Protocol Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
