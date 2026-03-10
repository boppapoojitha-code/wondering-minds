// --- App State ---
const APP_ID = '900da95e';
const APP_KEY = '40698503668e0bb3897581f4766d77f9';

let recipesDB = [];
let isLoading = false;


// UI Translations
const uiTranslations = {
    en: {
        "t-hero-title": "What's in your fridge?",
        "t-hero-subtitle": "Enter your ingredients and let us create magic.",
        "t-selected-ingredients": "Your Ingredients:",
        "t-no-ingredients": "No ingredients added yet.",
        "t-categories": "Categories",
        "t-cuisines": "Cuisines",
        "t-suggested-recipes": "Suggested Recipes",
        "t-recipes-found": "recipes found",
        "btn-add": "Add",
        "placeholder": "e.g., Tomato, Chicken, Garlic..."
    },
    es: {
        "t-hero-title": "¿Qué hay en tu refrigerador?",
        "t-hero-subtitle": "Ingresa tus ingredientes y déjanos crear magia.",
        "t-selected-ingredients": "Tus Ingredientes:",
        "t-no-ingredients": "Aún no hay ingredientes.",
        "t-categories": "Categorías",
        "t-cuisines": "Cocinas",
        "t-suggested-recipes": "Recetas Sugeridas",
        "t-recipes-found": "recetas encontradas",
        "btn-add": "Añadir",
        "placeholder": "ej., Tomate, Pollo, Ajo..."
    },
    fr: {
        "t-hero-title": "Qu'y a-t-il dans votre frigo ?",
        "t-hero-subtitle": "Entrez vos ingrédients et laissez-nous créer la magie.",
        "t-selected-ingredients": "Vos Ingrédients :",
        "t-no-ingredients": "Aucun ingrédient ajouté pour l'instant.",
        "t-categories": "Catégories",
        "t-cuisines": "Cuisines",
        "t-suggested-recipes": "Recettes Suggérées",
        "t-recipes-found": "recettes trouvées",
        "btn-add": "Ajouter",
        "placeholder": "ex., Tomate, Poulet, Ail..."
    },
    de: {
        "t-hero-title": "Was ist in deinem Kühlschrank?",
        "t-hero-subtitle": "Gib deine Zutaten ein und wir zaubern etwas.",
        "t-selected-ingredients": "Deine Zutaten:",
        "t-no-ingredients": "Noch keine Zutaten hinzugefügt.",
        "t-categories": "Kategorien",
        "t-cuisines": "Küchen",
        "t-suggested-recipes": "Vorgeschlagene Rezepte",
        "t-recipes-found": "Rezepte gefunden",
        "btn-add": "Hinzufügen",
        "placeholder": "z.B., Tomate, Huhn, Knoblauch..."
    },
    it: {
        "t-hero-title": "Cosa c'è nel tuo frigo?",
        "t-hero-subtitle": "Inserisci i tuoi ingredienti e lasciaci creare la magia.",
        "t-selected-ingredients": "I Tuoi Ingredienti:",
        "t-no-ingredients": "Nessun ingrediente aggiunto.",
        "t-categories": "Categorie",
        "t-cuisines": "Cucine",
        "t-suggested-recipes": "Ricette Suggerite",
        "t-recipes-found": "ricette trovate",
        "btn-add": "Aggiungi",
        "placeholder": "es., Pomodoro, Pollo, Aglio..."
    },
    hi: {
        "t-hero-title": "आपके फ्रिज में क्या है?",
        "t-hero-subtitle": "अपनी सामग्री दर्ज करें और हमें जादू करने दें।",
        "t-selected-ingredients": "आपकी सामग्री:",
        "t-no-ingredients": "अभी तक कोई सामग्री नहीं जोड़ी गई।",
        "t-categories": "श्रेणियां",
        "t-cuisines": "व्यंजन",
        "t-suggested-recipes": "सुझाई गई रेसिपी",
        "t-recipes-found": "रेसिपी मिलीं",
        "btn-add": "जोड़ें",
        "placeholder": "उदा., टमाटर, चिकन, लहसुन..."
    },
    te: {
        "t-hero-title": "మీ ఫ్రిజ్‌లో ఏముంది?",
        "t-hero-subtitle": "మీ వద్ద ఉన్న పదార్థాలను నమోదు చేయండి మరియు మ్యాజిక్ ప్రారంభనివ్వండి.",
        "t-selected-ingredients": "మీ పదార్థాలు:",
        "t-no-ingredients": "ఇంకా ఏ పదార్థాలు జతచేయబడలేదు.",
        "t-categories": "కేటగిరీలు",
        "t-cuisines": "వంటకాలు",
        "t-suggested-recipes": "సూచించిన వంటకాలు",
        "t-recipes-found": "వంటకాలు కనుగొనబడ్డాయి",
        "btn-add": "జతచేయు",
        "placeholder": "ఉదా., టమోటా, చికెన్, వెల్లుల్లి..."
    }
};

