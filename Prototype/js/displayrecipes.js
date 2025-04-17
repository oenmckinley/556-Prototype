// let addedRecipes = JSON.parse(sessionStorage.getItem("addedRecipes")) || [];

window.onload = function () {
    const container = document.getElementById("recipe-container");

    if (!container) return;

    if (addedRecipes.length === 0) {
        container.innerHTML = "<p>No recipes added yet.</p>";
        return;
    }

    addedRecipes.forEach((recipe) => {
        const recipeCard = document.createElement("div");
        recipeCard.className = "recipe-card";

        recipeCard.innerHTML = `
            <h3>${recipe.title}</h3>
            <p><strong>Cost:</strong> ${recipe.cost}</p>
            <p><strong>Time:</strong> ${recipe.time} mins</p>
            <p><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>
            <p><strong>Instructions:</strong> ${recipe.instruction}</p>
        `;

        container.appendChild(recipeCard);
    });
};
