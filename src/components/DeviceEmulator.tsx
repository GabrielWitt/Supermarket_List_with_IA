import React, { useState, useEffect } from "react";
import { 
  House, 
  ShoppingCart, 
  BookOpen, 
  Sparkles, 
  User, 
  Check, 
  Plus, 
  Minus, 
  Pencil, 
  Trash, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  TrendingUp, 
  Sparkle, 
  Search, 
  Info, 
  Clock, 
  Flame, 
  Award, 
  Sliders, 
  RefreshCw, 
  Moon, 
  Sun,
  ChefHat,
  X,
  Settings,
  Bell,
  Shield,
  Star,
  LogOut,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Store,
  Package,
  Lightbulb
} from "lucide-react";
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  googleProvider, 
  signInWithPopup 
} from "../firebase";
import { onAuthStateChanged, signOut, updateProfile, User as FirebaseUser } from "firebase/auth";

// Types matching the native schema
export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  purchased: boolean;
  unit?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTime: string;
  cookTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  calories: string;
  ingredients: Array<{ name: string; amount: string }>;
  steps: string[];
  chefTips: string;
}

const CATEGORIES = ["Fruits", "Vegetables", "Dairy", "Bakery", "Meat & Seafood", "Pantry", "Beverages", "Other"];

const DEFAULT_ITEMS: GroceryItem[] = [
  { id: "1", name: "Organic Bananas", category: "Fruits", quantity: 3, price: 0.89, purchased: true },
  { id: "2", name: "Avocados", category: "Fruits", quantity: 2, price: 1.50, purchased: false },
  { id: "3", name: "Fresh Spinach", category: "Vegetables", quantity: 0, price: 0.00, purchased: false },
  { id: "4", name: "Whole Milk", category: "Dairy", quantity: 1, price: 3.49, purchased: true },
  { id: "5", name: "Sourdough Bread", category: "Bakery", quantity: 0, price: 0.00, purchased: false },
];

const POPULAR_RECIPES: Recipe[] = [
  {
    id: "r1",
    name: "Creamy Spinach Avocado Salad",
    description: "A super healthy, energy-boosting salad utilizing fresh spinach and ripe avocados.",
    prepTime: "10 mins",
    cookTime: "0 mins",
    difficulty: "Easy",
    calories: "280 kcal",
    ingredients: [
      { name: "Avocados", amount: "2 pieces" },
      { name: "Fresh Spinach", amount: "1 bag" },
      { name: "Organic Bananas", amount: "1 sliced" },
      { name: "Olive Oil", amount: "2 tbsp" },
      { name: "Lemon Juice", amount: "1 tbsp" }
    ],
    steps: [
      "Wash and thoroughly dry the fresh spinach leaves.",
      "Cut the avocados in half, remove the pit, and slice the flesh into cubes.",
      "In a small bowl, whisk together olive oil, lemon juice, salt, and pepper.",
      "Toss spinach, sliced bananas, and avocado cubes together in a salad bowl.",
      "Drizzle dressing over the salad, toss gently, and serve cold."
    ],
    chefTips: "Add some roasted pumpkin seeds on top for an extra crunch and healthy fats!"
  },
  {
    id: "r2",
    name: "Golden Banana Toast",
    description: "An easy toasted treat with warm bananas and honey.",
    prepTime: "5 mins",
    cookTime: "5 mins",
    difficulty: "Easy",
    calories: "320 kcal",
    ingredients: [
      { name: "Organic Bananas", amount: "2 ripe ones" },
      { name: "Sourdough Bread", amount: "2 slices" },
      { name: "Whole Milk", amount: "1 glass on the side" },
      { name: "Honey", amount: "1 tbsp" }
    ],
    steps: [
      "Toast the sourdough bread slices until golden brown and crispy.",
      "Peel the ripe bananas and slice them into medium-thick rounds.",
      "Place banana slices evenly on top of the toasted bread.",
      "Drizzle raw organic honey generously over the bananas.",
      "Serve hot with a fresh, cold glass of whole milk on the side."
    ],
    chefTips: "Lightly sear the banana slices in a pan with a pinch of cinnamon before adding them to toast!"
  }
];

const formatFirebaseError = (err: any): string => {
  const code = err?.code || "";
  switch (code) {
    case "auth/user-not-found":
      return "No existe un usuario con este correo electrónico.";
    case "auth/wrong-password":
      return "Contraseña incorrecta. Inténtalo de nuevo.";
    case "auth/invalid-email":
      return "Dirección de correo electrónico no válida.";
    case "auth/invalid-credential":
      return "Credenciales incorrectas. Verifica tu correo y contraseña.";
    case "auth/email-already-in-use":
      return "El correo electrónico ya está registrado.";
    case "auth/weak-password":
      return "La contraseña debe ser más fuerte. Debe tener al menos 6 caracteres.";
    case "auth/popup-closed-by-user":
      return "La ventana de inicio de sesión de Google fue cerrada antes de completarse.";
    default:
      return err?.message || "Ocurrió un error inesperado. Inténtalo de nuevo.";
  }
};