// State
let selectedIngredients = [];
let currentCategory = "All";
let currentLanguage = "en";

// DOM Elements
const ingredientInput = document.getElementById('ingredientInput');
const autocompleteList = document.getElementById('autocompleteList');
const addIngredientBtn = document.getElementById('addIngredientBtn');
const selectedIngredientsContainer = document.getElementById('selectedIngredients');
const categoryFilters = document.getElementById('categoryFilters');
const cuisineFilters = document.getElementById('cuisineFilters');
const recipesGrid = document.getElementById('recipesGrid');
const recipeCountEl = document.getElementById('recipeCount');
const languageSelect = document.getElementById('languageSelect');
const modal = document.getElementById('recipeModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close-btn');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    fetchRecipesFromAPI();
    setupEventListeners();
});

function setupEventListeners() {
    languageSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        updateUITranslations();
        renderRecipes();
    });

    ingredientInput.addEventListener('input', handleAutocomplete);
    
    ingredientInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            addIngredient(ingredientInput.value);
            autocompleteList.style.display = 'none';
        }
    });

    addIngredientBtn.addEventListener('click', () => {
        addIngredient(ingredientInput.value);
        autocompleteList.style.display = 'none';
    });

    // Close autocomplete on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            autocompleteList.style.display = 'none';
        }
    });

    // Categories
    categoryFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-btn')) {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            fetchRecipesFromAPI();
        }
    });

    cuisineFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-btn')) {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            fetchRecipesFromAPI();
        }
    });

    // Modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => { modal.style.display = 'none'; }, 300);
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        }
    });
}

function updateUITranslations() {
    const t = uiTranslations[currentLanguage];
    document.getElementById('t-hero-title').textContent = t['t-hero-title'];
    document.getElementById('t-hero-subtitle').textContent = t['t-hero-subtitle'];
    document.getElementById('t-selected-ingredients').textContent = t['t-selected-ingredients'];
    document.getElementById('t-categories').textContent = t['t-categories'];
    document.getElementById('t-cuisines').textContent = t['t-cuisines'];
    document.getElementById('t-suggested-recipes').textContent = t['t-suggested-recipes'];
    document.getElementById('t-recipes-found').textContent = t['t-recipes-found'];
    
    ingredientInput.placeholder = t['placeholder'];
    addIngredientBtn.innerHTML = `<i class="fa-solid fa-plus"></i> ${t['btn-add']}`;
    
    updateIngredientsUI();
}

const popularIngredients = [
    "Chicken", "Tomato", "Garlic", "Onion", "Rice", "Pasta", "Eggs", "Milk", "Cheese", "Spinach", "Flour", "Potato", "Avocado", "Tofu", "Paneer", "Dal", "Lentils", "Cumin", "Turmeric", "Coriander", "Ginger", "Chili", "Ghee", "Mustard Seeds", "Curry Leaves", "Coconut", "Peas", "Carrots", "Beef", "Pork", "Fish", "Shrimp", "Yogurt", "Cabbage"
];

function handleAutocomplete() {
    const val = ingredientInput.value.toLowerCase().trim();
    autocompleteList.innerHTML = '';
    
    if (!val) {
        autocompleteList.style.display = 'none';
        return;
    }

    const matches = popularIngredients.filter(ing => ing.toLowerCase().includes(val));
    
    if (matches.length > 0) {
        matches.forEach(match => {
            const div = document.createElement('div');
            // Suggest related words
            div.innerHTML = `<i class="fa-solid fa-magnifying-glass" style="color:var(--secondary-color);"></i> <span>${match}</span>`;
            div.addEventListener('click', () => {
                addIngredient(match);
                autocompleteList.style.display = 'none';
            });
            autocompleteList.appendChild(div);
        });
        autocompleteList.style.display = 'block';
    } else {
        autocompleteList.style.display = 'none';
    }
}

async function addIngredient(name) {
    name = name.trim();
    if (!name) return;
    
    // Capitalize first letter
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    
    if (!selectedIngredients.includes(name)) {
        selectedIngredients.push(name);
        updateIngredientsUI();
        await fetchRecipesFromAPI();
    }
    
    ingredientInput.value = '';
}

async function removeIngredient(name) {
    selectedIngredients = selectedIngredients.filter(ing => ing !== name);
    updateIngredientsUI();
    await fetchRecipesFromAPI();
}

