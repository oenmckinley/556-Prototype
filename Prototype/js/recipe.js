let allRecipes = [];
let planner = JSON.parse(sessionStorage.getItem("addedRecipes")) || [];
let favoriteRecipes = JSON.parse(sessionStorage.getItem("favoriteRecipes")) || [];

document.addEventListener("DOMContentLoaded", () => {
    fetch("../recipes_with_instructions.json")
        .then((res) => res.json())
        .then((recipes) => {
            allRecipes = recipes;
            renderRecipes(allRecipes);
            populateSearchFilters(allRecipes);

            const saved = JSON.parse(sessionStorage.getItem("filters"));
            if (saved) {
                document.getElementById("costMin").value = saved.costMin || "";
                document.getElementById("costMax").value = saved.costMax || "";
                document.getElementById("timeMin").value = saved.timeMin || "";
                document.getElementById("timeMax").value = saved.timeMax || "";

                setCheckedValues("ingredientOptions", saved.ingredients);
                setCheckedValues("excludeOptions", saved.excludes);
                setCheckedValues("preferenceOptions", saved.preferences);
                setCheckedValues("utensilOptions", saved.utensils);

                applyFilters(); 
            }
        });

    document.addEventListener("change", (e) => {
        if (e.target.matches("input[type='checkbox']")) {
            applyFilters();
        }
    });

    document.querySelectorAll("input[type='number']").forEach(input => {
        input.addEventListener("input", applyFilters);
    });

    document.querySelectorAll(".search-input").forEach(input => {
        input.addEventListener("input", applyFilters);
    });

    document.querySelectorAll('.filter-box').forEach(box => {
        box.addEventListener('click', () => {
            const id = box.id.replace('FilterBox', 'Dropdown');
            const dropdown = document.getElementById(id);
            console.log("Toggling dropdown:", id, dropdown); // 🔍 DEBUG LINE
            if (dropdown) {
                const isActive = dropdown.classList.contains('active');
                closeAllDropdowns();
                if (!isActive) {
                    dropdown.classList.add('active');
                    box.classList.add('active');
                }

            }
        });
    });
    
});

// Close all dropdowns when clicking outside
document.addEventListener('click', (e) => {
    const isFilterBox = e.target.closest('.filter-box');
    const isDropdown = e.target.closest('.filter-dropdown');
    
    if (!isFilterBox && !isDropdown) {
        closeAllDropdowns();
    }
});

function closeAllDropdowns() {
    document.querySelectorAll('.filter-dropdown').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('.filter-box').forEach(b => b.classList.remove('active'));
}


function applyFilters() {
    const costMin = parseFloat(document.getElementById("costMin").value) || 0;
    const costMax = parseFloat(document.getElementById("costMax").value) || 1000;
    const timeMin = parseFloat(document.getElementById("timeMin").value) || 0;
    const timeMax = parseFloat(document.getElementById("timeMax").value) || 1000;

    const selectedIngredients = getCheckedValues("#ingredientOptions input[type='checkbox']");
    const excludedIngredients = getCheckedValues("#excludeOptions input[type='checkbox']");
    const selectedPreferences = getCheckedValues("#preferenceOptions input[type='checkbox']");
    const selectedUtensils = getCheckedValues("#utensilOptions input[type='checkbox']");

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
    // Update filter-box appearance if something is selected
    updateFilterBoxState("costFilterBox", ["costMin", "costMax"]);
    updateFilterBoxState("timeFilterBox", ["timeMin", "timeMax"]);
    updateFilterBoxState("ingredientFilterBox", "#ingredientOptions input[type='checkbox']");
    updateFilterBoxState("excludeFilterBox", "#excludeOptions input[type='checkbox']");
    updateFilterBoxState("preferenceFilterBox", "#preferenceOptions input[type='checkbox']");
    updateFilterBoxState("utensilFilterBox", "#utensilOptions input[type='checkbox']");

}

function getCheckedValues(selector) {
    return Array.from(document.querySelectorAll(selector + ":checked")).map(cb => cb.value.toLowerCase());
}

function setCheckedValues(containerId, values = []) {
    const checkboxes = document.querySelectorAll(`#${containerId} input[type='checkbox']`);
    checkboxes.forEach(cb => {
        if (values.includes(cb.value.toLowerCase())) {
            cb.checked = true;
        }
    });
}

