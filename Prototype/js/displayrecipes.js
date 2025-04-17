window.onload = function () {
    const container = document.getElementById("recipe-container");

    if (!container) return;

    renderAddedRecipes(container);
};

function renderAddedRecipes(container) {
    container.innerHTML = ""; // Clear existing content

    if (addedRecipes.length === 0) {
        container.innerHTML = "<p>No recipes added yet.</p>";
        return;
    }

    addedRecipes.forEach((recipe, index) => {
        const recipeCard = document.createElement("div");
        recipeCard.className = "recipe-card";

        const cardId = `recipe-${index}`;

        recipeCard.innerHTML = `
            <h3>${recipe.title}</h3>
            <p><strong>Cost:</strong> ${recipe.cost}</p>
            <p><strong>Time:</strong> ${recipe.time} mins</p>
            <p><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>
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
    addedRecipes.splice(index, 1); // Remove from array
    sessionStorage.setItem("addedRecipes", JSON.stringify(addedRecipes)); // Update sessionStorage
    renderAddedRecipes(container); // Re-render the UI
}
