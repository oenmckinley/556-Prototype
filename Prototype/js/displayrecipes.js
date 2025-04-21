let allRecipes = [];
let favoriteRecipes = JSON.parse(sessionStorage.getItem("favoriteRecipes")) || [];

console.log(favoriteRecipes); // Check if favoriteRecipes contains any data
const container = document.getElementById("recipe-container");
console.log(container); // Ensure it's not null


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
            <img src="${recipe.img ? getVideoThumbnail(recipe.img) : '../img/video.png'}" alt="${recipe.title}" class="recipe-img" onerror="this.src='../img/video.png'" />
            <p>${recipe.cost} | ${recipe.time} mins</p>
            <strong>Ingredients:</strong>
            <ul>${recipe.ingredients ? recipe.ingredients.slice(0, 4).map(i => `<li>${i}</li>`).join("") : "<li>N/A</li>"}</ul>
            <div style="display: flex;">
                <a href="#" class="show-more-link" data-title="${recipe.title}">Show More</a>
            </div>
        `;

        recipeCard.querySelector(`#${cardId}`).addEventListener("click", () => {
            removeRecipe(index, container);
        });

        const showMoreLink = recipeCard.querySelector(".show-more-link");
        showMoreLink.addEventListener("click", (e) => {
            e.preventDefault();
            const title = showMoreLink.getAttribute("data-title");
            storeFiltersAndNavigate(title);
        });

        container.appendChild(recipeCard);
    });
}

function removeRecipe(index, container) {
    favoriteRecipes.splice(index, 1); // Remove from array
    sessionStorage.setItem("favoriteRecipes", JSON.stringify(favoriteRecipes)); // Update sessionStorage
    renderFavoriteRecipes(container); // Re-render the UI
}

function getVideoThumbnail(url) {
    const youtubeRegex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/]+)/;
    const match = url.match(youtubeRegex);
    if (match && match[1]) {
        return `https://img.youtube.com/vi/${match[1]}/0.jpg`;
    }
    return "../img/video.png"; // fallback image if not valid
}