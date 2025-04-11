fetch("../recipes_with_instructions.json")
    .then((res) => res.json())
    .then((recipes) => {
        renderRecipes(recipes);
    });

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
        <span class="recipe-id" style="display:none;">${recipe.id}</span>
        ${recipe.img ? `<img src="${recipe.img}" alt="${recipe.title}" class="recipe-img" />` : ""}
        <h4>${recipe.title}</h4>
        <p><strong>${recipe.cost}</strong> • ${recipe.time} mins</p>
        <p><strong>Preferences:</strong> ${preferences.join(", ")}</p>
        <p><strong>Restrictions:</strong> ${restrictions.join(", ")}</p>
        <button>Add</button>
    `;

        grid.appendChild(card);
    });
}
