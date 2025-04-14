let allRecipes = [];

fetch("../recipes_with_instructions.json")
    .then((res) => res.json())
    .then((recipes) => {
        allRecipes = recipes;
        renderRecipes(allRecipes);
        populateSearchFilters(allRecipes);
    });

// Event listeners for filter buttons
document.querySelector(".btn_filters[type='button']").addEventListener("click", applyFilters);
document.querySelectorAll(".btn_filters")[1].addEventListener("click", () => {
    renderRecipes(allRecipes);
});

function applyFilters() {
    const costInputs = document.querySelectorAll("input[type='number']");
    const costMin = parseFloat(costInputs[0].value) || 0;
    const costMax = parseFloat(costInputs[1].value) || 1000;

    const timeMin = parseFloat(costInputs[2].value) || 0;
    const timeMax = parseFloat(costInputs[3].value) || 1000;

    const selectedIngredients = getCheckedValues("#search-filter input[type='checkbox']");
    const excludedIngredients = getCheckedValues(".filter-section:nth-of-type(4) input[type='checkbox']");
    const selectedPreferences = getCheckedValues(".filter-section:nth-of-type(5) input[type='checkbox']");
    const selectedUtensils = getCheckedValues(".filter-section:nth-of-type(6) input[type='checkbox']");

    const filtered = allRecipes.filter((recipe) => {
        const costVal = parseFloat(recipe.cost.replace('$', ''));
        const timeVal = parseFloat(recipe.time);

        const hasAllIngredients = selectedIngredients.every(ing => recipe.ingredients.map(i => normalize(i)).includes(ing));
        const hasNoExcluded = excludedIngredients.every(ex => !recipe.ingredients.map(i => normalize(i)).includes(ex));
        const hasPreference = selectedPreferences.length === 0 || selectedPreferences.some(pref => recipe.preference.map(p => normalize(p)).includes(pref));
        const hasUtensils = selectedUtensils.length === 0 || selectedUtensils.every(ut => recipe.utensils.map(u => normalize(u)).includes(ut));

        return costVal >= costMin && costVal <= costMax &&
            timeVal >= timeMin && timeVal <= timeMax &&
            hasAllIngredients && hasNoExcluded && hasPreference && hasUtensils;
    });

    renderRecipes(filtered);
}

function getCheckedValues(selector) {
    return Array.from(document.querySelectorAll(selector + ":checked"))
        .map(cb => cb.value.toLowerCase());
}

function renderRecipes(recipes) {
    const grid = document.getElementById("recipeGrid");
    grid.innerHTML = "";

    recipes.forEach((recipe) => {
        const ingredients = recipe.ingredients || [];
        const preferences = recipe.preference || [];
        const restrictions = recipe.restriction || [];
        const utensils = recipe.utensils || [];
        const instruction = recipe.instruction || "";

        const card = document.createElement("div");
        card.className = "recipe-card";

        card.innerHTML = `
      ${recipe.img ? `<img src="${recipe.img}" alt="${recipe.title}" class="recipe-img" />` : ""}
      <h4>${recipe.title}</h4>
      <p><strong>${recipe.cost}</strong> • ${recipe.time} mins</p>
      <p><strong>Preferences:</strong> ${preferences.join(", ")}</p>
      <p><strong>Restrictions:</strong> ${restrictions.join(", ")}</p>
      <p><strong>Utensils:</strong> ${utensils.join(", ")}</p>
      <ul><strong>Ingredients:</strong> ${ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
      <p><strong>Instructions:</strong><br>${instruction.replace(/\n/g, "<br>")}</p>
      <button>Add</button>
    `;

        grid.appendChild(card);
    });
}

function populateSearchFilters(recipes) {
    const ingredientSet = new Set();
    const preferenceSet = new Set();
    const utensilSet = new Set();

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(i => ingredientSet.add(normalize(i)));
        recipe.preference.forEach(p => preferenceSet.add(normalize(p)));
        recipe.utensils.forEach(u => utensilSet.add(normalize(u)));
    });

    populateFilterSection("#search-filter", Array.from(ingredientSet));
    populateFilterSection(".filter-section:nth-of-type(4)", Array.from(ingredientSet));
    populateFilterSection(".filter-section:nth-of-type(5)", Array.from(preferenceSet));
    populateFilterSection(".filter-section:nth-of-type(6)", Array.from(utensilSet));
}

function populateFilterSection(selector, items) {
    const section = document.querySelector(selector);
    const searchInput = section.querySelector("input[type='text']");

    const wrapper = document.createElement("div");
    wrapper.classList.add("filter-options");

    const uniqueItems = [...new Set(items.map(item => normalize(item)))];

    let expanded = false;

    uniqueItems.sort().forEach((item, index) => {
        const label = document.createElement("label");
        const displayText = item.charAt(0).toUpperCase() + item.slice(1);
        label.innerHTML = `<input type='checkbox' value='${item}'> ${displayText}`;
        if (index >= 2) label.style.display = "none";
        wrapper.appendChild(label);
    });

    const lessBtn = document.createElement("button");
    lessBtn.textContent = "Less";
    lessBtn.className = "show-less";
    lessBtn.style.display = "none";

    const moreBtn = document.createElement("button");
    moreBtn.textContent = "More";
    moreBtn.className = "show-more";
    moreBtn.style.display = uniqueItems.length > 2 ? "block" : "none";

    moreBtn.addEventListener("click", () => {
        wrapper.querySelectorAll("label").forEach(label => label.style.display = "block");
        moreBtn.style.display = "none";
        lessBtn.style.display = "block";
        expanded = true;
    });

    lessBtn.addEventListener("click", () => {
        wrapper.querySelectorAll("label").forEach((label, index) => {
            label.style.display = index < 2 ? "block" : "none";
        });
        lessBtn.style.display = "none";
        moreBtn.style.display = uniqueItems.length > 2 ? "block" : "none";
        expanded = false;
    });

    section.appendChild(lessBtn);
    section.appendChild(wrapper);
    section.appendChild(moreBtn);

    // Live filter
    searchInput.addEventListener("input", function () {
        const term = this.value.toLowerCase();
        let matches = 0;
        Array.from(wrapper.children).forEach((label, index) => {
            const text = label.textContent.toLowerCase();
            const match = text.includes(term);
            label.style.display = match ? "block" : "none";
            if (match) matches++;
        });
        if (!expanded) {
            moreBtn.style.display = matches > 2 ? "block" : "none";
            lessBtn.style.display = "none";
        }
    });
}

function normalize(str) {
    return str.toLowerCase().trim().replace(/s$/, '');
}