import React, { useState } from "react";
import { ChevronLeft, Plus, Trash2, Sparkles, Save, X } from "lucide-react";
import { Recipe } from "../DeviceEmulator";
import { useLanguage } from "../../lib/LanguageContext";

interface EditRecipeScreenProps {
  recipe: Recipe;
  onCancel: () => void;
  onSave: (updated: Recipe) => void;
  isDarkMode: boolean;
}

export const EditRecipeScreen: React.FC<EditRecipeScreenProps> = ({
  recipe,
  onCancel,
  onSave,
  isDarkMode,
}) => {
  const { language } = useLanguage();
  const [name, setName] = useState(recipe.name);
  const [description, setDescription] = useState(recipe.description);
  const [prepTime, setPrepTime] = useState(recipe.prepTime);
  const [cookTime, setCookTime] = useState(recipe.cookTime);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(recipe.difficulty);
  const [calories, setCalories] = useState(recipe.calories);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [steps, setSteps] = useState(recipe.steps);
  const [chefTips, setChefTips] = useState(recipe.chefTips || "");
  const [isAiPolishing, setIsAiPolishing] = useState(false);

  // Ingredient handlers
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "" }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, field: "name" | "amount", value: string) => {
    setIngredients(
      ingredients.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
    );
  };

  // Step handlers
  const handleAddStep = () => {
    setSteps([...steps, ""]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleStepChange = (index: number, value: string) => {
    setSteps(steps.map((step, i) => (i === index ? value : step)));
  };

  // Ask AI Helper
  const handleAiPolish = () => {
    setIsAiPolishing(true);
    setTimeout(() => {
      setName(prev => (prev.startsWith("✨") ? prev : `✨ ${language === "es" ? "Mejorado" : "Enhanced"} ${prev}`));
      setDescription(
        prev =>
          `${prev}${language === "es" ? " Cuidadosamente diseñado con densidades de nutrientes equilibradas y proteínas de liberación lenta para una energía duradera." : " Carefully crafted with balanced nutrient densities and slow-release proteins for lasting kitchen energy."}`
      );
      setChefTips(
        prev =>
          prev || (language === "es" 
            ? "Para un acabado gourmet excepcional, añade una cucharadita de mantequilla orgánica fría o aceite de coco a la sartén durante los últimos 30 segundos."
            : "For an exceptional gourmet finish, fold a teaspoon of cold organic butter or coconut oil into the pan during the final 30 seconds.")
      );
      setIsAiPolishing(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...recipe,
      name: name.trim(),
      description: description.trim(),
      prepTime: prepTime.trim() || (language === "es" ? "10 min" : "10 mins"),
      cookTime: cookTime.trim() || (language === "es" ? "10 min" : "10 mins"),
      difficulty,
      calories: calories.trim() || "300 kcal",
      ingredients: ingredients.filter(ing => ing.name.trim()),
      steps: steps.filter(step => step.trim()),
      chefTips: chefTips.trim(),
    });
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="animate-fade-in flex flex-col h-full bg-[#F2F2F7] dark:bg-zinc-950 overflow-hidden select-none"
    >
      {/* Custom Header */}
      <div className={`px-4 py-3.5 border-b shrink-0 flex items-center justify-between ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-150"}`}>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          <ChevronLeft size={16} className="mr-0.5" />
          <span>{language === "es" ? "Cancelar" : "Cancel"}</span>
        </button>
        <h2 className="text-xs font-black uppercase tracking-wider text-center flex-1 text-gray-900 dark:text-white">
          {language === "es" ? "Editar Receta" : "Edit Recipe"}
        </h2>
        <button
          type="button"
          onClick={handleAiPolish}
          className="flex items-center space-x-1 text-xs font-extrabold text-[#2D6A4F] dark:text-[#52B788] hover:opacity-85"
        >
          <Sparkles size={13} className={isAiPolishing ? "animate-spin" : ""} />
          <span>{isAiPolishing ? (language === "es" ? "Puliendo..." : "Polishing...") : (language === "es" ? "Asistencia IA" : "AI Assist")}</span>
        </button>
      </div>

      {/* Main Form Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {/* Basic Details */}
        <div className={`p-4 rounded-xl space-y-3 shadow-sm ${isDarkMode ? "bg-zinc-900" : "bg-white"}`}>
          <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-[#2D6A4F] dark:text-[#52B788]">
            {language === "es" ? "Detalles de la Receta" : "Recipe Basics"}
          </h3>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 block uppercase">
              {language === "es" ? "Título de la Receta" : "Recipe Title"}
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200/50 dark:border-zinc-700/60 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-[#2D6A4F] text-gray-900 dark:text-white"
              placeholder={language === "es" ? "ej. Salmón con Mantequilla de Ajo" : "e.g. Garlic Butter Salmon"}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 block uppercase">
              {language === "es" ? "Descripción" : "Description"}
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200/50 dark:border-zinc-700/60 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-[#2D6A4F] resize-none text-gray-900 dark:text-white"
              placeholder={language === "es" ? "Describe brevemente este plato..." : "Briefly describe this dish..."}
            />
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 block uppercase">
                {language === "es" ? "Tiempo de Prep." : "Prep Time"}
              </label>
              <input
                type="text"
                value={prepTime}
                onChange={e => setPrepTime(e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200/50 dark:border-zinc-700/60 rounded-lg p-2.5 text-xs font-semibold focus:outline-none text-gray-900 dark:text-white"
                placeholder={language === "es" ? "ej. 15 min" : "e.g. 15 mins"}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 block uppercase">
                {language === "es" ? "Tiempo de Cocción" : "Cook Time"}
              </label>
              <input
                type="text"
                value={cookTime}
                onChange={e => setCookTime(e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200/50 dark:border-zinc-700/60 rounded-lg p-2.5 text-xs font-semibold focus:outline-none text-gray-900 dark:text-white"
                placeholder={language === "es" ? "ej. 20 min" : "e.g. 20 mins"}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 block uppercase">
                {language === "es" ? "Calorías" : "Calories"}
              </label>
              <input
                type="text"
                value={calories}
                onChange={e => setCalories(e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200/50 dark:border-zinc-700/60 rounded-lg p-2.5 text-xs font-semibold focus:outline-none text-gray-900 dark:text-white"
                placeholder={language === "es" ? "ej. 420 kcal" : "e.g. 420 kcal"}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 block uppercase">
                {language === "es" ? "Dificultad" : "Difficulty"}
              </label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as any)}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200/50 dark:border-zinc-700/60 rounded-lg p-2.5 text-xs font-semibold focus:outline-none text-gray-900 dark:text-white"
              >
                <option value="Easy">{language === "es" ? "Fácil" : "Easy"}</option>
                <option value="Medium">{language === "es" ? "Medio" : "Medium"}</option>
                <option value="Hard">{language === "es" ? "Difícil" : "Hard"}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Ingredients Section */}
        <div className={`p-4 rounded-xl space-y-3 shadow-sm ${isDarkMode ? "bg-zinc-900" : "bg-white"}`}>
          <div className="flex items-center justify-between border-b border-gray-50 dark:border-zinc-800 pb-2">
            <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-[#2D6A4F] dark:text-[#52B788]">
              {language === "es" ? "Ingredientes" : "Ingredients"} ({ingredients.length})
            </h3>
            <button
              type="button"
              onClick={handleAddIngredient}
              className="flex items-center space-x-1 text-[10px] font-bold bg-[#D8F3DC] text-[#1B4332] px-2 py-1 rounded-full hover:bg-[#2D6A4F] hover:text-white transition-colors"
            >
              <Plus size={11} />
              <span>{language === "es" ? "Añadir" : "Add"}</span>
            </button>
          </div>

          <div className="space-y-2">
            {ingredients.map((ing, index) => (
              <div key={index} className="flex items-center space-x-2 animate-fade-in">
                <input
                  type="text"
                  value={ing.name}
                  onChange={e => handleIngredientChange(index, "name", e.target.value)}
                  placeholder={language === "es" ? "Nombre de ingrediente" : "Ingredient name"}
                  className="flex-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200/50 dark:border-zinc-700/60 rounded-lg p-2 text-xs font-semibold focus:outline-none text-gray-900 dark:text-white"
                  required
                />
                <input
                  type="text"
                  value={ing.amount}
                  onChange={e => handleIngredientChange(index, "amount", e.target.value)}
                  placeholder={language === "es" ? "Cantidad" : "Amount"}
                  className="flex-1 bg-gray-50 dark:bg-zinc-800 border border-gray-200/50 dark:border-zinc-700/60 rounded-lg p-2 text-xs font-bold text-center focus:outline-none text-gray-900 dark:text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                  className="text-red-400 hover:text-red-600 p-1 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Steps Section */}
        <div className={`p-4 rounded-xl space-y-3 shadow-sm ${isDarkMode ? "bg-zinc-900" : "bg-white"}`}>
          <div className="flex items-center justify-between border-b border-gray-50 dark:border-zinc-800 pb-2">
            <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-[#2D6A4F] dark:text-[#52B788]">
              {language === "es" ? "Pasos de Preparación" : "Preparation Steps"} ({steps.length})
            </h3>
            <button
              type="button"
              onClick={handleAddStep}
              className="flex items-center space-x-1 text-[10px] font-bold bg-[#D8F3DC] text-[#1B4332] px-2 py-1 rounded-full hover:bg-[#2D6A4F] hover:text-white transition-colors"
            >
              <Plus size={11} />
              <span>{language === "es" ? "Añadir Paso" : "Add Step"}</span>
            </button>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-2 animate-fade-in">
                <span className="w-5 h-5 mt-1 bg-gray-100 dark:bg-zinc-800 text-gray-500 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                  {index + 1}
                </span>
                <textarea
                  value={step}
                  onChange={e => handleStepChange(index, e.target.value)}
                  placeholder={language === "es" ? `Instrucción del paso ${index + 1}...` : `Step ${index + 1} instruction...`}
                  rows={2}
                  className="flex-1 bg-gray-50 dark:bg-zinc-800 border border-gray-200/50 dark:border-zinc-700/60 rounded-lg p-2 text-xs font-medium focus:outline-none resize-none text-gray-900 dark:text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveStep(index)}
                  className="text-red-400 hover:text-red-600 p-1 mt-1 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Chef Tips Section */}
        <div className={`p-4 rounded-xl space-y-3 shadow-sm ${isDarkMode ? "bg-zinc-900" : "bg-white"}`}>
          <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500">
            {language === "es" ? "Consejos del Chef" : "Chef Tips"}
          </h3>
          <textarea
            value={chefTips}
            onChange={e => setChefTips(e.target.value)}
            rows={2}
            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200/50 dark:border-zinc-700/60 rounded-lg p-2.5 text-xs font-medium focus:outline-none resize-none text-gray-900 dark:text-white"
            placeholder={language === "es" ? "Agrega un consejo profesional para preparar este plato..." : "Add a pro-tip for preparing this dish..."}
          />
        </div>
      </div>

      {/* Save Sticky Footer */}
      <div className={`absolute bottom-0 inset-x-0 p-4 border-t backdrop-blur-lg flex space-x-3 z-20 shrink-0 ${isDarkMode ? "bg-zinc-950/80 border-zinc-900" : "bg-white/80 border-gray-150"}`}>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-750 transition-all active:scale-95"
        >
          {language === "es" ? "Cancelar" : "Cancel"}
        </button>
        <button
          type="submit"
          className="flex-1 py-3 bg-[#2D6A4F] text-white font-bold text-xs rounded-xl hover:bg-[#1B4332] transition-all flex items-center justify-center space-x-1.5 shadow-md active:scale-95"
        >
          <Save size={14} />
          <span>{language === "es" ? "Guardar Cambios" : "Save Changes"}</span>
        </button>
      </div>
    </form>
  );
};
