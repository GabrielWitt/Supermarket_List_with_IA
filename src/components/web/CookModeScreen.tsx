import React, { useState } from "react";
import { X, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Check, Sparkles } from "lucide-react";
import { Recipe } from "../DeviceEmulator";
import { useLanguage } from "../../lib/LanguageContext";

interface CookModeScreenProps {
  recipe: Recipe;
  currentStep: number;
  setCurrentStep: (n: number) => void;
  timerSeconds: number;
  setTimerSeconds: (n: number | ((prev: number) => number)) => void;
  timerActive: boolean;
  setTimerActive: (b: boolean) => void;
  onClose: () => void;
  onFinish: (updatePantry: boolean) => void;
}

export const CookModeScreen: React.FC<CookModeScreenProps> = ({
  recipe,
  currentStep,
  setCurrentStep,
  timerSeconds,
  setTimerSeconds,
  timerActive,
  setTimerActive,
  onClose,
  onFinish,
}) => {
  const { language } = useLanguage();
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [deductPantry, setDeductPantry] = useState(true);

  const totalSteps = recipe.steps.length;
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  // Format timer MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowFinishModal(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleResetTimer = () => {
    setTimerActive(false);
    // Default to recipe cookTime or 15 mins
    const timeMatch = recipe.cookTime.match(/(\d+)/);
    const minutes = timeMatch ? parseInt(timeMatch[1], 10) : 15;
    setTimerSeconds(minutes * 60);
  };

  return (
    <div className="absolute inset-0 bg-zinc-950 text-white z-50 flex flex-col h-full overflow-hidden select-none">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-900 flex items-center justify-between shrink-0">
        <div className="space-y-0.5">
          <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-wider">
            {language === "es" ? "Modo Cocina" : "Cooking Mode"}
          </span>
          <h2 className="text-xs font-black text-white truncate max-w-[200px]">{recipe.name}</h2>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-900 h-1">
        <div 
          className="bg-[#52B788] h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Instruction Card Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-between">
        {/* Step Indicator */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-zinc-500 text-[10px] font-black uppercase tracking-widest">
            <span>
              {language === "es" ? `Paso ${currentStep + 1} de ${totalSteps}` : `Step ${currentStep + 1} of ${totalSteps}`}
            </span>
            <span className="text-[#52B788]">
              {language === "es" ? `${progressPercent}% completado` : `${progressPercent}% complete`}
            </span>
          </div>

          <div className="min-h-[160px] flex items-center">
            <p className="text-lg md:text-xl font-bold leading-relaxed text-zinc-100">
              {recipe.steps[currentStep]}
            </p>
          </div>
        </div>

        {/* Integrated Cooking Timer */}
        <div className="bg-zinc-900/60 border border-zinc-900/80 rounded-2xl p-5 space-y-4 my-6 shrink-0 text-center relative overflow-hidden">
          {/* Animated background glow when active */}
          {timerActive && (
            <div className="absolute inset-0 bg-[#52B788]/5 animate-pulse pointer-events-none" />
          )}

          <div className="space-y-1">
            <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest block">
              {language === "es" ? "Temporizador del Paso" : "Step Timer"}
            </span>
            <h1 className={`text-3xl font-black font-mono transition-all ${timerActive ? "text-[#52B788] scale-105" : "text-zinc-300"}`}>
              {formatTime(timerSeconds)}
            </h1>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handleResetTimer}
              className="w-9 h-9 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              title={language === "es" ? "Reiniciar" : "Reset Timer"}
            >
              <RotateCcw size={15} />
            </button>
            <button
              onClick={() => setTimerActive(!timerActive)}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${timerActive ? "bg-amber-500 text-zinc-950 hover:bg-amber-400" : "bg-[#2D6A4F] text-white hover:bg-[#40916C]"}`}
            >
              {timerActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Swipe Navigation Bottom Row */}
      <div className="p-5 border-t border-zinc-900 bg-zinc-950 shrink-0 flex items-center justify-between space-x-4">
        <button
          disabled={currentStep === 0}
          onClick={handlePrev}
          className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 disabled:opacity-20 disabled:hover:bg-zinc-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1"
        >
          <ChevronLeft size={16} />
          <span>{language === "es" ? "Paso Anterior" : "Back Step"}</span>
        </button>

        <button
          onClick={handleNext}
          className={`flex-1 py-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 ${currentStep === totalSteps - 1 ? "bg-[#52B788] text-zinc-950 hover:bg-[#74C69D] shadow-lg shadow-[#52B788]/20" : "bg-zinc-800 hover:bg-zinc-700 text-white"}`}
        >
          <span>
            {currentStep === totalSteps - 1 
              ? (language === "es" ? "Completar" : "Complete") 
              : (language === "es" ? "Siguiente Paso" : "Next Step")}
          </span>
          {currentStep === totalSteps - 1 ? <Check size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Completion Modal */}
      {showFinishModal && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-5 animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-xs space-y-5 text-center">
            <div className="w-12 h-12 bg-[#52B788]/10 text-[#52B788] rounded-full flex items-center justify-center mx-auto">
              <Sparkles size={24} className="animate-bounce" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-black text-white">
                {language === "es" ? "¡Mmm, se ve delicioso!" : "Yum, Looks Delicious!"}
              </h3>
              <p className="text-xs text-zinc-400">
                {language === "es" ? "Has preparado esta receta con éxito. ¡Excelente trabajo!" : "You've successfully prepared this recipe. Awesome job!"}
              </p>
            </div>

            {/* Pantry Deduction Toggle */}
            <div className="p-3 bg-zinc-950/50 border border-zinc-850 rounded-xl flex items-center justify-between text-left">
              <div className="space-y-0.5">
                <span className="text-[10px] text-zinc-400 font-extrabold block uppercase tracking-wider">
                  {language === "es" ? "Despensa" : "Kitchen Pantry"}
                </span>
                <span className="text-[11px] text-zinc-300 font-medium">
                  {language === "es" ? "Descontar ingredientes" : "Deduct recipe ingredients"}
                </span>
              </div>
              <input
                type="checkbox"
                checked={deductPantry}
                onChange={e => setDeductPantry(e.target.checked)}
                className="w-4.5 h-4.5 rounded text-[#2D6A4F] bg-zinc-800 border-zinc-700 focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="flex space-x-2.5">
              <button
                onClick={() => setShowFinishModal(false)}
                className="flex-1 py-2.5 bg-zinc-800 text-zinc-400 rounded-xl text-xs font-bold hover:bg-zinc-750 transition-colors"
              >
                {language === "es" ? "Cerrar" : "Close"}
              </button>
              <button
                onClick={() => onFinish(deductPantry)}
                className="flex-1 py-2.5 bg-[#52B788] text-zinc-950 rounded-xl text-xs font-black hover:bg-[#74C69D] transition-colors"
              >
                {language === "es" ? "Listo" : "Done"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
