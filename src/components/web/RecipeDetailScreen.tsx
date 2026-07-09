import React from "react";
import { ChevronLeft, Pencil, Minus, Plus, Clock, Flame, Award, Sparkles, ChefHat } from "lucide-react";
import { Recipe } from "../DeviceEmulator";
import { useLanguage } from "../../lib/LanguageContext";

interface RecipeDetailScreenProps {
  recipe: Recipe;
  servings: number;
  setServings: (n: number) => void;
  activeTab: "Ingredients" | "Steps" | "Info";
  setActiveTab: (t: "Ingredients" | "Steps" | "Info") => void;
  onClose: () => void;
  onEdit: () => void;
  onStartCook: () => void;
  onImportIngredients: () => void;
  isDarkMode: boolean;
}

export const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({
  recipe,
  servings,
  setServings,
  activeTab,
  setActiveTab,
  onClose,
  onEdit,
  onStartCook,
  onImportIngredients,
  isDarkMode,
}) => {
  const { language } = useLanguage();

  const getTranslatedDifficulty = (diff: string) => {
    if (language !== "es") return diff;
    if (diff === "Easy") return "Fácil";
    if (diff === "Medium") return "Medio";
    if (diff === "Hard") return "Difícil";
    return diff;
  };

  return (
    <div className="animate-fade-in flex flex-col h-full bg-[#F2F2F7] dark:bg-zinc-950 overflow-hidden select-none">
      {/* Hero Image Container */}
      <div className="relative h-56 bg-gradient-to-b from-[#40916C] to-[#1B4332] flex flex-col justify-end p-5 text-white shrink-0">
        {/* Back & Options Buttons */}
        <div className="absolute top-4 left-4 flex items-center space-x-2 z-10">
          <button
            onClick={onClose}
            className="w-9 h-9 bg-white/95 dark:bg-zinc-900/95 rounded-full flex items-center justify-center text-gray-800 dark:text-white shadow-sm active:scale-95 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
          <button
            onClick={onEdit}
            className="w-9 h-9 bg-white/95 dark:bg-zinc-900/95 rounded-full flex items-center justify-center text-gray-800 dark:text-white shadow-sm active:scale-95 transition-all"
          >
            <Pencil size={15} />
          </button>
        </div>

        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

        {/* Tags and Title over hero */}
        <div className="relative z-10 space-y-1.5">
          <div className="flex flex-wrap gap-1">
            <span className="text-[9px] bg-white/20 px-2.5 py-0.5 rounded-full font-semibold backdrop-blur-sm">⏱ {recipe.prepTime}</span>
            <span className="text-[9px] bg-white/20 px-2.5 py-0.5 rounded-full font-semibold backdrop-blur-sm">👥 {servings} {language === "es" ? "porciones" : "servings"}</span>
            <span className="text-[9px] bg-[#D8F3DC] text-[#1B4332] px-2 py-0.5 rounded-full font-semibold">{language === "es" ? "🌿 Saludable" : "🌿 Healthy"}</span>
          </div>
          <h1 className="text-lg font-black leading-tight text-white line-clamp-2">{recipe.name}</h1>
          <p className="text-[9px] text-white/80 font-medium flex items-center">
            <Sparkles size={9} className="mr-0.5 text-yellow-300" />
            <span>
              {language === "es" ? "Delicia Culinaria Recomendada por IA" : "AI Recommended Culinary Delight"}
            </span>
          </p>
        </div>
      </div>

      {/* White/Dark Rounded Body Scroll Container */}
      <div className={`flex-1 -mt-4 rounded-t-2xl relative z-10 overflow-y-auto pb-24 shadow-inner ${isDarkMode ? "bg-zinc-900" : "bg-white"}`}>
        {/* Stats Row */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-zinc-800 py-3.5 border-b border-gray-100 dark:border-zinc-800 px-4 text-center">
          <div className="space-y-0.5">
            <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">
              {language === "es" ? "Prep." : "Prep Time"}
            </span>
            <span className="text-xs font-extrabold text-gray-800 dark:text-zinc-200 flex items-center justify-center space-x-1">
              <Clock size={11} className="text-gray-400" />
              <span>{recipe.prepTime}</span>
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">
              {language === "es" ? "Calorías" : "Calories"}
            </span>
            <span className="text-xs font-extrabold text-orange-500 flex items-center justify-center space-x-1">
              <Flame size={11} className="text-orange-500" />
              <span>{recipe.calories}</span>
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">
              {language === "es" ? "Dificultad" : "Difficulty"}
            </span>
            <span className="text-xs font-extrabold text-amber-500 flex items-center justify-center space-x-1">
              <Award size={11} className="text-amber-500" />
              <span>{getTranslatedDifficulty(recipe.difficulty)}</span>
            </span>
          </div>
        </div>

        {/* Servings Tuner Card */}
        <div className="mx-4 mt-4 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl flex items-center justify-between border border-gray-100 dark:border-zinc-800/60">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-gray-800 dark:text-zinc-200 text-gray-900 dark:text-white">
              {language === "es" ? "Ajustar Porciones" : "Adjust Portions"}
            </h4>
            <p className="text-[9px] text-gray-400 dark:text-gray-500">
              {language === "es" ? "Escala las cantidades al instante" : "Scale ingredient amounts instantly"}
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-white dark:bg-zinc-800 rounded-full px-2.5 py-1 border border-gray-150/40 dark:border-zinc-700/50">
            <button 
              disabled={servings <= 1}
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="text-gray-400 hover:text-gray-800 dark:hover:text-white disabled:opacity-30 transition-colors"
            >
              <Minus size={13} />
            </button>
            <span className="text-xs font-black w-4 text-center text-gray-800 dark:text-white">{servings}</span>
            <button 
              onClick={() => setServings(servings + 1)}
              className="text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>

        {/* Segmented Tab Control */}
        <div className="px-4 mt-4">
          <div className="bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl flex">
            {(["Ingredients", "Steps", "Info"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-center rounded-lg text-xs font-bold transition-all ${activeTab === tab ? "bg-white dark:bg-zinc-700 text-[#2D6A4F] dark:text-[#52B788] shadow-sm" : "text-gray-500 hover:text-gray-850 dark:hover:text-white"}`}
              >
                {tab === "Ingredients" ? (language === "es" ? "Ingredientes" : "Ingredients") : tab === "Steps" ? (language === "es" ? "Pasos" : "Steps") : tab === "Info" ? "Info" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Contents */}
        <div className="px-5 mt-4">
          {activeTab === "Ingredients" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-850 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {language === "es" ? "Ingredientes" : "Ingredients"} ({recipe.ingredients.length})
                </h3>
                <span className="text-[10px] font-semibold text-[#2D6A4F] dark:text-[#52B788] bg-[#D8F3DC] dark:bg-[#1B4332] px-2 py-0.5 rounded-full">
                  {language === "es" ? `Para ${servings} porciones` : `For ${servings} servings`}
                </span>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-zinc-850">
                {recipe.ingredients.map((ing, i) => {
                  const scaleFactor = servings / 4;
                  let amountDisplay = ing.amount;
                  
                  // Simple auto scale for quantities
                  const numMatch = ing.amount.match(/^([0-9.]+)\s*(.*)$/);
                  if (numMatch) {
                    const val = parseFloat(numMatch[1]) * scaleFactor;
                    // Format beautifully, strip trailing zeros
                    amountDisplay = `${Number(val.toFixed(2))} ${numMatch[2]}`;
                  }
                  
                  return (
                    <div key={i} className="flex items-center justify-between py-2.5">
                      <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-[#2D6A4F] dark:bg-[#52B788] rounded-full" />
                        <span className="text-xs font-medium text-gray-800 dark:text-zinc-200">{ing.name}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800 px-2 py-0.5 rounded-lg border border-gray-100/50 dark:border-zinc-700/50">{amountDisplay}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "Steps" && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-zinc-850 pb-2">
                {language === "es" ? `Instrucciones (${recipe.steps.length} pasos)` : `Instructions (${recipe.steps.length} steps)`}
              </h3>
              <div className="space-y-4">
                {recipe.steps.map((step, i) => (
                  <div key={i} className="flex items-start space-x-3 group">
                    <span className="w-5 h-5 bg-[#D8F3DC] text-[#1B4332] dark:bg-[#1B4332] dark:text-[#D8F3DC] rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      {i + 1}
                    </span>
                    <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Info" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-zinc-850 pb-1.5">
                  {language === "es" ? "Descripción" : "Description"}
                </h4>
                <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">{recipe.description}</p>
              </div>
              {recipe.chefTips && (
                <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-800/40 rounded-xl space-y-1">
                  <div className="flex items-center space-x-1.5 text-amber-600 dark:text-amber-400">
                    <Sparkles size={13} className="shrink-0" />
                    <h4 className="text-xs font-black">
                      {language === "es" ? "Consejo Secreto del Chef" : "Chef's Secret Tip"}
                    </h4>
                  </div>
                  <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed italic">"{recipe.chefTips}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom sticky dual action bar */}
      <div className="absolute bottom-0 inset-x-0 p-4 bg-white/80 dark:bg-zinc-950/85 backdrop-blur-lg border-t border-gray-100 dark:border-zinc-900 flex space-x-3 z-20 shrink-0">
        <button
          onClick={onImportIngredients}
          className="flex-1 py-3 bg-[#D8F3DC] text-[#1B4332] hover:bg-[#2D6A4F] hover:text-white rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 shadow-sm active:scale-95"
        >
          <Plus size={14} />
          <span>
            {language === "es" ? "Importar Ingredientes" : "Import Ingredients"}
          </span>
        </button>
        <button
          onClick={onStartCook}
          className="flex-1 py-3 bg-[#2D6A4F] hover:bg-[#1B4332] text-white rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 shadow-md active:scale-95"
        >
          <ChefHat size={14} className="animate-pulse" />
          <span>
            {language === "es" ? "Modo Paso a Paso" : "Cook Steps Mode"}
          </span>
        </button>
      </div>
    </div>
  );
};