function updateIngredientsUI() {
    selectedIngredientsContainer.innerHTML = '';
    
    if (selectedIngredients.length === 0) {
        const text = uiTranslations[currentLanguage]['t-no-ingredients'];
        selectedIngredientsContainer.innerHTML = `<p class="empty-state-text" id="t-no-ingredients">${text}</p>`;
        return;
    }

    selectedIngredients.forEach(ingName => {
        // Fallback generic image since we removed the static mock list
        const imgSrc = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100&h=100&fit=crop';
        
        const chip = document.createElement('div');
        chip.className = 'ingredient-chip';
        chip.innerHTML = `
            <img src="${imgSrc}" class="chip-img" alt="${ingName}">
            <span class="chip-text">${ingName}</span>
            <button class="remove-chip" onclick="removeIngredient('${ingName}')"><i class="fa-solid fa-xmark"></i></button>
        `;
        selectedIngredientsContainer.appendChild(chip);
    });
}

async function fetchRecipesFromAPI() {
    recipesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">Loading recipes from API...</p>';
    
    let query = '';
    let extraParams = '';
    
    // AI / ML API Mapping for precise meal categorization and best output
    const categoryLogic = {
        "All": { q: ["Indian"], param: "" },
        "Breakfast": { q: ["dosa", "idly", "roti", "paratha", "poha", "upma"], param: "&mealType=Breakfast" },
        "Lunch": { q: ["dal", "paneer", "biryani", "rice", "thali"], param: "&mealType=Lunch" },
        "Dinner": { q: ["curry", "roti", "korma", "naan", "chicken", "kofte"], param: "&mealType=Dinner" },
        "Snacks": { q: ["samosa", "pakora", "chaat", "tikki", "bhel"], param: "&mealType=Snack" },
        "Desserts": { q: ["gulab jamun", "laddu", "sweet", "jalebi", "kheer"], param: "&dishType=Desserts" },
        "Healthy": { q: ["salad", "sprouts", "chickpeas", "lentils", "oats"], param: "&diet=balanced" },
        "Quick & Easy": { q: ["sandwich", "upma", "omelette", "chaat"], param: "&time=1-30" },
        "Veg": { q: ["paneer", "dal makhani", "veg biryani", "aloo gobi", "chana masala"], param: "&health=vegetarian" },
        "Non-Veg": { q: ["chicken tikka", "mutton curry", "fish fry", "prawn masala", "egg curry"], param: "" },
        "Indian Style": { q: ["chicken", "dal", "paneer", "rice", "tikka"], param: "&cuisineType=Indian" },
        "North Indian": { q: ["chole bhature", "palak paneer", "naan", "samosa"], param: "&cuisineType=Indian" },
        "South Indian": { q: ["dosa", "sambar", "idli", "chutney", "vada", "pongal"], param: "&cuisineType=Indian" },
        "Chinese": { q: ["noodles", "stir fry", "dim sum", "fried rice", "manchurian"], param: "&cuisineType=Chinese" },
        "Japanese": { q: ["sushi", "ramen", "teriyaki", "bento", "udon", "matcha"], param: "&cuisineType=Japanese" }
    };

    const logicDef = categoryLogic[currentCategory] || categoryLogic["All"];

    if (selectedIngredients.length > 0) {
        query = selectedIngredients.join(' ');
        if (currentCategory !== "All") {
            // Merge smart parameters to user input to refine ML search natively
            extraParams = logicDef.param;
        }
    } else {
        // ML Magic: Randomly select a famous recipe to guarantee different valid results per click
        const randomIndex = Math.floor(Math.random() * logicDef.q.length);
        query = logicDef.q[randomIndex];
        extraParams = logicDef.param;
    }

    const apiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(query)}${extraParams}&app_id=${APP_ID}&app_key=${APP_KEY}&imageSize=REGULAR`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.hits) {
            recipesDB = data.hits.map(hit => hit.recipe);
        } else {
            recipesDB = [];
        }
        renderRecipes();
    } catch (error) {
        console.error("Error fetching recipes:", error);
        recipesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--primary-color);">Failed to fetch recipes. Please try again later.</p>';
    }
}

function renderRecipes() {
    recipesGrid.innerHTML = '';
    
    // We don't perform local complex filtering against API data, we show what Edamam gave us.
    recipeCountEl.textContent = recipesDB.length;

    if (recipesDB.length === 0) {
        recipesGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No recipes found matching your criteria. Try adjusting your ingredients or category.</p>`;
        return;
    }

    recipesDB.forEach(recipe => {
        // Build card
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <div class="recipe-img-container">
                <img src="${recipe.image}" class="recipe-img" alt="${recipe.label}">
            </div>
            <div class="recipe-content">
                <h3 class="recipe-title">${recipe.label}</h3>
                <p class="recipe-desc" style="margin-bottom:auto;">Source: ${recipe.source}</p>
                <div class="recipe-meta" style="margin-top: 1rem;">
                    <span class="meta-item"><i class="fa-solid fa-fire"></i> ${Math.round(recipe.calories)} kcal</span>
                    <span class="meta-item"><i class="fa-solid fa-utensils"></i> ${recipe.ingredients.length} Ingred.</span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => openRecipeModal(recipe));
        recipesGrid.appendChild(card);
    });
}