function renderRecipes(recipes) {
    const grid = document.getElementById("recipeGrid");
    grid.innerHTML = "";

    recipes.forEach((recipe) => {
        const isFavorited = favoriteRecipes.some(r => r.title === recipe.title);
        const ingredients = recipe.ingredients || [];
        const preferences = recipe.preference || [];
        const utensils = recipe.utensils || [];
        const isAdded = planner.some(r => r.title === recipe.title);

        const card = document.createElement("div");
        card.className = "recipe-card";
        card.id = recipe.title.replace(/\s+/g, '-').toLowerCase();

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h4>${recipe.title}</h4>
                <div class="favorite-star ${isFavorited ? 'filled' : ''}" data-title="${recipe.title}">
                    ${isFavorited ? "&#9733;" : "&#9734;"}
                </div>
            </div>
            <img src="../img/video.png" alt="${recipe.title}" class="recipe-img" />
            <p>${recipe.cost} | ${recipe.time} mins</p>
            <strong>Ingredients:</strong>
            <ul>${ingredients.slice(0, 4).map(i => `<li>${i}</li>`).join("")}</ul>
            <div style="display: flex;">
                <a href="#" class="show-more-link" data-title="${recipe.title}">Show More</a>
                <button class="${isAdded ? 'rem-recipe' : 'add-recipe'}" onclick="${isAdded ? 'remRecipe' : 'addRecipe'}('${recipe.title}', '${card.id}')">${isAdded ? 'Remove' : 'Add'}</button>
            </div>
        `;

        grid.appendChild(card);

        const showMoreLink = card.querySelector(".show-more-link");
        showMoreLink.addEventListener("click", (e) => {
            e.preventDefault();
            const title = showMoreLink.getAttribute("data-title");
            storeFiltersAndNavigate(title);
        });

        const star = card.querySelector(".favorite-star");
        star.addEventListener("click", () => {
            const title = star.getAttribute("data-title");
            const isFavorited = favoriteRecipes.some(r => r.title === title);

            if (isFavorited) {
                favoriteRecipes = favoriteRecipes.filter(r => r.title !== title);
                star.innerHTML = "&#9734;";
                star.classList.remove("filled");
            } else {
                const recipe = allRecipes.find(r => r.title === title);
                if (recipe) {
                    favoriteRecipes.push(recipe);
                    star.innerHTML = "&#9733;";
                    star.classList.add("filled");
                }
            }

            sessionStorage.setItem("favoriteRecipes", JSON.stringify(favoriteRecipes));
        });
    });
}

function addRecipe(title, cardId) {
    const recipe = allRecipes.find(r => r.title === title);
    if (!planner.some(r => r.title === title)) planner.push(recipe);
    sessionStorage.setItem("addedRecipes", JSON.stringify(planner));
    document.getElementById(cardId).querySelector("button").outerHTML = `<button class="rem-recipe" onclick="remRecipe('${title}', '${cardId}')">Remove</button>`;
}

function remRecipe(title, cardId) {
    planner = planner.filter(r => r.title !== title);
    sessionStorage.setItem("addedRecipes", JSON.stringify(planner));
    document.getElementById(cardId).querySelector("button").outerHTML = `<button class="add-recipe" onclick="addRecipe('${title}', '${cardId}')">Add</button>`;
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

    populateFilterSection("ingredientOptions", Array.from(ingredientSet));
    populateFilterSection("excludeOptions", Array.from(ingredientSet));
    populateFilterSection("preferenceOptions", Array.from(preferenceSet));
    populateFilterSection("utensilOptions", Array.from(utensilSet));
}

function populateFilterSection(containerId, items) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    const uniqueItems = [...new Set(items.map(item => normalize(item)))];
    uniqueItems.sort();

    const wrapper = document.createElement("div");
    wrapper.className = "filter-options-wrapper";

    let expanded = false;

    uniqueItems.forEach((item, index) => {
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
        moreBtn.style.display = "block";
        expanded = false;
    });

    container.appendChild(wrapper);
    container.appendChild(moreBtn);
    container.appendChild(lessBtn);

    const searchInput = container.previousElementSibling;
    if (searchInput && searchInput.classList.contains("search-input")) {
        searchInput.addEventListener("input", function () {
            const term = this.value.toLowerCase();
            let matches = 0;
            wrapper.querySelectorAll("label").forEach((label) => {
                const match = label.textContent.toLowerCase().includes(term);
                label.style.display = match ? "block" : "none";
                if (match) matches++;
            });

            if (!expanded) {
                moreBtn.style.display = matches > 2 ? "block" : "none";
                lessBtn.style.display = "none";
            }

            if (term === "") {
                wrapper.querySelectorAll("label").forEach((label, index) => {
                    label.style.display = index < 2 ? "block" : "none";
                });
                moreBtn.style.display = uniqueItems.length > 2 ? "block" : "none";
                lessBtn.style.display = "none";
                expanded = false;
            }
        });
    }
}

function storeFiltersAndNavigate(title) {
    const costMin = document.getElementById("costMin").value;
    const costMax = document.getElementById("costMax").value;
    const timeMin = document.getElementById("timeMin").value;
    const timeMax = document.getElementById("timeMax").value;

    sessionStorage.setItem("filters", JSON.stringify({
        costMin, costMax, timeMin, timeMax,
        ingredients: getCheckedValues("#ingredientOptions input[type='checkbox']"),
        excludes: getCheckedValues("#excludeOptions input[type='checkbox']"),
        preferences: getCheckedValues("#preferenceOptions input[type='checkbox']"),
        utensils: getCheckedValues("#utensilOptions input[type='checkbox']")
    }));

    window.location.href = `recipe.html?title=${encodeURIComponent(title)}`;
}

function updateFilterBoxState(filterBoxId, inputSelectors) {
    const box = document.getElementById(filterBoxId);
    let hasValue = false;

    if (Array.isArray(inputSelectors)) {
        hasValue = inputSelectors.some(id => {
            const val = document.getElementById(id)?.value;
            return val && val.trim() !== "" && parseFloat(val) !== 0;
        });
    } else {
        hasValue = document.querySelectorAll(inputSelectors + ":checked").length > 0;
    }

    box.classList.toggle("applied", hasValue);
}

function normalize(str) {
    return str.toLowerCase().trim().replace(/s$/, '');
}
