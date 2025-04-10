fetch("../recipes_with_instructions.json")
    .then((res) => res.json())
    .then((recipes) => {
        renderRecipes(recipes);
        addIngredients(recipes);
    });

function renderRecipes(recipes) {
    const grid = document.getElementById("recipeGrid");
    grid.innerHTML = "";

    let i = 0;
    recipes.forEach((recipe) => {
        const title = recipe.title || "";
        const ingredients = recipe.ingredients || [];
        const preferences = recipe.preference || [];
        const restrictions = recipe.restriction || [];
        const utensils = recipe.utensils || [];
        const instruction = recipe.instruction || "";
        const added = addedRecipes.includes(title);

        const card = document.createElement("div");
        card.className = "recipe-card";
        card.id = "card"+i.toString();

        card.innerHTML = `
      ${recipe.img ? `<img src="${recipe.img}" alt="${recipe.title}" class="recipe-img" />` : ``}
      <h4>${recipe.title}</h4>
      <p><strong>${recipe.cost}</strong> • ${recipe.time} mins</p>
      <p><strong>Preferences:</strong> ${preferences.join(", ")}</p>
      <p><strong>Restrictions:</strong> ${restrictions.join(", ")}</p>
      ${added ? `<button class="rem-recipe" onclick="remRecipe('${title}', '${card.id}')">Remove</button>` : `<button class="add-recipe" onclick="addRecipe('${title}', '${card.id}')">Add</button>`}
        `;

        grid.appendChild(card);

        i++;
    });
}