export const DeviceEmulator: React.FC = () => {
  // Navigation: Home | Supermarket | Recipes | Magic Recipe | Profile | Pantry
  const [activeTab, setActiveTab] = useState<"Home" | "Supermarket" | "Pantry" | "Recipes" | "Magic" | "Profile">("Supermarket");
  const [activeScreen, setActiveScreen] = useState<"App" | "Settings" | "Notifications" | "Login" | "Register" | "ForgotPassword" | "Suggestions">("App");
  const [showSplash, setShowSplash] = useState(true);
  const [showAddItem, setShowAddItem] = useState(false);

  // Simulated Login Screen States
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loginEmail, setLoginEmail] = useState("gabrowitt@gmail.com");
  const [loginPassword, setLoginPassword] = useState("password123");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Simulated Register Screen States
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Simulated Forgot Password Screen States
  const [forgotEmail, setForgotEmail] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // Simulated Settings States
  const [settingsName, setSettingsName] = useState("Gabriel Witt");
  const [settingsEmail, setSettingsEmail] = useState("gabrowitt@gmail.com");
  const [currency, setCurrency] = useState("USD $");
  const [defaultStore, setDefaultStore] = useState("Walmart");

  // Simulated Notification States
  const [shoppingReminders, setShoppingReminders] = useState(true);
  const [expirationAlerts, setExpirationAlerts] = useState(true);
  const [smartSuggestions, setSmartSuggestions] = useState(false);
  const [newRecipeIdeas, setNewRecipeIdeas] = useState(true);
  const [selectedDays, setSelectedDays] = useState<string[]>(["MON", "THU"]);
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [daysBeforeAlert, setDaysBeforeAlert] = useState(3);
  const [notificationPermissionGranted, setNotificationPermissionGranted] = useState(false);

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setSettingsEmail(user.email || "");
        setSettingsName(user.displayName || user.email?.split("@")[0] || "FreshCart User");
        // Only switch to App screen if they are currently on Login/Register/ForgotPassword screens
        setActiveScreen(prev => {
          if (prev === "Login" || prev === "Register" || prev === "ForgotPassword") {
            return "App";
          }
          return prev;
        });
      } else {
        setCurrentUser(null);
      }
    });
    return unsubscribe;
  }, []);
  
  // App States
  const [items, setItems] = useState<GroceryItem[]>(() => {
    const saved = localStorage.getItem("freshcart_items");
    return saved ? JSON.parse(saved) : DEFAULT_ITEMS;
  });
  
  const [history, setHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem("freshcart_history");
    return saved ? JSON.parse(saved) : [
      {
        id: "h1",
        purchaseDate: Date.now() - 86400000 * 2,
        items: [
          { name: "Organic Bananas", category: "Fruits", quantity: 3, price: 0.89 },
          { name: "Whole Milk", category: "Dairy", quantity: 1, price: 3.49 }
        ],
        totalCost: 6.16
      }
    ];
  });

  const [pantryItems, setPantryItems] = useState<any[]>(() => {
    const saved = localStorage.getItem("freshcart_pantry");
    return saved ? JSON.parse(saved) : [
      { id: "p1", name: "Olive Oil", category: "Pantry", quantity: 1, expiryDate: Date.now() + 86400000 * 30 },
      { id: "p2", name: "Quinoa", category: "Pantry", quantity: 2, expiryDate: Date.now() + 86400000 * 15 },
      { id: "p3", name: "Spaghetti", category: "Pantry", quantity: 3, expiryDate: Date.now() + 86400000 * 45 },
    ];
  });
  
  const [stats, setStats] = useState({
    totalTrips: 3,
    totalSpent: 42.50,
    totalItemsPurchased: 18,
    streakDays: 4
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  // Modals
  const [qtyModalItem, setQtyModalItem] = useState<GroceryItem | null>(null);
  const [qtyValue, setQtyValue] = useState<number>(0);
  
  const [priceModalItem, setPriceModalItem] = useState<GroceryItem | null>(null);
  const [priceValue, setPriceValue] = useState<string>("");

  const [editModalItem, setEditModalItem] = useState<GroceryItem | null>(null);
  const [editQty, setEditQty] = useState<number>(1);
  const [editUnit, setEditUnit] = useState<string>("units");
  const [editPrice, setEditPrice] = useState<string>("");

  const [showFinishModal, setShowFinishModal] = useState(false);
  const [finishStoreName, setFinishStoreName] = useState("");
  const [finishMoveToPantry, setFinishMoveToPantry] = useState(true);

  useEffect(() => {
    if (showFinishModal) {
      setFinishStoreName(defaultStore);
      setFinishMoveToPantry(true);
    }
  }, [showFinishModal, defaultStore]);
  
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<string>("Fruits");

  // Pantry Interactive States
  const [pantrySearchQuery, setPantrySearchQuery] = useState("");
  const [pantrySelectedCategory, setPantrySelectedCategory] = useState("All");
  const [pantryFilterExpiringOnly, setPantryFilterExpiringOnly] = useState(false);
  
  // Pantry Add/Edit Modal States
  const [showPantryAddModal, setShowPantryAddModal] = useState(false);
  const [pantryEditItem, setPantryEditItem] = useState<any | null>(null);
  const [pantryItemName, setPantryItemName] = useState("");
  const [pantryItemCategory, setPantryItemCategory] = useState("Dairy");
  const [pantryItemQty, setPantryItemQty] = useState(1);
  const [pantryItemUnit, setPantryItemUnit] = useState("units");
  const [pantryItemExpiryDays, setPantryItemExpiryDays] = useState(14);

  // Suggestions States
  const [suggestionsAddedItems, setSuggestionsAddedItems] = useState<Record<string, boolean>>({});

  // AI Chef States
  const [aiRecipe, setAiRecipe] = useState<Recipe | null>(null);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  const [recipeError, setRecipeError] = useState<string | null>(null);
  const [chefMessageIndex, setChefMessageIndex] = useState(0);

  const chefMessages = [
    "Chopping ingredients...",
    "Combining flavor profiles...",
    "Preheating oven to chef standards...",
    "Simmering sauce...",
    "Plating with high-contrast garnish..."
  ];

  useEffect(() => {
    if (isGeneratingRecipe) {
      const interval = setInterval(() => {
        setChefMessageIndex((prev) => (prev + 1) % chefMessages.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isGeneratingRecipe]);

  // Persist items
  useEffect(() => {
    localStorage.setItem("freshcart_items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("freshcart_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("freshcart_pantry", JSON.stringify(pantryItems));
  }, [pantryItems]);

  // Business Rule: New items start with quantity = 0, price = $0.00
  const handleAddItem = (name: string, category: string) => {
    if (!name.trim()) return;
    const newItem: GroceryItem = {
      id: Math.random().toString(36).substring(7),
      name: name.trim(),
      category: category,
      quantity: 0, // Starts at 0
      price: 0.00, // Starts at $0.00
      purchased: false
    };
    setItems((prev) => [...prev, newItem]);
    setNewItemName("");
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleTogglePurchased = (id: string) => {
    setItems((prev) => prev.map((item) => {
      if (item.id === id) {
        // Only allow purchase toggle if quantity > 0
        if (item.quantity === 0) return item;
        return { ...item, purchased: !item.purchased };
      }
      return item;
    }));
  };

  // Click handler for Quantity Modal (now redirects to the unified Edit Item Modal Bottom Sheet)
  const openQuantityModal = (item: GroceryItem) => {
    openEditModal(item);
  };

  const saveQuantity = () => {
    // Left for fallback if needed, but we use saveEditModalChanges
  };

  // Click handler for Price Modal (now redirects to the unified Edit Item Modal Bottom Sheet)
  const openPriceModal = (item: GroceryItem) => {
    openEditModal(item);
  };

  const savePrice = () => {
    // Left for fallback if needed, but we use saveEditModalChanges
  };

  const openEditModal = (item: GroceryItem) => {
    setEditModalItem(item);
    setEditQty(item.quantity || 1);
    setEditUnit(item.unit || "units");
    setEditPrice(item.price ? item.price.toFixed(2) : "");
  };

  const saveEditModalChanges = () => {
    if (editModalItem) {
      const parsedPrice = parseFloat(editPrice) || 0.00;
      setItems((prev) => prev.map((it) => {
        if (it.id === editModalItem.id) {
          const purchasedState = editQty === 0 ? false : it.purchased;
          return { 
            ...it, 
            quantity: editQty, 
            unit: editUnit, 
            price: Math.max(0, parsedPrice), 
            purchased: purchasedState 
          };
        }
        return it;
      }));
      setEditModalItem(null);
    }
  };

  // Business Rule: Finish Shopping saves only purchased items.
  // Items with quantity 0 or unpurchased remain in the list for the next shopping trip.
  const handleFinishShopping = async (customStoreName?: string, moveToPantryOption: boolean = true) => {
    const purchased = items.filter(item => item.quantity > 0 && item.purchased);
    const remaining = items.filter(item => item.quantity === 0 || !item.purchased);

    if (purchased.length === 0) {
      alert("No purchased items in your shopping cart! Please set quantities, prices, and mark items as checked.");
      return;
    }

    setIsFinishing(true);
    // Simulate mobile networking sync latency
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const totalCost = purchased.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const itemVolume = purchased.reduce((sum, item) => sum + item.quantity, 0);

    const newHistoryItem = {
      id: Math.random().toString(36).substring(7),
      purchaseDate: Date.now(),
      items: purchased.map(item => ({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price
      })),
      totalCost,
      store: customStoreName || defaultStore
    };

    setHistory((prev) => [newHistoryItem, ...prev]);
    setItems(remaining); // Business Rule: Quantity 0 items stay on list!
    
    if (moveToPantryOption) {
      setPantryItems((prev) => {
        const updated = [...prev];
        purchased.forEach(purchasedItem => {
          const existingIdx = updated.findIndex(pi => pi.name.toLowerCase() === purchasedItem.name.toLowerCase());
          if (existingIdx > -1) {
            updated[existingIdx].quantity += purchasedItem.quantity;
          } else {
            updated.push({
              id: Math.random().toString(36).substring(7),
              name: purchasedItem.name,
              category: purchasedItem.category,
              quantity: purchasedItem.quantity,
              expiryDate: Date.now() + 86400000 * 14, // 14 days fallback
            });
          }
        });
        return updated;
      });
    }

    setStats((prev) => ({
      totalTrips: prev.totalTrips + 1,
      totalSpent: parseFloat((prev.totalSpent + totalCost).toFixed(2)),
      totalItemsPurchased: prev.totalItemsPurchased + itemVolume,
      streakDays: prev.streakDays + 1
    }));

    setIsFinishing(false);
    setShowFinishModal(false);
    setActiveTab("Home");
  };

  // Add Recipe Ingredients to List
  const handleAddRecipeIngredients = (recipe: Recipe) => {
    const currentList = [...items];
    recipe.ingredients.forEach(ing => {
      // Check if ingredient already exists (loose match)
      const exists = currentList.find(it => it.name.toLowerCase().includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(it.name.toLowerCase()));
      if (!exists) {
        currentList.push({
          id: Math.random().toString(36).substring(7),
          name: ing.name,
          category: "Other",
          quantity: 1, // Adds with quantity 1 for recipes so the user gets them right away
          price: 0.00,  // Price starts at 0.00 as per rule
          purchased: false
        });
      } else if (exists.quantity === 0) {
        exists.quantity = 1; // Update from 0 to 1 so it is active
      }
    });
    setItems(currentList);
    setActiveTab("Supermarket");
  };

  // Add a new Pantry Item manually or update an existing one
  const handleSavePantryItem = () => {
    if (!pantryItemName.trim()) return;

    const expiryTime = Date.now() + 86400000 * pantryItemExpiryDays;

    if (pantryEditItem) {
      // Edit mode
      setPantryItems((prev) =>
        prev.map((it) =>
          it.id === pantryEditItem.id
            ? {
                ...it,
                name: pantryItemName.trim(),
                category: pantryItemCategory,
                quantity: pantryItemQty,
                unit: pantryItemUnit,
                expiryDate: expiryTime,
              }
            : it
        )
      );
      setPantryEditItem(null);
    } else {
      // Add mode
      const newItem = {
        id: Math.random().toString(36).substring(7),
        name: pantryItemName.trim(),
        category: pantryItemCategory,
        quantity: pantryItemQty,
        unit: pantryItemUnit,
        expiryDate: expiryTime,
      };
      setPantryItems((prev) => [...prev, newItem]);
    }

    // Reset fields & close
    setPantryItemName("");
    setPantryItemCategory("Dairy");
    setPantryItemQty(1);
    setPantryItemUnit("units");
    setPantryItemExpiryDays(14);
    setShowPantryAddModal(false);
  };

  // Open Add Pantry Item Modal
  const handleOpenAddPantryModal = () => {
    setPantryEditItem(null);
    setPantryItemName("");
    setPantryItemCategory("Dairy");
    setPantryItemQty(1);
    setPantryItemUnit("units");
    setPantryItemExpiryDays(14);
    setShowPantryAddModal(true);
  };

  // Open Edit Pantry Item Modal
  const handleOpenEditPantryModal = (item: any) => {
    setPantryEditItem(item);
    setPantryItemName(item.name);
    setPantryItemCategory(item.category || "Dairy");
    setPantryItemQty(item.quantity || 1);
    setPantryItemUnit(item.unit || "units");
    const diffDays = item.expiryDate
      ? Math.max(1, Math.ceil((item.expiryDate - Date.now()) / 86400000))
      : 14;
    setPantryItemExpiryDays(diffDays);
    setShowPantryAddModal(true);
  };

  // Delete pantry item
  const handleDeletePantryItem = (id: string) => {
    if (confirm("Are you sure you want to delete this item from your pantry?")) {
      setPantryItems((prev) => prev.filter((it) => it.id !== id));
    }
  };

  // Handle adding suggested items from Suggestions screen
  const handleAddSuggestedItems = (suggested: Array<{ name: string; category: string }>) => {
    setItems((prev) => {
      const updated = [...prev];
      suggested.forEach((s) => {
        const exists = updated.find((it) => it.name.toLowerCase() === s.name.toLowerCase());
        if (!exists) {
          updated.push({
            id: Math.random().toString(36).substring(7),
            name: s.name,
            category: s.category || "Other",
            quantity: 1, // Start with active quantity of 1
            price: 1.50, // Default price
            purchased: false,
          });
        } else if (exists.quantity === 0) {
          exists.quantity = 1;
        }
      });
      return updated;
    });
  };

  // Generate Recipe via server-side Gemini API
  const handleGenerateMagicRecipe = async () => {
    const activeIngredients = items.filter(it => it.quantity > 0);
    if (activeIngredients.length === 0) {
      setRecipeError("Please add some active items with quantity > 0 in your Supermarket list first so the AI chef knows what ingredients you have!");
      return;
    }

    setIsGeneratingRecipe(true);
    setRecipeError(null);
    setAiRecipe(null);

    try {
      const res = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: activeIngredients }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Server failed to compile recipe.");
      }

      const data = await res.json();
      setAiRecipe(data);
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      setRecipeError(err.message || "An unexpected error occurred. Please verify your GEMINI_API_KEY in the secrets menu.");
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  // Filters for supermarket active lists
  const filteredItems = items.filter(it => {
    const matchesSearch = it.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || it.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalCostOfCurrentTrip = items
    .filter(it => it.purchased && it.quantity > 0)
    .reduce((sum, it) => sum + (it.quantity * it.price), 0);

  return (
    <div className={`relative w-[375px] h-[780px] rounded-[48px] border-[12px] border-gray-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] flex flex-col overflow-hidden transition-all duration-300 ${isDarkMode ? "bg-[#121214]/85 text-white border-zinc-800" : "bg-white/75 text-gray-900 border-gray-900"} backdrop-blur-2xl`} id="mobile-device-simulator">
      {/* simulated splash screen container */}
      {showSplash && (
        <div className="absolute inset-0 bg-[#2D6A4F] z-[100] flex flex-col items-center justify-center animate-fade-in text-white select-none">
          {/* iOS Camera Notch and Status Bar over splash bg */}
          <div className="absolute top-0 inset-x-0 h-10 bg-transparent flex items-center justify-between px-8 text-[11px] font-semibold text-gray-200">
            <span>13:00</span>
            <div className="w-[120px] h-[24px] bg-black rounded-b-2xl absolute left-1/2 -translate-x-1/2 top-0 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-[#1C1C1E] rounded-full absolute right-8"></div>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-2 bg-white rounded-sm"></span>
              <span className="w-2 h-2 border border-white rounded-full"></span>
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            <span className="text-[72px]" role="img" aria-label="Shopping Cart">🛒</span>
            <h1 className="text-[34px] font-bold text-white mt-4 tracking-tight leading-none">FreshCart</h1>
            <p className="text-[15px] text-white/75 mt-2 font-medium">Shop smart. Cook smarter.</p>
          </div>

          <div className="absolute bottom-[60px] flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* iOS Camera Notch and Status Bar */}
      <div className="absolute top-0 inset-x-0 h-10 bg-transparent flex items-center justify-between px-8 z-50 text-[11px] font-semibold select-none">
        <span className={`${isDarkMode ? "text-gray-300" : "text-gray-800"}`}>13:00</span>
        <div className="w-[120px] h-[24px] bg-black rounded-b-2xl absolute left-1/2 -translate-x-1/2 top-0 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-[#1C1C1E] rounded-full absolute right-8"></div>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-2 bg-green-500 rounded-sm"></span>
          <span className="w-2 h-2 border border-current rounded-full"></span>
        </div>
      </div>

      {/* Screen Layout: Main Content Area */}
      <div className={`flex-1 pt-10 overflow-y-auto ${activeScreen === "App" ? "pb-[83px]" : "pb-4"}`}>
        
        {/* ==================== LOGIN SCREEN ==================== */}
        {activeScreen === "Login" && (
          <div className="animate-fade-in px-5 py-6 flex flex-col justify-between h-full min-h-[640px]">
            {/* Top Section */}
            <div className="flex flex-col items-center justify-center text-center pt-8">
              <span className="text-5xl mb-3" role="img" aria-label="Shopping Cart">🛒</span>
              <h1 className="text-2xl font-black tracking-tight text-[#2D6A4F]">FreshCart</h1>
              <p className="text-xs text-gray-400 font-medium mt-1">Your smart kitchen companion</p>
            </div>

            {/* Form Section */}
            <div className={`p-6 rounded-2xl border space-y-4 shadow-md ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}>
              <div className="space-y-0.5">
                <h2 className="text-base font-black text-gray-900 dark:text-white">Welcome back</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Sign in to your account</p>
              </div>

              {loginError && (
                <div className="p-2.5 bg-red-50 text-red-700 text-[10px] font-bold rounded-lg border border-red-100 animate-fade-in">
                  {loginError}
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase text-gray-400 tracking-wider">Email</label>
                <div className={`flex items-center space-x-2 border rounded-xl px-3 py-2.5 ${isDarkMode ? "border-zinc-800 bg-zinc-950" : "border-gray-200 bg-gray-50"}`}>
                  <Mail size={14} className="text-gray-400" />
                  <input 
                    type="email" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="bg-transparent text-xs outline-none w-full font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase text-gray-400 tracking-wider">Password</label>
                <div className={`flex items-center space-x-2 border rounded-xl px-3 py-2.5 ${isDarkMode ? "border-zinc-800 bg-zinc-950" : "border-gray-200 bg-gray-50"}`}>
                  <Lock size={14} className="text-gray-400" />
                  <input 
                    type={showLoginPassword ? "text" : "password"} 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="bg-transparent text-xs outline-none w-full font-medium"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showLoginPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => {
                    setForgotError(null);
                    setForgotSubmitted(false);
                    setForgotEmail("");
                    setActiveScreen("ForgotPassword");
                  }}
                  className="text-[11px] font-bold text-[#2D6A4F] hover:underline focus:outline-none"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Sign In Button */}
              <button 
                onClick={() => {
                  if (!loginEmail || !loginEmail.includes("@")) {
                    setLoginError("Por favor, ingresa un correo electrónico válido.");
                    return;
                  }
                  if (!loginPassword || loginPassword.length < 6) {
                    setLoginError("La contraseña debe tener al menos 6 caracteres.");
                    return;
                  }
                  setLoginError(null);
                  setIsLoggingIn(true);
                  signInWithEmailAndPassword(auth, loginEmail, loginPassword)
                    .then(() => {
                      setIsLoggingIn(false);
                      // Handled by auth observer
                    })
                    .catch((err) => {
                      setIsLoggingIn(false);
                      setLoginError(formatFirebaseError(err));
                    });
                }}
                disabled={isLoggingIn}
                className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] disabled:bg-[#2D6A4F]/60 text-white py-3 rounded-xl text-xs font-extrabold shadow-sm transition-all active:scale-95 flex items-center justify-center space-x-1.5"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <span>Iniciar Sesión</span>
                )}
              </button>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
                <span className="flex-shrink mx-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider">o</span>
                <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
              </div>

              {/* Google Sign In Button */}
              <button 
                type="button"
                onClick={() => {
                  setLoginError(null);
                  setIsLoggingIn(true);
                  signInWithPopup(auth, googleProvider)
                    .then(() => {
                      setIsLoggingIn(false);
                      // Handled by auth observer
                    })
                    .catch((err) => {
                      setIsLoggingIn(false);
                      const isIframe = window.self !== window.top;
                      if (isIframe) {
                        setLoginError("El inicio de sesión de Google requiere abrir el sitio en una nueva pestaña (icono de expandir en la esquina superior derecha) debido a restricciones de seguridad del iframe de Google.");
                      } else {
                        setLoginError(formatFirebaseError(err));
                      }
                    });
                }}
                disabled={isLoggingIn}
                className={`w-full py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center space-x-2 transition-all active:scale-95 ${
                  isDarkMode 
                    ? "bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800" 
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-blue-500 font-extrabold text-sm">G</span>
                <span>Continuar con Google</span>
              </button>

              {/* Footer Register Link */}
              <div className="flex items-center justify-center space-x-1.5 text-xs pt-1">
                <span className="text-gray-500 font-medium">Don't have an account?</span>
                <button
                  type="button"
                  onClick={() => {
                    setRegError(null);
                    setRegName("");
                    setRegEmail("");
                    setRegPassword("");
                    setRegConfirmPassword("");
                    setActiveScreen("Register");
                  }}
                  className="text-[#2D6A4F] font-bold hover:underline focus:outline-none"
                >
                  Register
                </button>
              </div>
            </div>

            {/* Bottom help text */}
            <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-wider">
              Protected by FreshCart secure sandbox authentication
            </p>
          </div>
        )}

        {/* ==================== REGISTER SCREEN ==================== */}
        {activeScreen === "Register" && (
          <div className="animate-fade-in px-5 py-6 flex flex-col justify-between h-full min-h-[640px]">
            {/* Header / Back row */}
            <div className="flex items-center space-x-2 -mt-2 mb-4">
              <button 
                type="button"
                onClick={() => setActiveScreen("Login")}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-850 text-[#2D6A4F] transition-colors focus:outline-none"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-xs font-bold text-gray-500">Back to Login</span>
            </div>

            {/* Top Title Section */}
            <div className="flex flex-col items-start justify-center pt-2">
              <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Create Account</h1>
              <p className="text-xs text-gray-400 font-medium mt-1">Join FreshCart today</p>
            </div>

            {/* Form Section */}
            <div className={`p-6 rounded-2xl border space-y-4 shadow-md ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}>
              {regError && (
                <div className="p-2.5 bg-red-50 text-red-700 text-[10px] font-bold rounded-lg border border-red-100 animate-fade-in">
                  {regError}
                </div>
              )}

              {/* Full Name Input */}
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase text-gray-400 tracking-wider">Full Name</label>
                <div className={`flex items-center space-x-2 border rounded-xl px-3 py-2.5 ${isDarkMode ? "border-zinc-800 bg-zinc-950" : "border-gray-200 bg-gray-50"}`}>
                  <User size={14} className="text-gray-400" />
                  <input 
                    type="text" 
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Gabriel Torres"
                    className="bg-transparent text-xs outline-none w-full font-medium"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase text-gray-400 tracking-wider">Email</label>
                <div className={`flex items-center space-x-2 border rounded-xl px-3 py-2.5 ${isDarkMode ? "border-zinc-800 bg-zinc-950" : "border-gray-200 bg-gray-50"}`}>
                  <Mail size={14} className="text-gray-400" />
                  <input 
                    type="email" 
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="bg-transparent text-xs outline-none w-full font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase text-gray-400 tracking-wider">Password</label>
                <div className={`flex items-center space-x-2 border rounded-xl px-3 py-2.5 ${isDarkMode ? "border-zinc-800 bg-zinc-950" : "border-gray-200 bg-gray-50"}`}>
                  <Lock size={14} className="text-gray-400" />
                  <input 
                    type={showRegPassword ? "text" : "password"} 
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-transparent text-xs outline-none w-full font-medium"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showRegPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-[9px] text-gray-400">At least 8 characters</p>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase text-gray-400 tracking-wider">Confirm Password</label>
                <div className={`flex items-center space-x-2 border rounded-xl px-3 py-2.5 ${isDarkMode ? "border-zinc-800 bg-zinc-950" : "border-gray-200 bg-gray-50"}`}>
                  <Lock size={14} className="text-gray-400" />
                  <input 
                    type={showRegConfirmPassword ? "text" : "password"} 
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-transparent text-xs outline-none w-full font-medium"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showRegConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Register Button */}
              <button 
                onClick={() => {
                  if (!regName.trim()) {
                    setRegError("El nombre completo es obligatorio.");
                    return;
                  }
                  if (!regEmail || !regEmail.includes("@")) {
                    setRegError("Por favor, ingresa un correo electrónico válido.");
                    return;
                  }
                  if (!regPassword || regPassword.length < 6) {
                    setRegError("La contraseña debe tener al menos 6 caracteres.");
                    return;
                  }
                  if (regPassword !== regConfirmPassword) {
                    setRegError("Las contraseñas no coinciden.");
                    return;
                  }
                  setRegError(null);
                  setIsRegistering(true);
                  createUserWithEmailAndPassword(auth, regEmail, regPassword)
                    .then((userCredential) => {
                      const user = userCredential.user;
                      return updateProfile(user, {
                        displayName: regName
                      });
                    })
                    .then(() => {
                      setIsRegistering(false);
                      // Handled by auth observer
                    })
                    .catch((err) => {
                      setIsRegistering(false);
                      setRegError(formatFirebaseError(err));
                    });
                }}
                disabled={isRegistering}
                className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] disabled:bg-[#2D6A4F]/60 text-white py-3 rounded-xl text-xs font-extrabold shadow-sm transition-all active:scale-95 flex items-center justify-center space-x-1.5"
              >
                {isRegistering ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creando cuenta...</span>
                  </>
                ) : (
                  <span>Crear Cuenta</span>
                )}
              </button>
            </div>

            {/* Already have an account link */}
            <div className="flex items-center justify-center space-x-1.5 text-xs">
              <span className="text-gray-500 font-medium">Already have an account?</span>
              <button
                type="button"
                onClick={() => setActiveScreen("Login")}
                className="text-[#2D6A4F] font-bold hover:underline focus:outline-none"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* ==================== FORGOT PASSWORD SCREEN ==================== */}
        {activeScreen === "ForgotPassword" && (
          <div className="animate-fade-in px-5 py-6 flex flex-col justify-between h-full min-h-[640px]">
            {/* Header / Back row */}
            <div className="flex items-center space-x-2 -mt-2 mb-4">
              <button 
                type="button"
                onClick={() => {
                  if (forgotSubmitted) {
                    setForgotSubmitted(false);
                  } else {
                    setActiveScreen("Login");
                  }
                }}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-850 text-[#2D6A4F] transition-colors focus:outline-none"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-xs font-bold text-gray-500">Back</span>
            </div>

            {!forgotSubmitted ? (
              /* FORM PHASE */
              <div className="flex-1 flex flex-col justify-center space-y-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#D8F3DC] flex items-center justify-center mb-4">
                    <Mail size={28} className="text-[#2D6A4F]" />
                  </div>
                  <h1 className="text-xl font-black text-gray-900 dark:text-white">Reset Password</h1>
                  <p className="text-xs text-gray-400 font-medium max-w-[240px] mt-2 leading-relaxed">
                    Enter your email and we'll send you a link to reset your password.
                  </p>
                </div>

                <div className={`p-6 rounded-2xl border space-y-4 shadow-md ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}>
                  {forgotError && (
                    <div className="p-2.5 bg-red-50 text-red-700 text-[10px] font-bold rounded-lg border border-red-100 animate-fade-in">
                      {forgotError}
                    </div>
                  )}

                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold uppercase text-gray-400 tracking-wider">Email Address</label>
                    <div className={`flex items-center space-x-2 border rounded-xl px-3 py-2.5 ${isDarkMode ? "border-zinc-800 bg-zinc-950" : "border-gray-200 bg-gray-50"}`}>
                      <Mail size={14} className="text-gray-400" />
                      <input 
                        type="email" 
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="bg-transparent text-xs outline-none w-full font-medium"
                      />
                    </div>
                  </div>

                  {/* Send Reset Link Button */}
                  <button 
                    onClick={() => {
                      if (!forgotEmail || !forgotEmail.includes("@")) {
                        setForgotError("Por favor, ingresa un correo electrónico válido.");
                        return;
                      }
                      setForgotError(null);
                      setIsSendingReset(true);
                      sendPasswordResetEmail(auth, forgotEmail)
                        .then(() => {
                          setIsSendingReset(false);
                          setForgotSubmitted(true);
                        })
                        .catch((err) => {
                          setIsSendingReset(false);
                          setForgotError(formatFirebaseError(err));
                        });
                    }}
                    disabled={isSendingReset}
                    className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] disabled:bg-[#2D6A4F]/60 text-white py-3 rounded-xl text-xs font-extrabold shadow-sm transition-all active:scale-95 flex items-center justify-center space-x-1.5"
                  >
                    {isSendingReset ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Enviando enlace...</span>
                      </>
                    ) : (
                      <span>Enviar Enlace</span>
                    )}
                  </button>
                </div>

                {/* Back to sign in text link */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setActiveScreen("Login")}
                    className="text-xs font-bold text-[#2D6A4F] hover:underline focus:outline-none"
                  >
                    Volver a Iniciar Sesión
                  </button>
                </div>
              </div>
            ) : (
              /* SUCCESS PHASE */
              <div className="flex-1 flex flex-col justify-center space-y-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#E5F9EC] flex items-center justify-center mb-4">
                    <Check size={32} className="text-[#34C759]" />
                  </div>
                  <h1 className="text-xl font-black text-gray-900 dark:text-white">Revisa tu correo</h1>
                  <p className="text-xs text-gray-500 font-medium max-w-[240px] mt-2 leading-relaxed">
                    Hemos enviado un enlace de restablecimiento a: <br/>
                    <strong className="text-gray-900 dark:text-white break-all">{forgotEmail}</strong>
                  </p>
                </div>

                <div className="space-y-3 px-4">
                  {/* Primary Back to Login Button */}
                  <button 
                    type="button"
                    onClick={() => setActiveScreen("Login")}
                    className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white py-3 rounded-xl text-xs font-extrabold shadow-sm transition-all active:scale-95"
                  >
                    Volver al Inicio de Sesión
                  </button>

                  {/* Resend Email Button */}
                  <button 
                    type="button"
                    onClick={() => {
                      setIsSendingReset(true);
                      sendPasswordResetEmail(auth, forgotEmail)
                        .then(() => {
                          setIsSendingReset(false);
                          alert("¡Enlace enviado nuevamente con éxito!");
                        })
                        .catch((err) => {
                          setIsSendingReset(false);
                          alert(formatFirebaseError(err));
                        });
                    }}
                    disabled={isSendingReset}
                    className="w-full text-gray-500 hover:text-gray-700 py-2.5 text-xs font-bold transition-all focus:outline-none"
                  >
                    {isSendingReset ? "Reenviando..." : "Reenviar Correo"}
                  </button>
                </div>
              </div>
            )}

            <div />
          </div>
        )}

        {/* ==================== SETTINGS SCREEN ==================== */}
        {activeScreen === "Settings" && (
          <div className="animate-fade-in px-4 pb-6 pt-2">
            {/* Header row */}
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => setActiveScreen("App")}
                className="flex items-center text-xs font-bold text-[#2D6A4F] hover:opacity-80"
              >
                <ChevronLeft size={16} className="mr-0.5" />
                <span>Back</span>
              </button>
              <h2 className="text-sm font-black uppercase tracking-wider text-center flex-1 pr-8">
                Settings
              </h2>
            </div>

            <div className="space-y-6">
              {/* SECTION: ACCOUNT */}
              <div className="space-y-2">
                <h3 className={`text-[10px] font-extrabold uppercase tracking-wider ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
                  Account
                </h3>
                <div className={`rounded-xl border divide-y overflow-hidden shadow-sm ${isDarkMode ? "bg-zinc-900 border-zinc-800 divide-zinc-800" : "bg-white border-gray-100 divide-gray-50"}`}>
                  {/* Row 1: Name */}
                  <div className="h-12 px-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <User size={16} className="text-gray-400" />
                      <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Name</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <input 
                        type="text" 
                        value={settingsName} 
                        onChange={(e) => setSettingsName(e.target.value)}
                        className="bg-transparent text-right text-xs font-medium text-gray-500 dark:text-gray-400 outline-none max-w-[120px]"
                      />
                      <ChevronRight size={12} className="text-gray-300" />
                    </div>
                  </div>

                  {/* Row 2: Email */}
                  <div className="h-12 px-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Email</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <input 
                        type="email" 
                        value={settingsEmail} 
                        onChange={(e) => setSettingsEmail(e.target.value)}
                        className="bg-transparent text-right text-xs font-medium text-gray-500 dark:text-gray-400 outline-none max-w-[140px]"
                      />
                      <ChevronRight size={12} className="text-gray-300" />
                    </div>
                  </div>

                  {/* Row 3: Change Password */}
                  <button 
                    onClick={() => alert("Password reset link sent to Gabriel's email simulation.")}
                    className="w-full h-12 px-4 flex items-center justify-between text-left transition-colors hover:bg-gray-50 dark:hover:bg-zinc-850"
                  >
                    <div className="flex items-center space-x-3">
                      <Lock size={16} className="text-gray-400" />
                      <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Change Password</span>
                    </div>
                    <ChevronRight size={12} className="text-gray-300" />
                  </button>
                </div>
              </div>

              {/* SECTION: PREFERENCES */}
              <div className="space-y-2">
                <h3 className={`text-[10px] font-extrabold uppercase tracking-wider ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
                  Preferences
                </h3>
                <div className={`rounded-xl border divide-y overflow-hidden shadow-sm ${isDarkMode ? "bg-zinc-900 border-zinc-800 divide-zinc-800" : "bg-white border-gray-100 divide-gray-50"}`}>
                  {/* Row 1: Dark Mode */}
                  <div className="h-12 px-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Moon size={16} className="text-gray-400" />
                      <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Dark Mode</span>
                    </div>
                    <button 
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 ${isDarkMode ? "bg-[#2D6A4F]" : "bg-gray-200"}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${isDarkMode ? "translate-x-4" : "translate-x-0"}`} />
                    </button>
                  </div>

                  {/* Row 2: Currency */}
                  <div className="h-12 px-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-gray-400 font-bold">$</span>
                      <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Currency</span>
                    </div>
                    <div className="flex items-center space-x-1.5 cursor-pointer" onClick={() => {
                      const next = currency === "USD $" ? "EUR €" : currency === "EUR €" ? "GBP £" : "USD $";
                      setCurrency(next);
                    }}>
                      <span className="text-xs text-gray-500 font-medium">{currency}</span>
                      <ChevronRight size={12} className="text-gray-300" />
                    </div>
                  </div>

                  {/* Row 3: Default Store */}
                  <div className="h-12 px-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Store size={16} className="text-gray-400" />
                      <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Default Store</span>
                    </div>
                    <div className="flex items-center space-x-1.5 cursor-pointer" onClick={() => {
                      const stores = ["Walmart", "Target", "Trader Joe's", "Whole Foods", "Kroger"];
                      const currentIdx = stores.indexOf(defaultStore);
                      const nextStore = stores[(currentIdx + 1) % stores.length];
                      setDefaultStore(nextStore);
                    }}>
                      <span className="text-xs text-gray-500 font-medium">{defaultStore}</span>
                      <ChevronRight size={12} className="text-gray-300" />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: NOTIFICATIONS */}
              <div className="space-y-2">
                <h3 className={`text-[10px] font-extrabold uppercase tracking-wider ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
                  Notifications
                </h3>
                <div className={`rounded-xl border divide-y overflow-hidden shadow-sm ${isDarkMode ? "bg-zinc-900 border-zinc-800 divide-zinc-800" : "bg-white border-gray-100 divide-gray-50"}`}>
                  <button 
                    onClick={() => setActiveScreen("Notifications")}
                    className="w-full h-12 px-4 flex items-center justify-between text-left transition-colors hover:bg-gray-50 dark:hover:bg-zinc-850"
                  >
                    <div className="flex items-center space-x-3">
                      <Bell size={16} className="text-gray-400" />
                      <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Notification Settings</span>
                    </div>
                    <ChevronRight size={12} className="text-gray-300" />
                  </button>
                </div>
              </div>

              {/* SECTION: ABOUT */}
              <div className="space-y-2">
                <h3 className={`text-[10px] font-extrabold uppercase tracking-wider ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
                  About
                </h3>
                <div className={`rounded-xl border divide-y overflow-hidden shadow-sm ${isDarkMode ? "bg-zinc-900 border-zinc-800 divide-zinc-800" : "bg-white border-gray-100 divide-gray-50"}`}>
                  <div className="h-12 px-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Info size={16} className="text-gray-400" />
                      <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Version</span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">1.0.0</span>
                  </div>
                </div>
              </div>

              {/* SECTION: DANGER */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-red-500">
                  Danger Zone
                </h3>
                <div className={`rounded-xl border overflow-hidden shadow-sm ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}>
                  <button 
                    onClick={() => {
                      if (confirm("Are you sure you want to delete Gabriel's profile data from sandbox? This will reset all active items.")) {
                        setItems([]);
                        setHistory([]);
                        setActiveScreen("Login");
                      }
                    }}
                    className="w-full h-12 px-4 flex items-center space-x-3 text-left transition-colors hover:bg-red-50/10 text-red-500"
                  >
                    <Trash size={16} />
                    <span className="text-xs font-bold">Delete Account</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================== NOTIFICATIONS SCREEN ==================== */}
        {activeScreen === "Notifications" && (
          <div className="animate-fade-in px-4 pb-6 pt-2">
            {/* Header row */}
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => setActiveScreen("Settings")}
                className="flex items-center text-xs font-bold text-[#2D6A4F] hover:opacity-80"
              >
                <ChevronLeft size={16} className="mr-0.5" />
                <span>Settings</span>
              </button>
              <h2 className="text-sm font-black uppercase tracking-wider text-center flex-1 pr-8">
                Notifications
              </h2>
            </div>

            {/* Permission Banner */}
            {!notificationPermissionGranted && (
              <div className="mb-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl p-3.5 flex flex-col space-y-2 text-amber-800 dark:text-amber-400">
                <div className="flex items-start space-x-2.5">
                  <Info size={16} className="mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold">Notifications Disabled</p>
                    <p className="text-[10px] leading-relaxed opacity-90">To receive active reminders and ingredient alerts, please grant sandbox permission.</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setNotificationPermissionGranted(true);
                    alert("Simulated push notification permissions granted!");
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-extrabold py-1.5 px-3 rounded-lg self-end transition-all active:scale-95 shadow-sm"
                >
                  Enable Notifications
                </button>
              </div>
            )}

            {notificationPermissionGranted && (
              <div className="mb-5 bg-green-50 dark:bg-green-950/10 border border-green-200 dark:border-green-900/30 rounded-xl p-3 flex items-center space-x-2.5 text-green-800 dark:text-green-400">
                <Check size={16} className="shrink-0" />
                <p className="text-[10px] font-bold">Simulated Notification Channel Is Active</p>
              </div>
            )}

            <div className="space-y-5">
              {/* SECTION: SHOPPING REMINDERS */}
              <div className="space-y-2">
                <h3 className={`text-[10px] font-extrabold uppercase tracking-wider ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
                  Shopping Reminders
                </h3>
                <div className={`rounded-xl border p-4 space-y-4 shadow-sm ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <ShoppingCart size={16} className="text-gray-400" />
                      <div>
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 block">List Reminders</span>
                        <span className="text-[9px] text-gray-400">Remind me to review my shopping list</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShoppingReminders(!shoppingReminders)}
                      className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 ${shoppingReminders ? "bg-[#2D6A4F]" : "bg-gray-200"}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${shoppingReminders ? "translate-x-4" : "translate-x-0"}`} />
                    </button>
                  </div>

                  {shoppingReminders && (
                    <div className="pt-3 border-t border-gray-100 dark:border-zinc-800/60 space-y-3 animate-fade-in">
                      {/* Day Chip Selector */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">Scheduled Days</span>
                        <div className="flex flex-wrap gap-1">
                          {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(day => {
                            const isSelected = selectedDays.includes(day);
                            return (
                              <button
                                key={day}
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedDays(prev => prev.filter(d => d !== day));
                                  } else {
                                    setSelectedDays(prev => [...prev, day]);
                                  }
                                }}
                                className={`text-[9px] font-extrabold px-2 py-1 rounded-md transition-colors ${
                                  isSelected 
                                    ? "bg-[#2D6A4F] text-white" 
                                    : (isDarkMode ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-750" : "bg-gray-50 text-gray-500 hover:bg-gray-100")
                                }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Time selector */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">Time</span>
                        <div 
                          className="flex items-center space-x-1 cursor-pointer hover:opacity-85"
                          onClick={() => {
                            const times = ["08:00 AM", "10:00 AM", "12:00 PM", "04:00 PM", "06:00 PM", "08:00 PM"];
                            const currentIdx = times.indexOf(selectedTime);
                            setSelectedTime(times[(currentIdx + 1) % times.length]);
                          }}
                        >
                          <Clock size={12} className="text-[#2D6A4F]" />
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{selectedTime}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION: PANTRY */}
              <div className="space-y-2">
                <h3 className={`text-[10px] font-extrabold uppercase tracking-wider ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
                  Pantry Alerts
                </h3>
                <div className={`rounded-xl border p-4 space-y-4 shadow-sm ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Sliders size={16} className="text-gray-400" />
                      <div>
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 block">Expiration Warnings</span>
                        <span className="text-[9px] text-gray-400">Notify before item shelf-life ends</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setExpirationAlerts(!expirationAlerts)}
                      className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 ${expirationAlerts ? "bg-[#2D6A4F]" : "bg-gray-200"}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${expirationAlerts ? "translate-x-4" : "translate-x-0"}`} />
                    </button>
                  </div>

                  {expirationAlerts && (
                    <div className="pt-3 border-t border-gray-100 dark:border-zinc-800/60 flex items-center justify-between animate-fade-in">
                      <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">Warn how many days before?</span>
                      <div className="flex items-center space-x-1">
                        <button 
                          disabled={daysBeforeAlert <= 1}
                          onClick={() => setDaysBeforeAlert(d => Math.max(1, d - 1))}
                          className="w-6 h-6 rounded bg-gray-100 dark:bg-zinc-800 text-xs font-bold text-[#2D6A4F] flex items-center justify-center disabled:opacity-40"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold px-2 text-gray-700 dark:text-gray-300">{daysBeforeAlert} days</span>
                        <button 
                          onClick={() => setDaysBeforeAlert(d => d + 1)}
                          className="w-6 h-6 rounded bg-gray-100 dark:bg-zinc-800 text-xs font-bold text-[#2D6A4F] flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION: RECIPES & AI */}
              <div className="space-y-2">
                <h3 className={`text-[10px] font-extrabold uppercase tracking-wider ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
                  Recipes & AI Chef
                </h3>
                <div className={`rounded-xl border p-4 space-y-4 shadow-sm ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Sparkles size={16} className="text-gray-400" />
                      <div>
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 block">Weekly AI Suggestions</span>
                        <span className="text-[9px] text-gray-400">Sunday morning menu curation</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSmartSuggestions(!smartSuggestions)}
                      className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 ${smartSuggestions ? "bg-[#2D6A4F]" : "bg-gray-200"}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${smartSuggestions ? "translate-x-4" : "translate-x-0"}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-zinc-800/60">
                    <div className="flex items-center space-x-3">
                      <BookOpen size={16} className="text-gray-400" />
                      <div>
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 block">New Recipe Ideas</span>
                        <span className="text-[9px] text-gray-400">Discover handpicked chef options</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setNewRecipeIdeas(!newRecipeIdeas)}
                      className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 ${newRecipeIdeas ? "bg-[#2D6A4F]" : "bg-gray-200"}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${newRecipeIdeas ? "translate-x-4" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* SAVE PREFERENCES BUTTON */}
              <button 
                onClick={() => {
                  alert("Notification preferences saved successfully!");
                  setActiveScreen("Settings");
                }}
                className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white py-3.5 rounded-xl text-xs font-extrabold shadow-sm transition-all active:scale-98"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* ==================== SMART AI SUGGESTIONS SCREEN ==================== */}
        {activeScreen === "Suggestions" && (
          <div className="animate-fade-in flex flex-col h-full overflow-hidden select-none">
            {/* Header */}
            <div className={`px-5 py-3 border-b flex items-center justify-between shrink-0 ${isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-gray-100"}`}>
              <button 
                onClick={() => setActiveScreen("App")}
                className={`p-2 rounded-full transition-colors ${isDarkMode ? "hover:bg-zinc-850 text-gray-300" : "hover:bg-gray-100 text-gray-700"}`}
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-sm font-black tracking-tight text-center">Smart AI Suggestions ✨</h2>
              <button 
                onClick={() => {
                  setSuggestionsAddedItems({});
                  alert("Suggestions reset!");
                }}
                className="text-[10px] font-bold text-[#2D6A4F] hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Suggestions Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 pb-20">
              {/* Hero AI Curator Card */}
              <div className="bg-gradient-to-r from-amber-500/10 to-[#2D6A4F]/10 border border-amber-500/15 p-4 rounded-2xl space-y-1">
                <div className="flex items-center space-x-1.5">
                  <Sparkles size={16} className="text-amber-500 animate-pulse" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">AI Curator Engine</span>
                </div>
                <h3 className="text-sm font-black text-gray-800 dark:text-gray-100">Curation based on your history</h3>
                <p className="text-[10px] text-gray-500 leading-normal">
                  Our system analyzed your last **5 shopping trips** and detected predictable recurring restock cycles. Review suggested items below:
                </p>
              </div>

              {/* BUNDLE: USUALLY BOUGHT TOGETHER */}
              <div className="space-y-2.5">
                <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Recommended Bundle</span>
                {(() => {
                  const bundleId = "b1";
                  const isBundleAdded = suggestionsAddedItems[bundleId];
                  const bundleItems = [
                    { name: "Organic Bananas", category: "Fruits", emoji: "🍌" },
                    { name: "Whole Milk", category: "Dairy", emoji: "🥛" },
                    { name: "Greek Yogurt", category: "Dairy", emoji: "🥛" }
                  ];

                  return (
                    <div className={`p-4 rounded-2xl border shadow-sm space-y-3.5 transition-all ${
                      isDarkMode ? "bg-zinc-900/60 border-zinc-800/60" : "bg-white border-gray-100"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-xs font-black block">Weekly Breakfast Bundle</span>
                          <span className="text-[9px] text-gray-400 block">Commonly restocked every 7 days</span>
                        </div>
                        <span className="text-[11px] font-bold text-[#2D6A4F]">$6.48</span>
                      </div>

                      {/* Bundle Items List */}
                      <div className="flex space-x-2">
                        {bundleItems.map((bi, i) => (
                          <div key={i} className={`flex-1 p-2 rounded-xl border text-center space-y-1 ${
                            isDarkMode ? "bg-zinc-950/40 border-zinc-800/40" : "bg-gray-50 border-gray-100"
                          }`}>
                            <span className="text-lg block">{bi.emoji}</span>
                            <span className="text-[9px] font-bold block truncate text-gray-700 dark:text-gray-300">{bi.name}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => {
                          if (!isBundleAdded) {
                            handleAddSuggestedItems(bundleItems);
                            setSuggestionsAddedItems(prev => ({ ...prev, [bundleId]: true }));
                          }
                        }}
                        className={`w-full py-2 rounded-xl text-[10px] font-extrabold flex items-center justify-center space-x-1.5 transition-colors ${
                          isBundleAdded 
                            ? "bg-emerald-100 text-[#2D6A4F] dark:bg-[#1B4332]/40 dark:text-emerald-400" 
                            : "bg-[#2D6A4F] text-white hover:bg-[#1B4332]"
                        }`}
                      >
                        {isBundleAdded ? (
                          <>
                            <Check size={12} className="stroke-[2.5]" />
                            <span>Added to Shopping List</span>
                          </>
                        ) : (
                          <>
                            <Plus size={12} className="stroke-[2.5]" />
                            <span>Add Breakfast Bundle (3 items)</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* SINGLE PREDICTED ITEMS LIST */}
              <div className="space-y-2.5">
                <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Predicted Restocks</span>
                <div className="space-y-2">
                  {[
                    { id: "s1", name: "Avocado", category: "Fruits", emoji: "🥑", reason: "Bought 14 days ago (avg cycle: 10 days)", price: 1.25 },
                    { id: "s2", name: "Fresh Broccoli", category: "Vegetables", emoji: "🥦", reason: "High-frequency restock (every trip)", price: 0.99 },
                    { id: "s3", name: "Gala Apples", category: "Fruits", emoji: "🍎", reason: "Running low in Pantry soon", price: 1.49 },
                    { id: "s4", name: "Sliced Bread", category: "Bakery", emoji: "🍞", reason: "Usually bought with Whole Milk", price: 2.10 }
                  ].map(item => {
                    const isAdded = suggestionsAddedItems[item.id];
                    return (
                      <div 
                        key={item.id}
                        className={`flex items-center justify-between p-3.5 rounded-xl border shadow-sm ${
                          isDarkMode ? "bg-zinc-900/60 border-zinc-800/60" : "bg-white border-gray-100"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-lg">
                            {item.emoji}
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold block">{item.name}</span>
                            <span className="text-[9px] text-gray-400 block leading-none">{item.reason}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (!isAdded) {
                              handleAddSuggestedItems([{ name: item.name, category: item.category }]);
                              setSuggestionsAddedItems(prev => ({ ...prev, [item.id]: true }));
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-colors ${
                            isAdded 
                              ? "bg-emerald-100 text-[#2D6A4F] dark:bg-[#1B4332]/40 dark:text-emerald-400" 
                              : "bg-[#2D6A4F]/10 text-[#2D6A4F] hover:bg-[#2D6A4F]/25 dark:bg-[#D8F3DC]/15 dark:text-[#D8F3DC]"
                          }`}
                        >
                          {isAdded ? "Added ✓" : "+ Add"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Sticky Import All Panel */}
            <div className={`p-4 border-t shrink-0 backdrop-blur-lg ${isDarkMode ? "bg-zinc-950/80 border-zinc-800/60" : "bg-white/80 border-white/40"}`}>
              <button
                onClick={() => {
                  const allSuggested = [
                    { name: "Organic Bananas", category: "Fruits" },
                    { name: "Whole Milk", category: "Dairy" },
                    { name: "Greek Yogurt", category: "Dairy" },
                    { name: "Avocado", category: "Fruits" },
                    { name: "Fresh Broccoli", category: "Vegetables" },
                    { name: "Gala Apples", category: "Fruits" },
                    { name: "Sliced Bread", category: "Bakery" }
                  ];
                  handleAddSuggestedItems(allSuggested);
                  setSuggestionsAddedItems({
                    b1: true, s1: true, s2: true, s3: true, s4: true
                  });
                  alert("Successfully imported all predicted restocks directly to your shopping list!");
                  setActiveScreen("App");
                  setActiveTab("Supermarket");
                }}
                className="w-full py-3 bg-[#2D6A4F] hover:bg-[#1B4332] text-white rounded-xl text-xs font-extrabold shadow-md transition-colors flex items-center justify-center space-x-1.5"
              >
                <Sparkles size={14} />
                <span>Import All AI Suggestions</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================== STANDARD APP SCREENS ==================== */}
        {activeScreen === "App" && (
          <>
            {/* ==================== HOME SCREEN ==================== */}
            {activeTab === "Home" && (
          <div className="px-5 py-3 space-y-5 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">Welcome Back</span>
                <h1 className="text-2xl font-bold tracking-tight">gabrowitt@gmail.com</h1>
              </div>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className={`p-2.5 rounded-full transition-all ${isDarkMode ? "bg-zinc-800 text-amber-400" : "bg-gray-100 text-gray-700"}`}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>

            {/* Streak Metrics Banner */}
            <div className="bg-gradient-to-r from-[#2D6A4F]/85 to-[#1B4332]/85 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg backdrop-blur-md border border-white/10">
              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <Flame size={18} className="text-[#F4A261] animate-pulse fill-[#F4A261]" />
                  <span className="font-bold text-lg">{stats.streakDays} Day Streak!</span>
                </div>
                <p className="text-[11px] text-gray-200">You are shopping sustainably with fresh ingredients.</p>
              </div>
              <div className="bg-[#D8F3DC]/20 px-3 py-1.5 rounded-xl border border-white/10 text-center backdrop-blur-sm">
                <span className="text-[9px] block uppercase text-gray-200">Total Spent</span>
                <span className="font-extrabold text-sm text-[#D8F3DC]">${stats.totalSpent.toFixed(2)}</span>
              </div>
            </div>

            {/* Aggregated Overview */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-4 rounded-2xl shadow-sm border backdrop-blur-md ${isDarkMode ? "bg-zinc-900/60 border-zinc-800/60" : "bg-white/60 border-white/40"}`}>
                <span className="text-xs text-gray-400 font-semibold block uppercase">Total Trips</span>
                <span className="text-2xl font-black text-[#2D6A4F] mt-1 block">{stats.totalTrips}</span>
              </div>
              <div className={`p-4 rounded-2xl shadow-sm border backdrop-blur-md ${isDarkMode ? "bg-zinc-900/60 border-zinc-800/60" : "bg-white/60 border-white/40"}`}>
                <span className="text-xs text-gray-400 font-semibold block uppercase">Items Bought</span>
                <span className="text-2xl font-black text-[#2D6A4F] mt-1 block">{stats.totalItemsPurchased}</span>
              </div>
            </div>

            {/* Quick Shortcuts */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setActiveTab("Pantry")}
                className={`p-3.5 rounded-2xl border shadow-sm text-left flex flex-col justify-between h-[84px] transition-all hover:scale-[1.02] active:scale-95 ${
                  isDarkMode ? "bg-zinc-900/40 border-zinc-800/60" : "bg-emerald-50/40 border-emerald-100 text-[#2D6A4F]"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Package size={18} className="text-[#2D6A4F]" />
                  <span className="text-[9px] font-extrabold uppercase bg-[#2D6A4F]/10 text-[#2D6A4F] px-1.5 py-0.5 rounded-md">
                    {pantryItems.length} Items
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-black block tracking-tight">Pantry Manager</span>
                  <span className="text-[9px] text-gray-400 block leading-tight">Track expiration dates</span>
                </div>
              </button>

              <button 
                onClick={() => setActiveScreen("Suggestions")}
                className={`p-3.5 rounded-2xl border shadow-sm text-left flex flex-col justify-between h-[84px] transition-all hover:scale-[1.02] active:scale-95 ${
                  isDarkMode ? "bg-zinc-900/40 border-zinc-800/60" : "bg-amber-50/40 border-amber-100 text-amber-800"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Lightbulb size={18} className="text-amber-500 animate-pulse" />
                  <span className="text-[9px] font-extrabold uppercase bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded-md">
                    AI Active
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-black block tracking-tight">Smart Suggestions</span>
                  <span className="text-[9px] text-gray-400 block leading-tight">Predict your next buy</span>
                </div>
              </button>
            </div>

            {/* Active Shopping List Preview Card */}
            <div className={`p-4 rounded-2xl border backdrop-blur-md shadow-md ${isDarkMode ? "bg-zinc-900/70 border-zinc-800/60" : "bg-white/70 border-white/50"}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <ShoppingCart size={18} className="text-[#2D6A4F]" />
                  <span className="font-bold text-sm">Active Shopping Trip</span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#D8F3DC] text-[#2D6A4F]">
                  {items.length} items
                </span>
              </div>
              
              {items.length === 0 ? (
                <p className="text-xs text-gray-400 py-2">Your list is currently empty. Head to the Supermarket tab to add items!</p>
              ) : (
                <div className="space-y-2 max-h-[120px] overflow-y-auto mb-3 pr-1">
                  {items.map(it => (
                    <div key={it.id} className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100/5 last:border-0">
                      <div className="flex items-center space-x-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${it.quantity > 0 ? "bg-[#2D6A4F]" : "bg-gray-300"}`}></span>
                        <span className={it.purchased ? "line-through text-gray-400" : ""}>{it.name}</span>
                      </div>
                      <span className="text-gray-400 font-mono">x{it.quantity}</span>
                    </div>
                  ))}
                </div>
              )}
              <button 
                onClick={() => setActiveTab("Supermarket")}
                className="w-full bg-[#2D6A4F] text-white py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center space-x-1.5 hover:bg-[#1B4332] transition-colors"
              >
                <span>Manage Cart</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* History Feed */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm">Shopping History</h3>
              {history.length === 0 ? (
                <p className="text-xs text-gray-400">No completed trips saved yet.</p>
              ) : (
                <div className="space-y-2">
                  {history.map(hist => (
                    <div key={hist.id} className={`p-3 rounded-xl border flex justify-between items-center backdrop-blur-sm ${isDarkMode ? "bg-zinc-900/40 border-zinc-800/50" : "bg-white/40 border-white/55"}`}>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-xs font-bold text-[#2D6A4F]">
                          <Calendar size={12} />
                          <span>{new Date(hist.purchaseDate).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[10px] text-gray-400">{hist.items.length} items purchased successfully</p>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#2D6A4F]">${hist.totalCost.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== SUPERMARKET SCREEN ==================== */}
        {activeTab === "Supermarket" && (
          <div className="flex flex-col h-full animate-fade-in">
            {/* Page Header */}
            <div className="px-5 py-3 border-b border-gray-100/10 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold tracking-tight">Supermarket</h1>
                  <p className="text-[10px] text-gray-400">Create your shopping list & check out.</p>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setActiveScreen("Suggestions")}
                    className="text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:bg-amber-500/15 dark:text-amber-400 dark:hover:bg-amber-500/25 transition-all flex items-center space-x-1 shadow-sm"
                  >
                    <Lightbulb size={12} className="animate-pulse" />
                    <span>Suggestions</span>
                  </button>
                  <button
                    onClick={() => setShowAddItem(!showAddItem)}
                    className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl transition-all duration-150 flex items-center space-x-1 shadow-sm ${
                      showAddItem 
                        ? "bg-[#2D6A4F] text-white" 
                        : "bg-[#2D6A4F]/10 text-[#2D6A4F] hover:bg-[#2D6A4F]/20 dark:bg-[#D8F3DC]/15 dark:text-[#D8F3DC] dark:hover:bg-[#D8F3DC]/25"
                    }`}
                  >
                    <span>add item +</span>
                  </button>
                </div>
              </div>

              {/* Toggled Add Item Component in the Header */}
              {showAddItem && (
                <div className="pt-2 border-t border-gray-100/5 animate-fade-in">
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="Add item (e.g., Gala Apples)"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleAddItem(newItemName, newItemCategory); }}
                      className={`flex-1 px-3 py-2 text-xs rounded-xl border outline-none ${isDarkMode ? "bg-black/40 text-white border-zinc-800/60 focus:border-[#2D6A4F]" : "bg-white/60 text-gray-900 border-gray-300/80 focus:border-[#2D6A4F]"}`}
                      autoFocus
                    />
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      className={`px-2 py-2 text-xs rounded-xl border outline-none ${isDarkMode ? "bg-black/40 text-white border-zinc-800/60" : "bg-white/60 text-gray-900 border-gray-300/80"}`}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <button 
                      onClick={() => handleAddItem(newItemName, newItemCategory)}
                      className="bg-[#2D6A4F] text-white p-2.5 rounded-xl hover:bg-[#1B4332] shadow-sm transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* List Category Quick Filters */}
            <div className="flex space-x-2 overflow-x-auto py-3 px-5 scrollbar-none select-none">
              {["All", ...CATEGORIES].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold shrink-0 transition-colors ${
                    selectedCategory === cat 
                      ? "bg-[#2D6A4F] text-white" 
                      : (isDarkMode ? "bg-zinc-800 text-gray-400" : "bg-gray-100 text-gray-600 hover:bg-gray-200")
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* List Items Container */}
            <div className="flex-1 px-4 py-2 space-y-2 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <ShoppingCart size={40} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-xs font-semibold text-gray-400">Your shopping list is clear!</p>
                  <p className="text-[10px] text-gray-400 mt-1">Add items above or import them from recipes.</p>
                </div>
              ) : (
                filteredItems.map(item => {
                  const isPurchased = item.purchased && item.quantity > 0;
                  const itemTotal = (item.quantity * item.price).toFixed(2);
                  return (
                    <div 
                      key={item.id} 
                      className={`flex items-center p-3 rounded-xl border shadow-sm backdrop-blur-md transition-all duration-200 ${
                        isPurchased 
                          ? (isDarkMode ? "bg-[#1B4332]/25 border-[#2D6A4F]/45" : "bg-[#F2F9F4]/75 border-[#C2E7D1]/80") 
                          : (isDarkMode ? "bg-zinc-900/60 border-zinc-800/60" : "bg-white/65 border-white/50")
                      }`}
                    >
                      {/* Checkbox */}
                      <button 
                        onClick={() => handleTogglePurchased(item.id)}
                        disabled={item.quantity === 0}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${
                          item.quantity === 0 ? "opacity-30 border-gray-300 cursor-not-allowed" : ""
                        } ${
                          isPurchased 
                            ? "bg-[#2D6A4F] border-[#2D6A4F]" 
                            : (isDarkMode ? "border-zinc-700" : "border-gray-300")
                        }`}
                      >
                        {isPurchased && <Check size={12} className="text-white font-black" />}
                      </button>

                      {/* Info & Pills */}
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-bold truncate ${isPurchased ? "line-through text-gray-400" : ""}`}>
                            {item.name}
                          </span>
                          <span className="text-[8px] px-1.5 py-0.5 rounded-md bg-[#D8F3DC] text-[#2D6A4F] font-semibold">
                            {item.category}
                          </span>
                        </div>

                        {/* Quantity and Price Pills */}
                        <div className="flex space-x-2 mt-2">
                          {/* Quantity Pill */}
                          <button 
                            onClick={() => openQuantityModal(item)}
                            className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[9px] font-bold border border-white/20 dark:border-zinc-800/20 ${isDarkMode ? "bg-zinc-800/60 text-gray-300" : "bg-gray-100/60 text-gray-600"}`}
                          >
                            <span>Qty:</span>
                            <span className={item.quantity > 0 ? "text-[#2D6A4F]" : "text-gray-400"}>
                              {item.quantity}
                            </span>
                            <Pencil size={8} className="text-gray-400 ml-1" />
                          </button>

                          {/* Price Pill */}
                          <button 
                            onClick={() => openPriceModal(item)}
                            className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[9px] font-bold border border-white/20 dark:border-zinc-800/20 ${isDarkMode ? "bg-zinc-800/60 text-gray-300" : "bg-gray-100/60 text-gray-600"}`}
                          >
                            <span>Price:</span>
                            <span className="text-gray-700 dark:text-gray-200">
                              ${item.price.toFixed(2)}
                            </span>
                            <Pencil size={8} className="text-gray-400 ml-1" />
                          </button>
                        </div>
                      </div>

                      {/* Total and Trash */}
                      <div className="flex items-center space-x-2">
                        <div className="text-right border-l pl-2 border-gray-100/10 min-w-[55px]">
                          <span className="text-[8px] text-gray-400 uppercase font-semibold block leading-none">Total</span>
                          <span className={`text-xs font-black leading-tight ${isPurchased ? "line-through text-gray-400" : ""}`}>
                            ${itemTotal}
                          </span>
                        </div>
                        <button 
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Check Out Bottom Panel */}
            <div className={`p-4 border-t backdrop-blur-lg ${isDarkMode ? "bg-zinc-950/80 border-zinc-800/60" : "bg-white/80 border-white/40"}`}>
              <div 
                className="flex justify-between items-center mb-3 text-xs font-bold cursor-pointer hover:opacity-85"
                onClick={() => {
                  if (items.filter(it => it.purchased && it.quantity > 0).length > 0) {
                    setShowFinishModal(true);
                  }
                }}
              >
                <span className="text-gray-400">Total Purchase:</span>
                <span className="text-sm font-black text-[#2D6A4F] hover:underline">${totalCostOfCurrentTrip.toFixed(2)}</span>
              </div>
              <button
                onClick={() => setShowFinishModal(true)}
                disabled={isFinishing || items.filter(it => it.purchased && it.quantity > 0).length === 0}
                className={`w-full py-3 rounded-xl text-xs font-extrabold text-white flex items-center justify-center space-x-2 shadow-md transition-colors ${
                  items.filter(it => it.purchased && it.quantity > 0).length === 0
                    ? "bg-gray-300 cursor-not-allowed text-gray-500 shadow-none dark:bg-zinc-800"
                    : "bg-[#2D6A4F] hover:bg-[#1B4332]"
                }`}
              >
                {isFinishing ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Saving to Cloud Database...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Finish Shopping</span>
                  </>
                )}
              </button>
              <p className="text-[9px] text-center text-gray-400 mt-2">
                * Zero quantity & unpurchased items will remain for your next trip.
              </p>
            </div>
          </div>
        )}

        {/* ==================== RECIPES SCREEN ==================== */}
        {activeTab === "Recipes" && (
          <div className="px-5 py-3 space-y-4 animate-fade-in">
            <div>
              <h1 className="text-xl font-bold tracking-tight">Healthy Recipes</h1>
              <p className="text-[10px] text-gray-400">Import recipe ingredients directly to list.</p>
            </div>

            <div className="space-y-4">
              {POPULAR_RECIPES.map(recipe => (
                <div key={recipe.id} className={`rounded-2xl border overflow-hidden shadow-sm flex flex-col backdrop-blur-md ${isDarkMode ? "bg-zinc-900/60 border-zinc-800/60" : "bg-white/65 border-white/50"}`}>
                  {/* Decorative Banner */}
                  <div className="h-16 bg-gradient-to-r from-[#2D6A4F]/90 to-[#40916C]/90 p-3 text-white flex flex-col justify-end">
                    <h3 className="text-xs font-extrabold leading-tight">{recipe.name}</h3>
                  </div>

                  {/* Recipe Details */}
                  <div className="p-4 space-y-3">
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{recipe.description}</p>
                    
                    {/* Time & Badges */}
                    <div className="flex space-x-4 text-[10px] text-gray-500 font-semibold border-y py-2 border-gray-150/10">
                      <div className="flex items-center space-x-1">
                        <Clock size={11} className="text-[#2D6A4F]" />
                        <span>Prep: {recipe.prepTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Flame size={11} className="text-orange-500" />
                        <span>{recipe.calories}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award size={11} className="text-amber-500" />
                        <span>{recipe.difficulty}</span>
                      </div>
                    </div>

                    {/* Ingredients needed */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#2D6A4F] uppercase tracking-wider block">Ingredients:</span>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-gray-400">
                        {recipe.ingredients.map((ing, i) => (
                          <div key={i} className="flex justify-between border-b border-gray-150/10 py-0.5">
                            <span className="font-semibold">{ing.name}</span>
                            <span>{ing.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleAddRecipeIngredients(recipe)}
                      className="w-full bg-[#D8F3DC]/80 text-[#1B4332] border border-[#2D6A4F]/20 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 hover:bg-[#2D6A4F] hover:text-white backdrop-blur-sm transition-all"
                    >
                      <Plus size={12} />
                      <span>Add Ingredients to List</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== MAGIC RECIPE SCREEN (AI CHEF) ==================== */}
        {activeTab === "Magic" && (
          <div className="px-5 py-3 space-y-4 animate-fade-in flex flex-col h-full">
            <div>
              <div className="flex items-center space-x-1.5">
                <ChefHat size={20} className="text-[#2D6A4F]" />
                <h1 className="text-xl font-bold tracking-tight">AI Chef Creator</h1>
              </div>
              <p className="text-[10px] text-gray-400">Weaves recipes using ingredients currently in your list!</p>
            </div>

            {isGeneratingRecipe ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4 space-y-4 animate-pulse">
                <div className="relative">
                  <ChefHat size={48} className="text-[#2D6A4F] animate-bounce" />
                  <Sparkles size={20} className="text-[#F4A261] absolute -top-1 -right-1 animate-spin" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-xs">AI Chef in the kitchen</h4>
                  <p className="text-[10px] text-gray-400 font-mono italic">{chefMessages[chefMessageIndex]}</p>
                </div>
              </div>
            ) : aiRecipe ? (
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                {/* Result Card */}
                <div className={`rounded-2xl border overflow-hidden shadow-sm flex flex-col backdrop-blur-md ${isDarkMode ? "bg-zinc-900/60 border-zinc-800/60" : "bg-white/65 border-white/50"}`}>
                  <div className="bg-[#2D6A4F] text-white p-4">
                    <div className="flex items-center space-x-1 mb-1">
                      <Sparkle size={12} className="text-amber-300 fill-amber-300" />
                      <span className="text-[8px] tracking-wider uppercase font-extrabold text-[#D8F3DC]">Custom AI Recipe</span>
                    </div>
                    <h3 className="text-sm font-black leading-tight">{aiRecipe.name}</h3>
                    <p className="text-[10px] text-gray-200 mt-1 leading-relaxed italic">"{aiRecipe.description}"</p>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Cooking Parameters */}
                    <div className="grid grid-cols-4 gap-2 text-center text-[9px] font-bold py-2 bg-gray-50 dark:bg-zinc-800 rounded-xl">
                      <div>
                        <span className="text-gray-400 block font-normal">Prep</span>
                        <span>{aiRecipe.prepTime}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-normal">Cook</span>
                        <span>{aiRecipe.cookTime}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-normal">Level</span>
                        <span className="text-green-600 dark:text-green-400">{aiRecipe.difficulty}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-normal">Cal</span>
                        <span>{aiRecipe.calories}</span>
                      </div>
                    </div>

                    {/* Ingredients list */}
                    <div className="space-y-1.5">
                      <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-[#2D6A4F]">Required Elements</h4>
                      <ul className="space-y-1 text-[10px] text-gray-400">
                        {aiRecipe.ingredients.map((ing, i) => (
                          <li key={i} className="flex justify-between border-b border-gray-100/5 py-0.5">
                            <span className="font-semibold">{ing.name}</span>
                            <span>{ing.amount}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Steps list */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-[#2D6A4F]">Cooking Method</h4>
                      <ol className="space-y-1.5 text-[10px] text-gray-400 list-decimal pl-4">
                        {aiRecipe.steps.map((step, i) => (
                          <li key={i} className="leading-relaxed pl-1">{step}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Chef Tip Card */}
                    <div className="p-3 bg-[#D8F3DC]/20 border border-[#2D6A4F]/20 rounded-xl">
                      <span className="text-[10px] font-extrabold text-[#1B4332] block">Chef's Pro-Tip:</span>
                      <p className="text-[9px] text-[#2D6A4F] leading-relaxed mt-0.5 italic">"{aiRecipe.chefTips}"</p>
                    </div>

                    <button
                      onClick={handleGenerateMagicRecipe}
                      className="w-full bg-[#2D6A4F] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#1B4332] transition-colors"
                    >
                      Regenerate Another Meal
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4 space-y-4">
                <div className="p-4 bg-[#D8F3DC] text-[#2D6A4F] rounded-full">
                  <ChefHat size={32} />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-xs">Let AI Chef Cook</h4>
                  <p className="text-[10px] text-gray-400 max-w-xs leading-relaxed">
                    Uses the actual ingredients currently added in your list with quantity &gt; 0 to compile a custom recipe in real-time.
                  </p>
                </div>

                <div className="p-3 border border-white/10 dark:border-zinc-800/40 rounded-xl w-full text-left backdrop-blur-sm bg-gray-50/50 dark:bg-zinc-900/40">
                  <span className="text-[9px] block text-gray-400 font-bold uppercase tracking-wider mb-1.5">Chef's Pantry Ingredients:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {items.filter(it => it.quantity > 0).length === 0 ? (
                      <span className="text-[10px] text-red-500 italic font-semibold">Your pantry list is currently empty! Added items will show here.</span>
                    ) : (
                      items.filter(it => it.quantity > 0).map(it => (
                        <span key={it.id} className="text-[9px] px-2 py-0.5 rounded-full bg-[#D8F3DC] text-[#2D6A4F] font-semibold">
                          {it.name} (x{it.quantity})
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {recipeError && (
                  <p className="text-[10px] text-red-500 bg-red-50 dark:bg-red-900/10 p-2.5 rounded-xl leading-relaxed text-left">
                    {recipeError}
                  </p>
                )}

                <button
                  onClick={handleGenerateMagicRecipe}
                  disabled={items.filter(it => it.quantity > 0).length === 0}
                  className={`w-full py-3 rounded-xl text-xs font-extrabold text-white flex items-center justify-center space-x-2 shadow-md transition-colors ${
                    items.filter(it => it.quantity > 0).length === 0
                      ? "bg-gray-300 dark:bg-zinc-800 cursor-not-allowed text-gray-500 shadow-none"
                      : "bg-[#2D6A4F] hover:bg-[#1B4332]"
                  }`}
                >
                  <Sparkles size={14} />
                  <span>Ask AI Chef to Compile</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==================== PROFILE SCREEN ==================== */}
        {activeTab === "Profile" && (
          <div className="animate-fade-in -mx-5 -mt-10 pb-6">
            {/* Full-Bleed Emerald Green Header */}
            <div className="bg-[#2D6A4F] pt-12 pb-10 px-5 flex flex-col items-center justify-center text-center">
              {/* Avatar Circle */}
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl font-black text-[#2D6A4F] shadow-lg border-2 border-white/35 transition-transform hover:scale-105 duration-200">
                GW
              </div>
              
              {/* User Info */}
              <h2 className="text-white text-lg font-black mt-3 leading-tight">Gabriel Witt</h2>
              <p className="text-white/75 text-xs mt-1">gabrowitt@gmail.com</p>

              {/* Edit Profile Pill */}
              <button 
                onClick={() => alert("Edit Profile modal initiated in sandbox.")}
                className="mt-3.5 border-1.5 border-white rounded-full px-4 py-1 text-[10px] font-extrabold text-white tracking-wide hover:bg-white/10 active:scale-95 transition-all"
              >
                Edit Profile
              </button>
            </div>

            {/* Overlapping Content Area */}
            <div className={`-mt-5 rounded-t-[24px] px-4 pt-6 space-y-6 relative z-10 ${isDarkMode ? "bg-zinc-950" : "bg-[#F2F2F7]"}`}>
              
              {/* STATS SECTION */}
              <div className="space-y-3">
                <h3 className={`text-xs font-extrabold uppercase tracking-wider ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
                  Your Activity
                </h3>
                
                {/* 2x2 Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Stat Card 1 */}
                  <div className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm border ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}>
                    <span className="text-2xl mb-1.5">🍳</span>
                    <span className="text-xl font-black text-[#2D6A4F]">12</span>
                    <span className="text-[10px] font-medium text-gray-400 mt-0.5">Recipes Saved</span>
                  </div>

                  {/* Stat Card 2 */}
                  <div className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm border ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}>
                    <span className="text-2xl mb-1.5">📋</span>
                    <span className="text-xl font-black text-[#2D6A4F]">5</span>
                    <span className="text-[10px] font-medium text-gray-400 mt-0.5">Lists Completed</span>
                  </div>

                  {/* Stat Card 3 */}
                  <div className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm border ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}>
                    <span className="text-2xl mb-1.5">📦</span>
                    <span className="text-xl font-black text-[#2D6A4F]">34</span>
                    <span className="text-[10px] font-medium text-gray-400 mt-0.5">Pantry Items</span>
                  </div>

                  {/* Stat Card 4 */}
                  <div className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm border ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}>
                    <span className="text-2xl mb-1.5">💰</span>
                    <span className="text-xl font-black text-[#2D6A4F]">$245</span>
                    <span className="text-[10px] font-medium text-gray-400 mt-0.5">Total Tracked</span>
                  </div>
                </div>
              </div>

              {/* RECENT RECIPES */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className={`text-xs font-extrabold uppercase tracking-wider ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
                    Recent Recipes
                  </h3>
                  <button className="text-[11px] font-bold text-[#2D6A4F] flex items-center space-x-1 hover:underline">
                    <span>See all</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Horizontal Recipe Scroll */}
                <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none select-none">
                  {[
                    { title: "Honey Sesame Chicken", color: "from-[#40916C] to-[#52B788]", time: "30 min" },
                    { title: "Fluffy Pancakes", color: "from-[#52B788] to-[#74C69D]", time: "15 min" },
                    { title: "Classic Carbonara", color: "from-[#1B4332] to-[#2D6A4F]", time: "20 min" }
                  ].map((recipe, index) => (
                    <div 
                      key={index}
                      className={`w-[115px] rounded-xl overflow-hidden shadow-sm border shrink-0 transition-all active:scale-95 cursor-pointer ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}
                    >
                      <div className={`h-[68px] bg-gradient-to-br ${recipe.color} p-2 flex flex-col justify-between`}>
                        <span className="text-[8px] bg-black/40 text-white px-1.5 py-0.5 rounded-md font-bold self-start">
                          {recipe.time}
                        </span>
                      </div>
                      <div className="p-2">
                        <span className="text-[10px] font-bold line-clamp-2 leading-tight block text-gray-800 dark:text-gray-100">
                          {recipe.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* NAVIGATION MENU CARD */}
              <div className={`rounded-2xl border divide-y overflow-hidden shadow-sm ${isDarkMode ? "bg-zinc-900 border-zinc-800 divide-zinc-800" : "bg-white border-gray-100 divide-gray-50"}`}>
                {/* Row 1: Settings */}
                <button 
                  onClick={() => setActiveScreen("Settings")}
                  className="w-full h-13 px-4 flex items-center justify-between transition-colors hover:bg-gray-50 dark:hover:bg-zinc-850"
                >
                  <div className="flex items-center space-x-3">
                    <Settings size={18} className="text-gray-400" />
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Settings</span>
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                </button>

                {/* Row 2: Notifications */}
                <button 
                  onClick={() => setActiveScreen("Notifications")}
                  className="w-full h-13 px-4 flex items-center justify-between transition-colors hover:bg-gray-50 dark:hover:bg-zinc-850"
                >
                  <div className="flex items-center space-x-3">
                    <Bell size={18} className="text-gray-400" />
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Notifications</span>
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                </button>

                {/* Row 2b: Pantry Manager */}
                <button 
                  onClick={() => { setActiveTab("Pantry"); setActiveScreen("App"); }}
                  className="w-full h-13 px-4 flex items-center justify-between transition-colors hover:bg-gray-50 dark:hover:bg-zinc-850"
                >
                  <div className="flex items-center space-x-3">
                    <Package size={18} className="text-[#2D6A4F]" />
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Pantry Manager</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] text-gray-400 font-bold">{pantryItems.length} items</span>
                    <ChevronRight size={14} className="text-gray-300" />
                  </div>
                </button>

                {/* Row 2c: AI Smart Suggestions */}
                <button 
                  onClick={() => setActiveScreen("Suggestions")}
                  className="w-full h-13 px-4 flex items-center justify-between transition-colors hover:bg-gray-50 dark:hover:bg-zinc-850"
                >
                  <div className="flex items-center space-x-3">
                    <Lightbulb size={18} className="text-amber-500" />
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">AI Smart Suggestions</span>
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                </button>

                {/* Row 3: Privacy */}
                <button className="w-full h-13 px-4 flex items-center justify-between transition-colors hover:bg-gray-50 dark:hover:bg-zinc-850">
                  <div className="flex items-center space-x-3">
                    <Shield size={18} className="text-gray-400" />
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Privacy</span>
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                </button>

                {/* Row 4: Rate FreshCart */}
                <button className="w-full h-13 px-4 flex items-center justify-between transition-colors hover:bg-gray-50 dark:hover:bg-zinc-850">
                  <div className="flex items-center space-x-3">
                    <Star size={18} className="text-gray-400" />
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Rate FreshCart</span>
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                </button>
              </div>

              {/* DANGER ROW CARD (Sign Out) */}
              <div className={`rounded-2xl border overflow-hidden shadow-sm ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}>
                <button 
                  onClick={() => {
                    signOut(auth).then(() => {
                      setActiveScreen("Login");
                    });
                  }}
                  className="w-full h-13 px-4 flex items-center space-x-3 transition-colors hover:bg-red-50/10"
                >
                  <LogOut size={18} className="text-red-500" />
                  <span className="text-xs font-bold text-red-500">Sign Out</span>
                </button>
              </div>

              {/* DEVELOPER SANDBOX CONTROLS */}
              <div className={`p-4 rounded-2xl border space-y-3 shadow-sm ${isDarkMode ? "bg-zinc-900/40 border-zinc-800/40" : "bg-white/45 border-gray-100"}`}>
                <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                  Developer Sandbox Controls
                </h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setItems(DEFAULT_ITEMS);
                      setStats({ totalTrips: 3, totalSpent: 42.50, totalItemsPurchased: 18, streakDays: 4 });
                      setHistory([
                        {
                          id: "h1",
                          purchaseDate: Date.now() - 86400000 * 2,
                          items: [
                            { name: "Organic Bananas", category: "Fruits", quantity: 3, price: 0.89 },
                            { name: "Whole Milk", category: "Dairy", quantity: 1, price: 3.49 }
                          ],
                          totalCost: 6.16
                        }
                      ]);
                      alert("Seeded developer dummy data to simulation local storage!");
                    }}
                    className="flex-1 bg-[#2D6A4F]/10 text-[#2D6A4F] text-[10px] py-2 rounded-xl font-extrabold hover:bg-[#2D6A4F]/20 active:scale-95 transition-all"
                  >
                    Reset & Seed
                  </button>
                  <button
                    onClick={() => {
                      setItems([]);
                      setHistory([]);
                      setStats({ totalTrips: 0, totalSpent: 0, totalItemsPurchased: 0, streakDays: 0 });
                      alert("Wiped simulation local storage!");
                    }}
                    className="flex-1 bg-red-100 text-red-700 dark:bg-red-950/20 text-[10px] py-2 rounded-xl font-extrabold hover:bg-red-200 active:scale-95 transition-all"
                  >
                    Wipe Data
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowSplash(true);
                  }}
                  className="w-full bg-[#2D6A4F] text-white text-[10px] py-2.5 rounded-xl font-extrabold hover:bg-[#1B4332] active:scale-95 transition-all shadow-sm flex items-center justify-center space-x-1.5"
                >
                  <span>Replay Splash Screen Simulation</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ==================== PANTRY SCREEN ==================== */}
        {activeTab === "Pantry" && (
          <div className="px-5 py-3 space-y-4 animate-fade-in flex flex-col h-full overflow-hidden">
            {/* Header Row */}
            <div className="flex items-center justify-between pb-1">
              <div>
                <h1 className="text-xl font-bold tracking-tight">Pantry Manager 🥗</h1>
                <p className="text-[10px] text-gray-400">Track and manage your kitchen inventory.</p>
              </div>
              <button 
                onClick={handleOpenAddPantryModal}
                className="p-2.5 bg-[#2D6A4F]/10 hover:bg-[#2D6A4F]/20 text-[#2D6A4F] rounded-xl transition-colors shadow-sm flex items-center justify-center"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Expiration Banner */}
            {(() => {
              const expiringCount = pantryItems.filter(it => {
                if (!it.expiryDate) return false;
                const daysLeft = Math.ceil((it.expiryDate - Date.now()) / 86400000);
                return daysLeft <= 7;
              }).length;

              if (expiringCount > 0) {
                return (
                  <button 
                    onClick={() => setPantryFilterExpiringOnly(!pantryFilterExpiringOnly)}
                    className={`w-full p-3.5 rounded-xl flex items-center justify-between transition-all border ${
                      pantryFilterExpiringOnly 
                        ? "bg-amber-100 border-amber-300 dark:bg-amber-950/20 dark:border-amber-900/60 text-amber-800 dark:text-amber-400" 
                        : "bg-amber-50 border-amber-100 dark:bg-amber-950/10 dark:border-amber-950/20 text-amber-800 dark:text-amber-400"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Info size={16} className="text-amber-600 dark:text-amber-400" />
                      <span className="text-xs font-bold">{expiringCount} {expiringCount === 1 ? 'item' : 'items'} expiring soon</span>
                    </div>
                    <span className="text-[11px] font-extrabold underline">
                      {pantryFilterExpiringOnly ? "Show All" : "Filter Expiry"}
                    </span>
                  </button>
                );
              }
              return null;
            })()}

            {/* Stats Row */}
            {(() => {
              const total = pantryItems.length;
              const categories = new Set(pantryItems.map(it => it.category)).size;
              const expiring = pantryItems.filter(it => {
                if (!it.expiryDate) return false;
                const days = Math.ceil((it.expiryDate - Date.now()) / 86400000);
                return days <= 7;
              }).length;

              return (
                <div className="flex space-x-2 text-[10px] font-bold">
                  <div className={`px-3 py-1.5 rounded-full border ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-gray-300" : "bg-white border-gray-100 text-gray-600 shadow-sm"}`}>
                    {total} items
                  </div>
                  <div className={`px-3 py-1.5 rounded-full border ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-gray-300" : "bg-white border-gray-100 text-gray-600 shadow-sm"}`}>
                    {categories} categories
                  </div>
                  {expiring > 0 && (
                    <div className="px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/40">
                      {expiring} expiring
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Search Bar */}
            <div className={`flex items-center h-10 px-3 rounded-xl border ${isDarkMode ? "bg-black/40 border-zinc-800" : "bg-white border-gray-100 shadow-sm"}`}>
              <Search size={14} className="text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search pantry..." 
                value={pantrySearchQuery}
                onChange={(e) => setPantrySearchQuery(e.target.value)}
                className="bg-transparent text-xs outline-none border-none w-full text-current"
              />
              {pantrySearchQuery && (
                <button onClick={() => setPantrySearchQuery("")} className="text-gray-400 hover:text-gray-600">
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Category Selection */}
            <div className="flex space-x-2 overflow-x-auto py-1 scrollbar-none select-none">
              {["All", ...CATEGORIES].map(cat => {
                const isSelected = pantrySelectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setPantrySelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold shrink-0 transition-colors ${
                      isSelected 
                        ? "bg-[#2D6A4F] text-white" 
                        : (isDarkMode ? "bg-zinc-800 text-gray-400" : "bg-gray-100 text-gray-600 hover:bg-gray-200")
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Pantry List Scroll View */}
            <div className="flex-1 overflow-y-auto pr-1 pb-24 space-y-3">
              {(() => {
                // Filter items
                const filtered = pantryItems.filter(item => {
                  const matchesSearch = item.name.toLowerCase().includes(pantrySearchQuery.toLowerCase());
                  const matchesCategory = pantrySelectedCategory === "All" || item.category === pantrySelectedCategory;
                  
                  let matchesExpiring = true;
                  if (pantryFilterExpiringOnly) {
                    if (!item.expiryDate) {
                      matchesExpiring = false;
                    } else {
                      const daysLeft = Math.ceil((item.expiryDate - Date.now()) / 86400000);
                      matchesExpiring = daysLeft <= 7;
                    }
                  }

                  return matchesSearch && matchesCategory && matchesExpiring;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-12 px-4">
                      <Package size={40} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-xs font-semibold text-gray-400">Pantry is clear!</p>
                      <p className="text-[10px] text-gray-400 mt-1">Add items manually or checkout from list.</p>
                    </div>
                  );
                }

                // Group items by category
                const groups: Record<string, any[]> = {};
                filtered.forEach(item => {
                  const cat = item.category || "Other";
                  if (!groups[cat]) groups[cat] = [];
                  groups[cat].push(item);
                });

                return Object.keys(groups).map(catName => (
                  <div key={catName} className="space-y-1.5">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block px-1">{catName}</span>
                    <div className="space-y-1.5">
                      {groups[catName].map(item => {
                        const daysLeft = item.expiryDate 
                          ? Math.ceil((item.expiryDate - Date.now()) / 86400000)
                          : null;

                        let expiryStyle = "text-gray-400";
                        let expiryLabel = "Good Shelf Life";
                        if (daysLeft !== null) {
                          const dateStr = new Date(item.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          if (daysLeft <= 0) {
                            expiryStyle = "text-red-500 font-bold bg-red-100/50 dark:bg-red-950/20 px-1.5 py-0.5 rounded";
                            expiryLabel = "Expired 🔴";
                          } else if (daysLeft <= 3) {
                            expiryStyle = "text-red-500 font-bold bg-red-100/50 dark:bg-red-950/20 px-1.5 py-0.5 rounded";
                            expiryLabel = `Exp: ${dateStr} 🔴`;
                          } else if (daysLeft <= 7) {
                            expiryStyle = "text-amber-500 font-semibold bg-amber-100/50 dark:bg-amber-950/10 px-1.5 py-0.5 rounded";
                            expiryLabel = `Exp: ${dateStr} ⚠️`;
                          } else {
                            expiryStyle = "text-gray-400";
                            expiryLabel = `Exp: ${dateStr}`;
                          }
                        }

                        const categoryEmojis: Record<string, string> = {
                          Dairy: '🥛',
                          Vegetables: '🥦',
                          'Meat & Seafood': '🥩',
                          Fruits: '🍎',
                          Bakery: '🍞',
                          Pantry: '🧊',
                          Beverages: '🥤',
                          Other: '📦'
                        };
                        const emoji = categoryEmojis[item.category] || '📦';

                        return (
                          <div 
                            key={item.id}
                            className={`flex items-center justify-between p-3 rounded-xl border shadow-sm backdrop-blur-md ${
                              isDarkMode ? "bg-zinc-900/60 border-zinc-800/60" : "bg-white/65 border-white/50"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-lg">
                                {emoji}
                              </div>
                              <div>
                                <span className="text-xs font-bold block">{item.name}</span>
                                <span className="text-[10px] text-gray-400 font-semibold">Qty: {item.quantity} {item.unit || "units"}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3 text-right">
                              <div className="space-y-0.5">
                                <span className={`text-[10px] block leading-none ${expiryStyle}`}>{expiryLabel}</span>
                              </div>
                              <div className="flex space-x-1.5 border-l pl-2 border-gray-150/15">
                                <button 
                                  onClick={() => handleOpenEditPantryModal(item)}
                                  className="p-1 hover:text-[#2D6A4F] text-gray-400 transition-colors"
                                >
                                  <Pencil size={12} />
                                </button>
                                <button 
                                  onClick={() => handleDeletePantryItem(item.id)}
                                  className="p-1 hover:text-red-500 text-gray-400 transition-colors"
                                >
                                  <Trash size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Floating FAB Action Button */}
            <button
              onClick={handleOpenAddPantryModal}
              className="absolute bottom-24 right-5 w-12 h-12 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all z-45"
            >
              <Plus size={22} className="stroke-[2.5]" />
            </button>
          </div>
        )}
          </>
        )}

      </div>

      {/* ==================== iOS BOTTOM TABS BAR (Height 83px) ==================== */}
      {activeScreen === "App" && (
        <div className={`absolute bottom-0 inset-x-0 h-[83px] border-t px-6 flex items-center justify-between select-none z-50 backdrop-blur-lg ${isDarkMode ? "bg-zinc-950/75 border-zinc-800/60" : "bg-white/75 border-white/50 shadow-[0_-8px_24px_rgba(0,0,0,0.03)]"}`}>
          {[
            { id: "Home", label: "Home", icon: House },
            { id: "Supermarket", label: "Supermarket", icon: ShoppingCart },
            { id: "Recipes", label: "Recipes", icon: BookOpen },
            { id: "Magic", label: "AI Chef", icon: Sparkle },
            { id: "Pantry", label: "Pantry", icon: Package },
            { id: "Profile", label: "Profile", icon: User },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex flex-col items-center justify-center space-y-1 py-2 cursor-pointer group"
              >
                <Icon 
                  size={20} 
                  className={`transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-[#2D6A4F] stroke-[2.5]" : "text-gray-400 stroke-[1.5] group-hover:text-gray-600"
                  }`}
                />
                <span className={`text-[9px] font-bold ${isActive ? "text-[#2D6A4F]" : "text-gray-400 group-hover:text-gray-600"}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ==================== EDIT ITEM MODAL BOTTOM SHEET ==================== */}
      {editModalItem && (
        <div className="absolute inset-0 bg-black/55 z-[99] flex items-end animate-fade-in backdrop-blur-xs">
          {/* Sheet container - covers ~60% screen, White, borderTopRadius 24 */}
          <div className={`w-full max-h-[75%] rounded-t-3xl shadow-2xl overflow-hidden flex flex-col ${isDarkMode ? "bg-[#1C1C1E] text-white" : "bg-white text-[#1C1C1E]"}`}>
            {/* Drag Handle */}
            <div className="w-10 h-1 bg-gray-300 dark:bg-zinc-700 rounded-full mx-auto mt-2.5 mb-1" />

            {/* ITEM HEADER */}
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                  style={{
                    backgroundColor: 
                      editModalItem.category === 'Fruits' ? '#FFF9DB' :
                      editModalItem.category === 'Vegetables' ? '#E5F9EC' :
                      editModalItem.category === 'Dairy' ? '#E5F1FF' :
                      editModalItem.category === 'Bakery' ? '#FFF2E5' :
                      editModalItem.category === 'Meat & Seafood' ? '#FFEBEA' :
                      editModalItem.category === 'Beverages' ? '#F5E6FF' :
                      editModalItem.category === 'Pantry' ? '#EAF9FF' : '#F2F2F7'
                  }}
                >
                  <span>
                    {editModalItem.category === 'Fruits' ? '🍎' :
                     editModalItem.category === 'Vegetables' ? '🥦' :
                     editModalItem.category === 'Dairy' ? '🥛' :
                     editModalItem.category === 'Bakery' ? '🍞' :
                     editModalItem.category === 'Meat & Seafood' ? '🥩' :
                     editModalItem.category === 'Beverages' ? '🥤' :
                     editModalItem.category === 'Pantry' ? '🧊' : '📦'}
                  </span>
                </div>
                <div>
                  <h3 className="font-extrabold text-[15px] leading-tight">{editModalItem.name}</h3>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{editModalItem.category}</span>
                </div>
              </div>
              <button 
                onClick={() => setEditModalItem(null)} 
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
              >
                <X size={14} className="text-gray-500 dark:text-gray-300" />
              </button>
            </div>

            {/* DIVIDER */}
            <div className="h-[1px] bg-gray-100 dark:bg-zinc-800 w-full" />

            {/* Scrolling contents to fit screen height comfortably */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-5">
              {/* QUANTITY SECTION */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-500 block">Quantity</label>
                
                {/* STEPPER ROW */}
                <div className="flex items-center justify-center space-x-6 py-1">
                  <button 
                    onClick={() => setEditQty(prev => Math.max(1, prev - 1))}
                    className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-xl flex items-center justify-center hover:opacity-80 transition-opacity"
                  >
                    <Minus size={18} className="stroke-[2.5]" />
                  </button>
                  <span className="text-2xl font-black min-w-[40px] text-center">{editQty}</span>
                  <button 
                    onClick={() => setEditQty(prev => prev + 1)}
                    className="w-12 h-12 bg-[#D8F3DC] text-[#2D6A4F] rounded-xl flex items-center justify-center hover:opacity-80 transition-opacity"
                  >
                    <Plus size={18} className="stroke-[2.5]" />
                  </button>
                </div>

                {/* UNIT CHIPS */}
                <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                  {['units', 'kg', 'g', 'lb', 'L', 'ml', 'pack'].map((u) => {
                    const isSelected = editUnit === u;
                    return (
                      <button
                        key={u}
                        onClick={() => setEditUnit(u)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold transition-colors ${
                          isSelected 
                            ? "bg-[#D8F3DC] text-[#2D6A4F]" 
                            : (isDarkMode ? "bg-zinc-800 text-zinc-400 hover:text-zinc-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200")
                        }`}
                      >
                        {u}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PRICE SECTION */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-500 block">Price per unit</label>
                <div className="flex items-center h-12 bg-gray-100 dark:bg-zinc-800 rounded-xl px-4 relative">
                  <span className="text-sm font-bold text-gray-500 mr-1.5">$</span>
                  <input 
                    type="text" 
                    placeholder="0.00"
                    value={editPrice}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, '');
                      setEditPrice(val);
                    }}
                    className="bg-transparent text-sm font-bold outline-none border-none w-full text-current"
                  />
                </div>
                
                {/* LIVE TOTAL */}
                <p className="text-xs font-bold text-[#2D6A4F]">
                  Total: <span className="font-extrabold">${(editQty * (parseFloat(editPrice) || 0)).toFixed(2)}</span>
                </p>
              </div>

              {/* BUTTONS ROW */}
              <div className="flex gap-3 pt-2 pb-6">
                <button
                  onClick={() => setEditModalItem(null)}
                  className="flex-1 h-12 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-extrabold hover:bg-gray-200 dark:hover:bg-zinc-750 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditModalChanges}
                  className="flex-[2] h-12 bg-[#2D6A4F] text-white rounded-xl text-xs font-extrabold shadow-md hover:bg-[#1B4332] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== WEB FINISH SHOPPING CONFIRMATION MODAL ==================== */}
      {showFinishModal && (
        <div className="absolute inset-0 bg-black/55 z-[999] flex items-center justify-center p-4 animate-fade-in backdrop-blur-xs">
          <div className={`w-full max-w-[320px] rounded-3xl p-6 shadow-2xl flex flex-col relative transition-all border ${isDarkMode ? "bg-[#1C1C1E] text-white border-zinc-800/60" : "bg-white text-gray-900 border-gray-100"}`}>
            
            {/* ICON (centered) */}
            <div className="w-16 h-16 rounded-full bg-[#D8F3DC] flex items-center justify-center mx-auto mb-4">
              <ShoppingCart size={28} className="text-[#2D6A4F] stroke-[2.5]" />
            </div>

            {/* TITLE */}
            <h3 className="font-extrabold text-base text-center leading-snug">Finish Shopping?</h3>

            {/* SUMMARY ROWS */}
            <div className="mt-4 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className={`${isDarkMode ? "text-zinc-400" : "text-gray-500"} font-medium`}>Items purchased</span>
                <span className="font-extrabold text-[#2D6A4F]">
                  {items.filter(it => it.purchased && it.quantity > 0).reduce((sum, it) => sum + it.quantity, 0)} items
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className={`${isDarkMode ? "text-zinc-400" : "text-gray-500"} font-medium`}>List total</span>
                <span className="font-extrabold text-[#2D6A4F]">${totalCostOfCurrentTrip.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className={`${isDarkMode ? "text-zinc-400" : "text-gray-500"} font-medium`}>Time spent</span>
                <span className={`font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>45 minutes</span>
              </div>
            </div>

            {/* STORE INPUT */}
            <div className="mt-4 space-y-1.5 text-left">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide block">Store name (optional)</label>
              <input 
                type="text" 
                placeholder="e.g. Walmart" 
                className={`w-full h-11 px-3.5 rounded-xl text-xs font-bold outline-none border-none transition-colors ${isDarkMode ? "bg-zinc-800 text-white placeholder-zinc-500 focus:bg-zinc-750" : "bg-gray-100 text-gray-900 placeholder-gray-400 focus:bg-gray-200"}`}
                value={finishStoreName}
                onChange={(e) => setFinishStoreName(e.target.value)}
              />
            </div>

            {/* DIVIDER */}
            <div className={`h-[1px] my-4 w-full ${isDarkMode ? "bg-zinc-800/70" : "bg-gray-100"}`} />

            {/* PANTRY TOGGLE ROW */}
            <div className="flex justify-between items-center text-left">
              <div className="flex-1 pr-3">
                <h4 className="text-xs font-extrabold">Move to Pantry?</h4>
                <p className="text-[10px] text-gray-400 leading-normal mt-0.5">Add purchased items to your pantry</p>
              </div>
              <div 
                onClick={() => setFinishMoveToPantry(!finishMoveToPantry)}
                className={`w-10 h-6 rounded-full p-0.5 cursor-pointer transition-colors duration-200 flex items-center shrink-0 ${finishMoveToPantry ? "bg-[#2D6A4F]" : "bg-gray-300 dark:bg-zinc-700"}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${finishMoveToPantry ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="mt-5 flex flex-col gap-2">
              <button 
                onClick={() => handleFinishShopping(finishStoreName, finishMoveToPantry)}
                disabled={isFinishing}
                className="w-full h-12 bg-[#2D6A4F] text-white rounded-xl text-xs font-extrabold shadow-md hover:bg-[#1B4332] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isFinishing ? (
                  <>
                    <RefreshCw size={14} className="animate-spin text-white" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Finish Shopping ✓</span>
                )}
              </button>
              <button 
                onClick={() => setShowFinishModal(false)}
                disabled={isFinishing}
                className={`w-full h-11 rounded-xl text-xs font-extrabold active:scale-[0.98] transition-all ${isDarkMode ? "bg-zinc-850 text-zinc-300 hover:bg-zinc-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
