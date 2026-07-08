import React, { useState } from "react";
import { 
  ChevronLeft, 
  Minus, 
  Plus, 
  Clock, 
  Flame, 
  Award, 
  Sparkle, 
  ChefHat, 
  Info, 
  Heart, 
  Check 
} from "lucide-react";
import { Recipe } from "./DeviceEmulator";
import { useLanguage } from "../lib/LanguageContext";

interface AIRecipeDetailScreenProps {
  recipeId: string;
  recipeTitle: string;
  onClose: () => void;
  onSaveToMyRecipes: (recipe: Recipe) => void;
  onCookNow: (recipe: Recipe) => void;
  isDarkMode: boolean;
}

// 1. Detailed realistic recipe data as requested by the prompt
const AI_RECIPES_DATA: Record<string, Omit<Recipe, "id">> = {
  "mr1": {
    name: "French Toast with Berry Compote",
    description: "Fluffy, classic brioche slices dipped in cinnamon vanilla custard, toasted in golden butter, and crowned with a warm, tangy mixed berry compote.",
    prepTime: "10 min",
    cookTime: "15 min",
    difficulty: "Easy",
    calories: "380 kcal",
    ingredients: [
      { name: "Eggs", amount: "2 pieces" },
      { name: "Milk", amount: "0.5 cup" },
      { name: "Butter", amount: "2 tbsp" },
      { name: "Bread slices", amount: "4 pieces" },
      { name: "Vanilla extract", amount: "1 tsp" },
      { name: "Mixed Berries", amount: "0.5 cup" }
    ],
    steps: [
      "Whisk eggs, milk, and vanilla extract in a wide, shallow bowl until smooth.",
      "Melt butter in a large skillet or non-stick frying pan over medium heat.",
      "Dip each slice of bread in the egg mixture for 5-10 seconds per side until fully saturated but not soggy.",
      "Place bread slices in the skillet and cook 2–3 minutes per side until beautifully golden brown.",
      "Top with warm mixed berries or berry compote and serve immediately."
    ],
    chefTips: "For the absolute best texture, use stale bread or challah sliced thick. It absorbs the custard beautifully without falling apart!"
  },
  "mr2": {
    name: "Scrambled Eggs & Toast",
    description: "Creamy, slowly-scrambled soft eggs cooked with butter, served over rustic toasted artisan sourdough bread.",
    prepTime: "5 min",
    cookTime: "8 min",
    difficulty: "Easy",
    calories: "280 kcal",
    ingredients: [
      { name: "Fresh Eggs", amount: "3 pieces" },
      { name: "Butter", amount: "1 tbsp" },
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Milk", amount: "2 tbsp" }
    ],
    steps: [
      "Whisk eggs, milk, and a tiny pinch of salt in a bowl until pale yellow and bubbly.",
      "Melt butter in a small non-stick pan over medium-low heat. Do not let the butter brown.",
      "Pour in the egg mixture and let it set for 15 seconds. Using a silicone spatula, stir slowly, pulling the curds from the edges.",
      "Remove from heat while the eggs are still slightly wet—they will continue cooking on the hot plate.",
      "Toast your bread slices, heap the fluffy eggs on top, and season with fresh cracked pepper."
    ],
    chefTips: "Low and slow is the secret to rich, diner-style scrambled eggs. Keep the heat gentle and remove the pan from heat just before they look done!"
  },
  "mr3": {
    name: "Butter Pasta with Cheese",
    description: "Quick comforting pasta tossed in velvety garlic-infused melted butter and loaded with savory grated parmesan and soft cheese.",
    prepTime: "5 min",
    cookTime: "15 min",
    difficulty: "Easy",
    calories: "490 kcal",
    ingredients: [
      { name: "Pasta", amount: "200 g" },
      { name: "Butter", amount: "2 tbsp" },
      { name: "Grated Cheese", amount: "0.5 cup" },
      { name: "Parmesan Cheese", amount: "2 tbsp" },
      { name: "Garlic cloves", amount: "2 pieces" }
    ],
    steps: [
      "Bring a large pot of heavily salted water to a rolling boil. Cook pasta according to package directions until al dente.",
      "While pasta cooks, melt butter in a large skillet over medium-low heat. Add finely minced garlic and sauté for 1-2 minutes until fragrant.",
      "Drain the pasta, reserving 1/4 cup of the starchy cooking water.",
      "Toss hot pasta directly into the garlic butter skillet. Add the grated cheese and splash of pasta water, tossing vigorously until a glossy sauce forms.",
      "Serve warm topped with plenty of grated parmesan cheese and black pepper."
    ],
    chefTips: "Reserving pasta water is the ultimate restaurant secret! The starch helps emulsify the melted butter and cheese into a rich, creamy sauce."
  }
};

