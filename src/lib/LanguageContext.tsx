import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "es";

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    es: string;
  };
}

export const TRANSLATIONS: TranslationDictionary = {
  // Tabs
  "tab.home": { en: "Home", es: "Inicio" },
  "tab.supermarket": { en: "Supermarket", es: "Lista" },
  "tab.recipes": { en: "Recipes", es: "Recetas" },
  "tab.magic": { en: "AI Chef", es: "Chef IA" },
  "tab.pantry": { en: "Pantry", es: "Despensa" },
  "tab.profile": { en: "Profile", es: "Perfil" },

  // Home Screen
  "home.welcome": { en: "Welcome back!", es: "¡Bienvenido/a de vuelta!" },
  "home.limit": { en: "Spend Limit", es: "Límite de Gasto" },
  "home.spent": { en: "Spent", es: "Gastado" },
  "home.history": { en: "Shopping History", es: "Historial de Compras" },
  "home.days": { en: "Days", es: "Días" },
  "home.items": { en: "items", es: "artículos" },
  "home.noHistory": { en: "No purchase history yet.", es: "Aún no hay historial de compras." },
  "home.budgetSuccess": { en: "You're within budget!", es: "¡Estás dentro del presupuesto!" },
  "home.budgetWarning": { en: "Close to budget limit!", es: "¡Cerca del límite de presupuesto!" },
  "home.quickStats": { en: "Quick Stats", es: "Estadísticas" },
  "home.weeklySpend": { en: "Weekly Spend", es: "Gasto Semanal" },
  "home.savedRecipes": { en: "Saved Recipes", es: "Recetas Guardadas" },

  // Supermarket Screen
  "supermarket.title": { en: "My List", es: "Mi Lista" },
  "supermarket.search": { en: "Search items...", es: "Buscar artículos..." },
  "supermarket.store": { en: "Store", es: "Tienda" },
  "supermarket.all": { en: "All", es: "Todo" },
  "supermarket.categories": { en: "Categories", es: "Categorías" },
  "supermarket.total": { en: "Total", es: "Total" },
  "supermarket.checkout": { en: "Checkout", es: "Pagar / Finalizar" },
  "supermarket.empty": { en: "Your list is empty", es: "Tu lista está vacía" },
  "supermarket.addItem": { en: "Add Item", es: "Agregar Artículo" },
  "supermarket.clear": { en: "Clear List", es: "Vaciar Lista" },

  // Pantry Screen
  "pantry.title": { en: "Smart Pantry", es: "Despensa Inteligente" },
  "pantry.search": { en: "Search pantry...", es: "Buscar en despensa..." },
  "pantry.expiryAlert": { en: "Expiry Alert", es: "Alerta de Vencimiento" },
  "pantry.days": { en: "days", es: "días" },
  "pantry.expired": { en: "EXPIRED", es: "VENCIDO" },
  "pantry.expires": { en: "expires", es: "vence" },
  "pantry.addPantry": { en: "Add pantry item", es: "Agregar a Despensa" },
  "pantry.empty": { en: "Pantry is empty", es: "La despensa está vacía" },

  // Recipes Screen
  "recipes.title": { en: "Popular Recipes", es: "Recetas Populares" },
  "recipes.search": { en: "Search recipes...", es: "Buscar recetas..." },
  "recipes.cookNow": { en: "Cook now", es: "Cocinar ahora" },
  "recipes.addRecipe": { en: "Add Recipe", es: "Nueva Receta" },
  "recipes.editRecipe": { en: "Edit Recipe", es: "Editar Receta" },
  "recipes.servings": { en: "Servings", es: "Porciones" },
  "recipes.difficulty": { en: "Difficulty", es: "Dificultad" },
  "recipes.prepTime": { en: "Prep Time", es: "Tiempo de Prep." },
  "recipes.cookTime": { en: "Cook Time", es: "Tiempo de Cocción" },

  // Profile Screen
  "profile.title": { en: "Account Details", es: "Detalles de la Cuenta" },
  "profile.settings": { en: "Settings", es: "Configuración" },
  "profile.logout": { en: "Logout", es: "Cerrar Sesión" },
  "profile.login": { en: "Login", es: "Iniciar Sesión" },
  "profile.register": { en: "Register", es: "Registrarse" },

  // Settings Screen
  "settings.title": { en: "Settings", es: "Configuración" },
  "settings.back": { en: "Back", es: "Atrás" },
  "settings.account": { en: "Account", es: "Cuenta" },
  "settings.name": { en: "Name", es: "Nombre" },
  "settings.email": { en: "Email", es: "Correo" },
  "settings.password": { en: "Change Password", es: "Cambiar Contraseña" },
  "settings.preferences": { en: "Preferences", es: "Preferencias" },
  "settings.darkMode": { en: "Dark Mode", es: "Modo Oscuro" },
  "settings.currency": { en: "Currency", es: "Moneda" },
  "settings.defaultStore": { en: "Default Store", es: "Tienda por Defecto" },
  "settings.notifications": { en: "Notifications", es: "Notificaciones" },
  "settings.language": { en: "Language", es: "Idioma" },
  "settings.languageSpan": { en: "English", es: "Español (Latinoamérica)" },

  // Magic Input Screen
  "magic.title": { en: "✨ Magic Recipe", es: "✨ Receta Mágica" },
  "magic.subtitle": { en: "Find recipes with what you have", es: "Encuentra recetas con lo que tienes" },
  "magic.ingredients": { en: "Your Ingredients", es: "Tus Ingredientes" },
  "magic.fromPantry": { en: "From Pantry +", es: "Desde Despensa +" },
  "magic.addIngredient": { en: "+ Add ingredient...", es: "+ Agregar ingrediente..." },
  "magic.add": { en: "Add", es: "Agregar" },
  "magic.preferences": { en: "Preferences", es: "Preferencias" },
  "magic.budget": { en: "Budget (optional)", es: "Presupuesto (opcional)" },
  "magic.servings": { en: "Servings", es: "Porciones" },
  "magic.dietary": { en: "Dietary Restrictions", es: "Restricciones Alimentarias" },
  "magic.time": { en: "Max cooking time", es: "Tiempo máx. de cocción" },
  "magic.find": { en: "Find Recipes ✨", es: "Encontrar Recetas ✨" },
  "magic.count": { en: "ingredients added", es: "ingredientes agregados" },

  // Magic Results Screen
  "results.title": { en: "✨ Results", es: "✨ Resultados" },
  "results.found": { en: "recipes found", es: "recetas encontradas" },
  "results.missingFirst": { en: "least missing ingredients first", es: "recetas con menos faltantes primero" },
  "results.have": { en: "You have {x} of {total} ingredients", es: "Tienes {x} de {total} ingredientes" },
  "results.perfect": { en: "Perfect match! You have all ingredients.", es: "¡Combinación perfecta! Tienes todos los ingredientes." },
  "results.missing": { en: "Missing:", es: "Faltantes:" },
  "results.view": { en: "View Recipe", es: "Ver Receta" },

  // AI Recipe Detail Screen
  "aiDetail.generated": { en: "AI Generated", es: "Generada por IA" },
  "aiDetail.banner": { en: "Generated by AI — review ingredients & instructions before cooking.", es: "Generada por IA — revisa los ingredientes e instrucciones antes de cocinar." },
  "aiDetail.prep": { en: "Prep Time", es: "Tiempo de Prep." },
  "aiDetail.calories": { en: "Calories", es: "Calorías" },
  "aiDetail.difficulty": { en: "Difficulty", es: "Dificultad" },
  "aiDetail.adjust": { en: "Adjust Portions", es: "Ajustar Porciones" },
  "aiDetail.scale": { en: "Scale ingredient amounts instantly", es: "Escala las cantidades al instante" },
  "aiDetail.portions": { en: "portions", es: "porciones" },
  "aiDetail.ingredients": { en: "Ingredients", es: "Ingredientes" },
  "aiDetail.steps": { en: "Steps", es: "Pasos" },
  "aiDetail.info": { en: "Info", es: "Info" },
  "aiDetail.story": { en: "Recipe Story", es: "Historia de la Receta" },
  "aiDetail.tip": { en: "AI Chef Secret Tip", es: "Consejo Secreto del Chef de IA" },
  "aiDetail.save": { en: "Save to My Recipes ❤️", es: "Guardar en Mis Recetas ❤️" },
  "aiDetail.saved": { en: "Saved to My Recipes ✓", es: "Guardado en Mis Recetas ✓" },
  "aiDetail.cook": { en: "Cook Now 🍳", es: "Cocinar Ahora 🍳" }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("freshcart_language");
    return (saved as Language) || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("freshcart_language", lang);
  };

  const t = (key: string, variables?: Record<string, string | number>): string => {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    let text = entry[language] || entry["en"] || key;
    
    if (variables) {
      Object.entries(variables).forEach(([vKey, vVal]) => {
        text = text.replace(`{${vKey}}`, String(vVal));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