function openRecipeModal(recipe) {
    let ingHtml = recipe.ingredients.map(ing => {
        const imgSrc = ing.image ? ing.image : 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100&h=100&fit=crop';
        return `<li><img src="${imgSrc}" alt="${ing.text}"> <span style="font-size: 0.9rem;">${ing.text}</span></li>`;
    }).join('');

    const ingredientsTitle = {
        en: "Ingredients", es: "Ingredientes", fr: "Ingrédients", de: "Zutaten", it: "Ingredienti",
        hi: "सामग्री", te: "పదార్థాలు"
    }[currentLanguage];

    const instructionsTitle = {
        en: "Instructions & Nutrients", es: "Instrucciones y Nutrientes", fr: "Instructions et Nutriments", de: "Anleitung & Nährstoffe", it: "Istruzioni e Nutrienti",
        hi: "निर्देश और पोषण तथ्य", te: "సూచనలు మరియు పోషకాలు"
    }[currentLanguage];
    
    const viewRecipeBtnText = {
        en: "View Full Instructions", es: "Ver Instrucciones Completas", fr: "Voir les Instructions", de: "Vollständige Anleitung", it: "Visualizza Istruzioni",
        hi: "पूर्ण निर्देश देखें", te: "పూర్తి సూచనలను చూడండి"
    }[currentLanguage];

    // Safely extract nutrients
    const protein = recipe.totalNutrients && recipe.totalNutrients.PROCNT ? Math.round(recipe.totalNutrients.PROCNT.quantity) + recipe.totalNutrients.PROCNT.unit : 'N/A';
    const carbs = recipe.totalNutrients && recipe.totalNutrients.CHOCDF ? Math.round(recipe.totalNutrients.CHOCDF.quantity) + recipe.totalNutrients.CHOCDF.unit : 'N/A';
    const fat = recipe.totalNutrients && recipe.totalNutrients.FAT ? Math.round(recipe.totalNutrients.FAT.quantity) + recipe.totalNutrients.FAT.unit : 'N/A';

    modalBody.innerHTML = `
        <img src="${recipe.image}" class="modal-header-img" alt="${recipe.label}">
        <div class="modal-details">
            <h2 class="modal-title">${recipe.label}</h2>
            
            <div class="modal-meta" style="flex-wrap: wrap; gap: 1rem; margin-top: 1rem;">
                <span><i class="fa-solid fa-fire"></i> Calories: ${Math.round(recipe.calories)}</span>
                <span><i class="fa-solid fa-bowl-food"></i> Yield: ${recipe.yield} servings</span>
                <span><i class="fa-solid fa-leaf"></i> Diet Labels: ${recipe.dietLabels.length > 0 ? recipe.dietLabels.join(", ") : 'None'}</span>
            </div>

            <div class="modal-section" style="margin-top: 2rem;">
                <h3><i class="fa-solid fa-basket-shopping"></i> ${ingredientsTitle}</h3>
                <ul class="modal-ingredients-list" style="grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));">
                    ${ingHtml}
                </ul>
            </div>

            <div class="modal-section">
                <h3><i class="fa-solid fa-list-ul"></i> ${instructionsTitle}</h3>
                <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center; margin-bottom: 2rem;">
                        <div>
                            <div style="color: var(--secondary-color); font-size: 1.5rem; font-weight: bold;">${protein}</div>
                            <div style="color: var(--text-secondary); font-size: 0.9rem;">Protein</div>
                        </div>
                        <div>
                            <div style="color: var(--secondary-color); font-size: 1.5rem; font-weight: bold;">${carbs}</div>
                            <div style="color: var(--text-secondary); font-size: 0.9rem;">Carbohydrates</div>
                        </div>
                        <div>
                            <div style="color: var(--secondary-color); font-size: 1.5rem; font-weight: bold;">${fat}</div>
                            <div style="color: var(--text-secondary); font-size: 0.9rem;">Fat</div>
                        </div>
                    </div>
                </div>
                
                <a href="${recipe.url}" target="_blank" style="display: inline-block; background: var(--primary-color); color: white; text-decoration: none; padding: 1rem 2rem; border-radius: 30px; font-weight: bold; transition: 0.2s;"><i class="fa-solid fa-arrow-up-right-from-square"></i> ${viewRecipeBtnText}</a>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
    setTimeout(() => { modal.classList.add('show'); }, 10);
}

function updateUI() {
    updateUITranslations();
}