export const AIRecipeDetailScreen: React.FC<AIRecipeDetailScreenProps> = ({
  recipeId,
  recipeTitle,
  onClose,
  onSaveToMyRecipes,
  onCookNow,
  isDarkMode,
}) => {
  const { language } = useLanguage();

  // 2. Load recipe details (fallback to French Toast if match is missing)
  const resolvedId = AI_RECIPES_DATA[recipeId] ? recipeId : "mr1";
  const rawRecipe = AI_RECIPES_DATA[resolvedId] ? AI_RECIPES_DATA[resolvedId] : AI_RECIPES_DATA["mr1"];

  // Create a copy and translate the content if language === "es"
  const recipeData: Recipe = {
    id: resolvedId,
    name: language === "es" && resolvedId === "mr1" ? "Tostadas Francesas con Compota" :
          language === "es" && resolvedId === "mr2" ? "Huevos Revueltos y Tostadas" :
          language === "es" && resolvedId === "mr3" ? "Pasta a la Mantequilla con Queso" : rawRecipe.name,
    description: language === "es" && resolvedId === "mr1" ? "Slices de brioche clásicos y esponjosos bañados en natilla de vainilla y canela, tostados en mantequilla dorada y coronados con compota tibia de bayas mixtas." :
                 language === "es" && resolvedId === "mr2" ? "Huevos revueltos cremosos cocinados a fuego lento con mantequilla, servidos sobre pan de masa madre artesanal tostado." :
                 language === "es" && resolvedId === "mr3" ? "Pasta rápida y reconfortante salteada en mantequilla derretida con ajo y cargada de queso parmesano rallado y queso suave." : rawRecipe.description,
    prepTime: language === "es" ? rawRecipe.prepTime.replace("min", "min") : rawRecipe.prepTime,
    cookTime: language === "es" ? rawRecipe.cookTime.replace("min", "min") : rawRecipe.cookTime,
    difficulty: rawRecipe.difficulty,
    calories: rawRecipe.calories,
    ingredients: rawRecipe.ingredients.map(ing => {
      let name = ing.name;
      let amount = ing.amount;
      if (language === "es") {
        const trans: Record<string, string> = {
          "Eggs": "Huevos",
          "Milk": "Leche",
          "Butter": "Mantequilla",
          "Bread slices": "Rebanadas de pan",
          "Vanilla extract": "Extracto de vainilla",
          "Mixed Berries": "Bayas mixtas",
          "Fresh Eggs": "Huevos frescos",
          "Pasta": "Pasta",
          "Grated Cheese": "Queso rallado",
          "Parmesan Cheese": "Queso parmesano",
          "Garlic cloves": "Dientes de ajo"
        };
        name = trans[ing.name] || ing.name;
        amount = ing.amount
          .replace("pieces", "piezas")
          .replace("cup", "taza")
          .replace("tbsp", "cda")
          .replace("tsp", "cdta");
      }
      return { name, amount };
    }),
    steps: language === "es" && resolvedId === "mr1" ? [
      "Bate los huevos, la leche y el extracto de vainilla en un tazón amplio y poco profundo hasta que quede suave.",
      "Derrite la mantequilla en una sartén grande a fuego medio.",
      "Sumerge cada rebanada de pan en la mezcla de huevo durante 5-10 segundos por lado hasta que esté bien saturada pero no empapada.",
      "Coloca las rebanadas de pan en la sartén y cocina 2–3 minutos por lado hasta que estén doradas.",
      "Sirve con compota tibia de bayas encima inmediatamente."
    ] : language === "es" && resolvedId === "mr2" ? [
      "Bate los huevos, la leche y una pizca de sal en un tazón hasta que estén espumosos.",
      "Derrite la mantequilla en una sartén antiadherente pequeña a fuego medio-bajo.",
      "Vierte la mezcla de huevos y deja reposar 15 segundos. Con una espátula, revuelve despacio arrastrando los bordes.",
      "Retira del fuego mientras los huevos estén algo húmedos—seguirán cocinándose con el calor residual.",
      "Tuesta tus rebanadas de pan, coloca los huevos encima y sazona con pimienta negra recién molida."
    ] : language === "es" && resolvedId === "mr3" ? [
      "Pon a hervir una olla grande con agua con bastante sal. Cocina la pasta al dente.",
      "Mientras se cocina la pasta, derrite mantequilla en una sartén grande a fuego medio-bajo. Agrega el ajo picado y sofríe 1-2 minutos.",
      "Escurre la pasta, reservando 1/4 de taza del agua de cocción.",
      "Mezcla la pasta caliente en la sartén con mantequilla de ajo. Añade el queso rallado y el chorrito de agua de pasta, removiendo bien.",
      "Sirve caliente cubierto con queso parmesano y pimienta negra."
    ] : rawRecipe.steps,
    chefTips: language === "es" && resolvedId === "mr1" ? "¡Para la mejor textura, usa pan del día anterior rebanado grueso. Absorbe la mezcla perfectamente sin romperse!" :
              language === "es" && resolvedId === "mr2" ? "Fuego bajo y lento es el secreto para unos huevos revueltos cremosos de restaurante. ¡Mantén el calor suave y retira la sartén un poco antes de que parezcan listos!" :
              language === "es" && resolvedId === "mr3" ? "¡Reservar el agua de la pasta es el secreto de los restaurantes! El almidón ayuda a emulsionar la mantequilla y el queso en una salsa cremosa." : rawRecipe.chefTips
  };

  // State variables
  const [servings, setServings] = useState(2);
  const [activeTab, setActiveTab] = useState<"Ingredients" | "Steps" | "Info">("Ingredients");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (isSaved) return;
    setIsSaved(true);
    onSaveToMyRecipes(recipeData);
  };

  const handleCook = () => {
    onCookNow(recipeData);
  };

  return (
    <div className="animate-fade-in flex flex-col h-full bg-[#F2F2F7] dark:bg-zinc-950 overflow-hidden select-none relative">
      
      {/* HERO IMAGE CONTAINER */}
      <div className="relative h-56 bg-gradient-to-b from-[#2D6A4F] to-[#1B4332] flex flex-col justify-end p-5 text-white shrink-0">
        
        {/* Back Button */}
        <div className="absolute top-4 left-4 flex items-center space-x-2 z-10">
          <button
            onClick={onClose}
            className="w-9 h-9 bg-white/95 dark:bg-zinc-900/95 rounded-full flex items-center justify-center text-gray-800 dark:text-white shadow-md active:scale-95 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

        {/* Tags and Title over hero */}
        <div className="relative z-10 space-y-1.5">
          <div className="flex flex-wrap gap-1">
            <span className="text-[9px] bg-white/20 px-2.5 py-0.5 rounded-full font-extrabold backdrop-blur-sm">⏱ {recipeData.prepTime}</span>
            <span className="text-[9px] bg-white/20 px-2.5 py-0.5 rounded-full font-extrabold backdrop-blur-sm">👥 {servings} {language === "es" ? "porciones" : "servings"}</span>
            <span className="text-[9px] bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full font-extrabold flex items-center space-x-1">
              <Sparkle size={8} className="fill-amber-950" />
              <span>
                {language === "es" ? "Generada por IA" : "AI Generated"}
              </span>
            </span>
          </div>
          <h1 className="text-base font-black leading-tight text-white line-clamp-2">{recipeData.name}</h1>
          <p className="text-[9px] text-[#D8F3DC] font-extrabold tracking-wide uppercase">
            {language === "es" ? "Laboratorios Culinarios FreshCart" : "FreshCart Culinary Labs"}
          </p>
        </div>
      </div>

      {/* BODY CONTENT SCROLL CONTAINER */}
      <div className={`flex-1 -mt-4 rounded-t-2xl relative z-10 overflow-y-auto pb-40 shadow-inner ${isDarkMode ? "bg-zinc-900" : "bg-white"}`}>
        
        {/* AI DISCLAIMER BANNER (First element inside content area) */}
        <div className="bg-[#FFF3CD] dark:bg-amber-950/20 border-b border-[#FFD700] dark:border-amber-800/40 p-3.5 flex items-start space-x-2.5">
          <Sparkle size={16} className="text-[#FF9500] shrink-0 mt-0.5 animate-pulse fill-[#FF9500]" />
          <div className="flex-1">
            <p className="text-xs font-bold text-[#856404] dark:text-amber-400 leading-relaxed">
              {language === "es" 
                ? "Generada por IA — revise los ingredientes e instrucciones antes de cocinar."
                : "Generated by AI — review ingredients & instructions before cooking."}
            </p>
          </div>
          <Info size={14} className="text-[#856404] dark:text-amber-500 shrink-0 mt-0.5" />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-zinc-800 py-3.5 border-b border-gray-100 dark:border-zinc-800 px-4 text-center">
          <div className="space-y-0.5">
            <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">
              {language === "es" ? "Prep." : "Prep Time"}
            </span>
            <span className="text-xs font-black text-gray-800 dark:text-zinc-200 flex items-center justify-center space-x-1">
              <Clock size={11} className="text-gray-400" />
              <span>{recipeData.prepTime}</span>
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">
              {language === "es" ? "Calorías" : "Calories"}
            </span>
            <span className="text-xs font-black text-orange-500 flex items-center justify-center space-x-1">
              <Flame size={11} className="text-orange-500" />
              <span>{recipeData.calories}</span>
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">
              {language === "es" ? "Dificultad" : "Difficulty"}
            </span>
            <span className="text-xs font-black text-amber-500 flex items-center justify-center space-x-1">
              <Award size={11} className="text-amber-500" />
              <span>{recipeData.difficulty === "Easy" && language === "es" ? "Fácil" : recipeData.difficulty}</span>
            </span>
          </div>
        </div>

        {/* Portions Scale Tuner */}
        <div className="mx-4 mt-4 p-3 bg-gray-50 dark:bg-zinc-850/40 rounded-xl flex items-center justify-between border border-gray-100 dark:border-zinc-800/60">
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-gray-800 dark:text-zinc-200">
              {language === "es" ? "Ajustar Porciones" : "Adjust Portions"}
            </h4>
            <p className="text-[9px] text-gray-400 dark:text-gray-500 font-semibold">
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

        {/* Tab Selection */}
        <div className="px-4 mt-4">
          <div className="bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl flex">
            {(["Ingredients", "Steps", "Info"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-center rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab 
                    ? "bg-white dark:bg-zinc-700 text-[#2D6A4F] dark:text-[#52B788] shadow-sm" 
                    : "text-gray-500 hover:text-gray-850 dark:hover:text-white"
                }`}
              >
                {tab === "Ingredients" ? (language === "es" ? "Ingredientes" : "Ingredients") : tab === "Steps" ? (language === "es" ? "Instrucciones" : "Steps") : tab === "Info" ? "Info" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Contents */}
        <div className="px-5 mt-4">
          
          {/* INGREDIENTS TAB */}
          {activeTab === "Ingredients" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {language === "es" ? "Ingredientes" : "Ingredients"} ({recipeData.ingredients.length})
                </h3>
                <span className="text-[10px] font-semibold text-[#2D6A4F] dark:text-[#52B788] bg-[#D8F3DC] dark:bg-[#1B4332] px-2 py-0.5 rounded-full">
                  {language === "es" ? `Para ${servings} porciones` : `For ${servings} portions`}
                </span>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-zinc-800/40">
                {recipeData.ingredients.map((ing, i) => {
                  const scaleFactor = servings / 2; // base recipes are written for 2 servings
                  let amountDisplay = ing.amount;
                  
                  // Scale logic: extract numerical value, multiply, format beautifully
                  const numMatch = ing.amount.match(/^([0-9.]+)\s*(.*)$/);
                  if (numMatch) {
                    const val = parseFloat(numMatch[1]) * scaleFactor;
                    amountDisplay = `${Number(val.toFixed(2))} ${numMatch[2]}`;
                  }
                  
                  return (
                    <div key={i} className="flex items-center justify-between py-2.5">
                      <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-[#2D6A4F] dark:bg-[#52B788] rounded-full" />
                        <span className="text-xs font-semibold text-gray-800 dark:text-zinc-200">{ing.name}</span>
                      </div>
                      <span className="text-xs font-black text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800 px-2 py-0.5 rounded-lg border border-gray-150/20 dark:border-zinc-700/50">
                        {amountDisplay}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEPS TAB */}
          {activeTab === "Steps" && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-zinc-800 pb-2">
                {language === "es" ? "Instrucciones de Cocción" : "Cooking Instructions"}
              </h3>
              <div className="space-y-4">
                {recipeData.steps.map((step, i) => (
                  <div key={i} className="flex items-start space-x-3 group">
                    <span className="w-5 h-5 bg-[#D8F3DC] text-[#1B4332] dark:bg-[#1B4332] dark:text-[#D8F3DC] rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INFO TAB */}
          {activeTab === "Info" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-zinc-800 pb-1.5">
                  {language === "es" ? "Historia de la Receta" : "Recipe Story"}
                </h4>
                <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">{recipeData.description}</p>
              </div>
              {recipeData.chefTips && (
                <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-800/40 rounded-xl space-y-1">
                  <div className="flex items-center space-x-1.5 text-amber-600 dark:text-amber-400">
                    <ChefHat size={14} className="shrink-0" />
                    <h4 className="text-xs font-black">
                      {language === "es" ? "Consejo Secreto del Chef IA" : "AI Chef Secret Tip"}
                    </h4>
                  </div>
                  <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed italic">"{recipeData.chefTips}"</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* TWO STACKED STICKY CTA BUTTONS */}
      <div className={`absolute bottom-0 inset-x-0 p-4 border-t backdrop-blur-md flex flex-col space-y-2.5 z-20 ${isDarkMode ? "bg-zinc-950/85 border-zinc-900" : "bg-white/85 border-gray-150"}`}>
        {/* PRIMARY: Save to My Recipes */}
        <button
          onClick={handleSave}
          disabled={isSaved}
          className={`w-full py-3.5 rounded-2xl text-xs font-black flex items-center justify-center space-x-2 shadow-md transition-all active:scale-95 ${
            isSaved 
              ? "bg-gray-150 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 cursor-not-allowed shadow-none" 
              : "bg-[#2D6A4F] hover:bg-[#1B4332] text-white"
          }`}
        >
          {isSaved ? (
            <>
              <Check size={14} strokeWidth={3} />
              <span>
                {language === "es" ? "Guardada en Mis Recetas ✓" : "Saved to My Recipes ✓"}
              </span>
            </>
          ) : (
            <>
              <Heart size={14} />
              <span>
                {language === "es" ? "Guardar en Mis Recetas ❤️" : "Save to My Recipes ❤️"}
              </span>
            </>
          )}
        </button>

        {/* SECONDARY: Cook Now */}
        <button
          onClick={handleCook}
          className={`w-full py-2.5 bg-gray-50 dark:bg-zinc-900 text-[#2D6A4F] dark:text-[#52B788] border border-gray-200 dark:border-zinc-800 hover:bg-gray-100 rounded-xl text-[11px] font-black transition-all flex items-center justify-center space-x-1.5 active:scale-95`}
        >
          <ChefHat size={13} />
          <span>
            {language === "es" ? "Cocinar Ahora 🍳" : "Cook Now 🍳"}
          </span>
        </button>
      </div>

    </div>
  );
};
