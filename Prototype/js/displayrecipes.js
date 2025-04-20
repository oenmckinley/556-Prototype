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
    container.innerHTML = ""; // Clear existing content

    if (favoriteRecipes.length === 0) {
        container.innerHTML = "<p>No favorite recipes yet.</p>";
        return;
    }

    favoriteRecipes.forEach((recipe, index) => {
        const recipeCard = document.createElement("div");
        recipeCard.className = "recipe-card";

        const cardId = `recipe-${index}`;

        recipeCard.innerHTML = `
            <h3>${recipe.title}</h3>
            <p><strong>Cost:</strong> ${recipe.cost}</p>
            <p><strong>Time:</strong> ${recipe.time} mins</p>
            <p><strong>Ingredients:</strong> ${recipe.ingredients ? recipe.ingredients.join(", ") : "N/A"}</p>
            <button class="rem-recipe" id="${cardId}">Remove</button>
        `;

        // Add event listener to the remove button
        recipeCard.querySelector(`#${cardId}`).addEventListener("click", () => {
            removeRecipe(index, container);
        });

        container.appendChild(recipeCard);
    });
}

function removeRecipe(index, container) {
    favoriteRecipes.splice(index, 1); // Remove from array
    sessionStorage.setItem("favoriteRecipes", JSON.stringify(favoriteRecipes)); // Update sessionStorage
    renderFavoriteRecipes(container); // Re-render the UI
}
