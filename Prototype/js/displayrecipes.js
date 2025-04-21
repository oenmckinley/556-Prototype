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

        recipeCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h4>${recipe.title}</h4>
                <button class="rem-recipe" id="${cardId}">Remove</button>
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
            </div>
        `;

        // Remove button listener
        recipeCard.querySelector(`#${cardId}`).addEventListener("click", () => {
            removeRecipe(index, container);
        });

        // Show more link listener
        const showMoreLink = recipeCard.querySelector(".show-more-link");
        showMoreLink.addEventListener("click", (e) => {
            e.preventDefault();
            const title = e.currentTarget.getAttribute("data-title");

            // Save entire list of recipes (if not already stored)
            sessionStorage.setItem("allRecipes", JSON.stringify(favoriteRecipes)); // or full list if you want
            storeFiltersAndNavigate(title);
        });

        container.appendChild(recipeCard);
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

function storeFiltersAndNavigate(title) {
    sessionStorage.setItem("selectedTitle", title);
    window.location.href = "recipe.html";
}
