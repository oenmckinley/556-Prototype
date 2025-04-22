let planner = JSON.parse(sessionStorage.getItem("addedRecipes")) || []
let favoriteRecipes = JSON.parse(sessionStorage.getItem("favoriteRecipes")) || [];

window.onload = function () {
    const container = document.getElementById("recipe-container");
    if (!container) return;

    renderFavoriteRecipes(container);
};

function renderFavoriteRecipes(container) {
    container.innerHTML = "";

    if (favoriteRecipes.length === 0) {
        container.innerHTML = "<p>No favorite recipes yet.</p>";
        return;
    }

    favoriteRecipes.forEach((recipe, index) => {
        const recipeCard = document.createElement("div");
        recipeCard.className = "recipe-card";
        const cardId = `recipe-${index}`;
        recipeCard.id = cardId;
        const isAdded = planner.some(r => r.title === recipe.title);
        const card = document.createElement("div");
    
        recipeCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h4>${recipe.title}</h4>
                <div class="favorite-star filled" data-title="${recipe.title}">
                    &#9733;
                </div>
            </div>
            <img src="${recipe.img ? getVideoThumbnail(recipe.img) : '../img/video.png'}" 
                 alt="${recipe.title}" 
                 class="recipe-img" 
                 onerror="this.src='../img/video.png'" />
            <p>${recipe.cost} | ${recipe.time} mins</p>
            <strong>Ingredients:</strong>
            <ul>
                ${
                    recipe.ingredients && recipe.ingredients.length > 0
                        ? recipe.ingredients.slice(0, 4).map(i => `<li>${i}</li>`).join("")
                        : "<li>N/A</li>"
                }
            </ul>
            <div style="display: flex;">
                <a href="#" class="show-more-link" data-title="${recipe.title}">Show More</a>
                <button class="${isAdded ? 'rem-recipe' : 'add-recipe'}" data-title="${recipe.title}" data-cardid="${cardId}">
                    ${isAdded ? 'Remove' : 'Add'}
                </button>

            </div>
        `;
    
        // Attach event listener to the entire recipe card
        recipeCard.addEventListener("click", (e) => {
            // Ignore clicks on the favorite star or the "Show More" link
            if (e.target.closest('.favorite-star') || e.target.closest('.show-more-link')) return;
    
            const title = recipe.title;
    
            // Save entire list of recipes (if not already stored)
            sessionStorage.setItem("allRecipes", JSON.stringify(favoriteRecipes)); // or full list if you want
            storeFiltersAndNavigate(title); // Navigate to the detailed recipe page
        });
    
        // Show more link listener (keep this for handling clicks on 'Show More' specifically)
        const showMoreLink = recipeCard.querySelector(".show-more-link");
        showMoreLink.addEventListener("click", (e) => {
            e.preventDefault();
            const title = e.currentTarget.getAttribute("data-title");
    
            // Save entire list of recipes (if not already stored)
            sessionStorage.setItem("allRecipes", JSON.stringify(favoriteRecipes)); // or full list if you want
            storeFiltersAndNavigate(title); // Navigate to the detailed recipe page
        });
    
        container.appendChild(recipeCard);
        // Add/Remove Button Click
        const addRemoveBtn = recipeCard.querySelector("button");
        addRemoveBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevents navigating to recipe page

            const title = e.currentTarget.getAttribute("data-title");
            const cardId = e.currentTarget.getAttribute("data-cardid");

            if (e.currentTarget.classList.contains("add-recipe")) {
                addRecipe(title, cardId);
                e.currentTarget.classList.remove("add-recipe");
                e.currentTarget.classList.add("rem-recipe");
                e.currentTarget.textContent = "Remove";
            } else {
                remRecipe(title, cardId);
                e.currentTarget.classList.remove("rem-recipe");
                e.currentTarget.classList.add("add-recipe");
                e.currentTarget.textContent = "Add";
            }
        });
    
        // Favorite star click listener
        const star = recipeCard.querySelector(".favorite-star");
        star.addEventListener("click", (e) => {
            const title = star.getAttribute("data-title");
            const isFavorited = favoriteRecipes.some(r => r.title === title);
    
            if (isFavorited) {
                favoriteRecipes = favoriteRecipes.filter(r => r.title !== title);
                star.innerHTML = "&#9734;"; // hollow star
                star.classList.remove("filled");
            } else {
                // Add recipe to favorites
                favoriteRecipes.push(recipe);
                star.innerHTML = "&#9733;"; // filled star
                star.classList.add("filled");
            }
    
            sessionStorage.setItem("favoriteRecipes", JSON.stringify(favoriteRecipes));
            renderFavoriteRecipes(container); // optional, if you want to refresh the view
        });
        card.addEventListener("click", (e) => {
            // Prevent button or favorite star clicks from triggering navigation
            if (
                e.target.closest(".add-recipe") ||
                e.target.closest(".rem-recipe") ||
                e.target.closest(".favorite-star") ||
                e.target.closest(".show-more-link") 
            ) {
                return;
            }
            storeFiltersAndNavigate(recipe.title);
        });
    });
}

function removeRecipe(index, container) {
    favoriteRecipes.splice(index, 1);
    sessionStorage.setItem("favoriteRecipes", JSON.stringify(favoriteRecipes));
    renderFavoriteRecipes(container);
}

function getVideoThumbnail(url) {
    const youtubeRegex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/]+)/;
    const match = url.match(youtubeRegex);
    if (match && match[1]) {
        return `https://img.youtube.com/vi/${match[1]}/0.jpg`;
    }
    return "../img/video.png";
}

// function addRecipe(title, cardId) {
//     const recipe = allRecipes.find(r => r.title === title);
//     if (!planner.some(r => r.title === title)) planner.push(recipe);
//     sessionStorage.setItem("addedRecipes", JSON.stringify(planner));
//     document.getElementById(cardId).querySelector("button").outerHTML = `<button class="rem-recipe" onclick="remRecipe('${title}', '${cardId}')">Remove</button>`;
// }

// function remRecipe(title, cardId) {
//     planner = planner.filter(r => r.title !== title);
//     sessionStorage.setItem("addedRecipes", JSON.stringify(planner));
//     document.getElementById(cardId).querySelector("button").outerHTML = `<button class="add-recipe" onclick="addRecipe('${title}', '${cardId}')">Add</button>`;
// }

function addRecipe(title, cardId) {
    const allRecipes = JSON.parse(sessionStorage.getItem("allRecipes")) || [];
    const recipe = allRecipes.find(r => r.title === title);
    if (!planner.some(r => r.title === title)) planner.push(recipe);
    sessionStorage.setItem("addedRecipes", JSON.stringify(planner));
}

function remRecipe(title, cardId) {
    planner = planner.filter(r => r.title !== title);
    sessionStorage.setItem("addedRecipes", JSON.stringify(planner));
}


function storeFiltersAndNavigate(title) {
    sessionStorage.setItem("selectedTitle", title);
    window.location.href = "recipe.html";
}
