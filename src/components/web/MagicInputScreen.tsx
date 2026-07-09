import React, { useState } from "react";
import { 
  Plus, 
  X, 
  DollarSign, 
  Users, 
  Salad, 
  Clock, 
  Sparkles, 
  ChefHat 
} from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";

interface MagicInputScreenProps {
  pantryItems: any[];
  onFindRecipes: (params: {
    ingredients: string[];
    budget: string;
    servings: string;
    diet: string;
    time: string;
  }) => void;
  isDarkMode: boolean;
}

export const MagicInputScreen: React.FC<MagicInputScreenProps> = ({
  pantryItems,
  onFindRecipes,
  isDarkMode,
}) => {
  const { language } = useLanguage();

  // State variables
  const [ingredients, setIngredients] = useState<string[]>(() => {
    return language === "es"
      ? ["🥚 Huevos", "🧈 Mantequilla", "🍞 Pan", "🥛 Leche"]
      : ["🥚 Eggs", "🧈 Butter", "🍞 Bread", "🥛 Milk"];
  });
  const [newIngredient, setNewIngredient] = useState("");
  const [budget, setBudget] = useState("");
  const [servings, setServings] = useState<"1" | "2" | "4" | "6+">("2");
  const [diet, setDiet] = useState("None");
  const [time, setTime] = useState("Any");

  // Load from pantry handler
  const handleLoadFromPantry = () => {
    // Collect unique pantry item names with custom emojis
    const defaultEmojis: Record<string, string> = {
      egg: "🥚", huevo: "🥚", butter: "🧈", mantequilla: "🧈", bread: "🍞", pan: "🍞", milk: "🥛", leche: "🥛", cheese: "🧀", queso: "🧀",
      oil: "🫗", aceite: "🫗", garlic: "🧄", ajo: "🧄", onion: "🧅", cebolla: "🧅", pasta: "🍝", chicken: "🍗", pollo: "🍗",
      salmon: "🐟", spinach: "🥬", espinaca: "🥬", avocado: "🥑", aguacate: "🥑", tomato: "🍅", tomate: "🍅", apple: "🍎", manzana: "🍎",
      banana: "🍌", lemon: "🍋", limón: "🍋", salt: "🧂", sal: "🧂", pepper: "🌶️", pimienta: "🌶️", beef: "🥩", res: "🥩",
    };

    const addedFromPantry: string[] = [];
    pantryItems.forEach(item => {
      const lowerName = item.name.toLowerCase();
      let emoji = "🥗"; // default
      for (const [key, val] of Object.entries(defaultEmojis)) {
        if (lowerName.includes(key)) {
          emoji = val;
          break;
        }
      }
      const chipText = `${emoji} ${item.name}`;
      if (!ingredients.includes(chipText)) {
        addedFromPantry.push(chipText);
      }
    });

    if (addedFromPantry.length > 0) {
      setIngredients(prev => [...prev, ...addedFromPantry]);
    } else {
      // If pantry has no custom items, load cheese or avocado as fallbacks
      const fallback = language === "es"
        ? ["🧀 Queso", "🥬 Espinaca", "🥑 Aguacate"]
        : ["🧀 Cheese", "🥬 Spinach", "🥑 Avocado"];
      setIngredients(prev => {
        const next = [...prev];
        fallback.forEach(f => {
          if (!next.includes(f)) next.push(f);
        });
        return next;
      });
    }
  };

  // Add ingredient manually
  const handleAddIngredient = () => {
    if (!newIngredient.trim()) return;
    
    // Trim and add random emoji if none exists
    const trimmed = newIngredient.trim();
    const hasEmoji = /\p{Emoji}/u.test(trimmed);
    const itemText = hasEmoji ? trimmed : `🥗 ${trimmed}`;

    if (!ingredients.includes(itemText)) {
      setIngredients(prev => [...prev, itemText]);
    }
    setNewIngredient("");
  };

  // Remove ingredient chip
  const handleRemoveIngredient = (itemToRemove: string) => {
    setIngredients(prev => prev.filter(item => item !== itemToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddIngredient();
    }
  };

  const handleSubmit = () => {
    if (ingredients.length === 0) return;
    onFindRecipes({
      ingredients,
      budget,
      servings,
      diet,
      time,
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7] dark:bg-zinc-950 text-gray-900 dark:text-gray-150 relative">
      {/* CUSTOM HEADER */}
      <div className={`px-4 py-4 border-b flex flex-col shrink-0 ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-150"}`}>
        <div className="flex items-center space-x-1.5">
          <Sparkles size={18} className="text-[#2D6A4F] animate-pulse" />
          <h1 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
            {language === "es" ? "✨ Receta Mágica" : "✨ Magic Recipe"}
          </h1>
        </div>
        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
          {language === "es" ? "Encuentra recetas con lo que tienes" : "Find recipes with what you have"}
        </p>
      </div>

      {/* CONTENT SCROLLVIEW */}
      <div className="flex-1 overflow-y-auto pb-28">
        
        {/* INGREDIENTS CARD */}
        <div className={`mx-4 mt-4 p-4 rounded-2xl shadow-sm border ${isDarkMode ? "bg-zinc-900 border-zinc-800/40" : "bg-white border-white/50"}`}>
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800/60 pb-2.5">
            <h3 className="text-xs font-black text-gray-800 dark:text-zinc-200">
              {language === "es" ? "Tus Ingredientes" : "Your Ingredients"}
            </h3>
            <button
              onClick={handleLoadFromPantry}
              className="text-[10px] font-bold text-[#2D6A4F] dark:text-[#52B788] bg-[#D8F3DC]/60 dark:bg-[#1B4332]/40 px-2.5 py-1 rounded-full hover:bg-[#2D6A4F] hover:text-white transition-all active:scale-95"
            >
              {language === "es" ? "De la Alacena +" : "From Pantry +"}
            </button>
          </div>

          {/* CHIPS AREA */}
          <div className="flex flex-wrap gap-2 mt-3 min-h-[50px] items-center">
            {ingredients.length === 0 ? (
              <p className="text-[10px] text-gray-400 italic">
                {language === "es" 
                  ? "Aún no hay ingredientes agregados. ¡Agrega manualmente o importa de tu alacena!"
                  : "No ingredients added yet. Add manually or import from your pantry!"}
              </p>
            ) : (
              ingredients.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#D8F3DC] dark:bg-[#1B4332] text-[#1B4332] dark:text-[#D8F3DC] rounded-full px-3 py-1.5 flex items-center space-x-1.5 text-[11px] font-bold shadow-sm transition-all"
                >
                  <span>{item}</span>
                  <button
                    onClick={() => handleRemoveIngredient(item)}
                    className="text-[#2D6A4F] dark:text-[#52B788] hover:text-red-500 hover:scale-110 transition-colors p-0.5"
                    title={language === "es" ? "Eliminar elemento" : "Remove element"}
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* ADD INPUT ROW */}
          <div className="flex items-center space-x-2 mt-4">
            <input
              type="text"
              value={newIngredient}
              onChange={e => setNewIngredient(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={language === "es" ? "+ Agregar ingrediente..." : "+ Add ingredient..."}
              className="flex-1 bg-[#F2F2F7] dark:bg-zinc-800 border-0 outline-none rounded-xl px-3.5 h-11 text-xs font-medium focus:ring-1 focus:ring-[#2D6A4F] dark:text-white"
            />
            <button
              onClick={handleAddIngredient}
              className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-extrabold text-xs h-11 px-5 rounded-xl transition-all active:scale-95 flex items-center justify-center shadow-sm"
            >
              {language === "es" ? "Agregar" : "Add"}
            </button>
          </div>
        </div>

        {/* FILTERS CARD */}
        <div className={`mx-4 mt-4 p-4 rounded-2xl shadow-sm border ${isDarkMode ? "bg-zinc-900 border-zinc-800/40" : "bg-white border-white/50"}`}>
          <h3 className="text-xs font-black text-gray-800 dark:text-zinc-200 border-b border-gray-100 dark:border-zinc-800/60 pb-2.5 mb-4">
            {language === "es" ? "Preferencias" : "Preferences"}
          </h3>

          {/* Budget row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-gray-500 dark:text-zinc-400">
              <DollarSign size={18} />
              <span className="text-xs font-semibold">
                {language === "es" ? "Presupuesto (opcional)" : "Budget (optional)"}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">$</span>
              <input
                type="text"
                pattern="[0-9]*"
                inputMode="decimal"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                placeholder="15.00"
                className="w-20 bg-[#F2F2F7] dark:bg-zinc-800 border-0 outline-none rounded-xl pl-6 pr-2.5 h-9 text-xs font-black text-right dark:text-white"
              />
            </div>
          </div>

          {/* Servings row */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 text-gray-500 dark:text-zinc-400 mb-2">
              <Users size={18} />
              <span className="text-xs font-semibold">
                {language === "es" ? "Porciones" : "Servings"}
              </span>
            </div>
            <div className="flex space-x-2 justify-end">
              {(["1", "2", "4", "6+"] as const).map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setServings(option)}
                  className={`w-10 h-10 rounded-xl text-xs font-black flex items-center justify-center transition-all border ${
                    servings === option
                      ? "bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-sm scale-105"
                      : "bg-[#F2F2F7] dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-transparent hover:bg-gray-200"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary options row */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 text-gray-500 dark:text-zinc-400 mb-2">
              <Salad size={18} />
              <span className="text-xs font-semibold">
                {language === "es" ? "Restricciones Alimenticias" : "Dietary Restrictions"}
              </span>
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-1.5 scrollbar-thin">
              {["None", "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free"].map(option => {
                const labelMap: Record<string, string> = {
                  "None": language === "es" ? "Ninguna" : "None",
                  "Vegetarian": language === "es" ? "Vegetariana" : "Vegetarian",
                  "Vegan": language === "es" ? "Vegana" : "Vegan",
                  "Gluten-Free": language === "es" ? "Sin Gluten" : "Gluten-Free",
                  "Dairy-Free": language === "es" ? "Sin Lácteos" : "Dairy-Free",
                };
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setDiet(option)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border ${
                      diet === option
                        ? "bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-sm"
                        : "bg-[#F2F2F7] dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-transparent hover:bg-gray-200"
                    }`}
                  >
                    {labelMap[option] || option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Limit row */}
          <div>
            <div className="flex items-center space-x-2 text-gray-500 dark:text-zinc-400 mb-2">
              <Clock size={18} />
              <span className="text-xs font-semibold">
                {language === "es" ? "Tiempo de cocción máx." : "Max cooking time"}
              </span>
            </div>
            <div className="flex space-x-2">
              {["Any", "Quick (<30m)", "Medium (<1h)"].map(option => {
                const labelMap: Record<string, string> = {
                  "Any": language === "es" ? "Cualquiera" : "Any",
                  "Quick (<30m)": language === "es" ? "Rápido (<30m)" : "Quick (<30m)",
                  "Medium (<1h)": language === "es" ? "Medio (<1h)" : "Medium (<1h)",
                };
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setTime(option)}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                      time === option
                        ? "bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-sm"
                        : "bg-[#F2F2F7] dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-transparent hover:bg-gray-200"
                    }`}
                  >
                    {labelMap[option] || option}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* INGREDIENT COUNT BAR */}
        <div className="px-6 mt-4 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            {ingredients.length}{" "}
            {ingredients.length === 1
              ? (language === "es" ? "ingrediente agregado" : "ingredient added")
              : (language === "es" ? "ingredientes agregados" : "ingredients added")}
          </p>
        </div>
      </div>

      {/* STICKY BOTTOM ACTIONS */}
      <div className={`absolute bottom-0 inset-x-0 p-4 border-t backdrop-blur-md flex items-center justify-center z-20 ${isDarkMode ? "bg-zinc-950/80 border-zinc-900" : "bg-white/80 border-gray-150"}`}>
        <button
          onClick={handleSubmit}
          disabled={ingredients.length === 0}
          className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-95 ${
            ingredients.length === 0
              ? "bg-gray-300 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed opacity-50 shadow-none"
              : "bg-[#2D6A4F] hover:bg-[#1B4332] text-white hover:shadow-xl hover:shadow-[#2D6A4F]/10"
          }`}
        >
          <ChefHat size={16} />
          <span>
            {language === "es" ? "Buscar Recetas ✨" : "Find Recipes ✨"}
          </span>
        </button>
      </div>
    </div>
  );
};
