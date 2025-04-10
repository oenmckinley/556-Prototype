fetch("../recipes_with_instructions.json")
    .then((res) => res.json())
    .then((recipes) => {
        renderRecipes(recipes);
    });

function renderRecipes(recipes) {
    const grid1 = document.getElementById("addedGrid");
    const grid2 = document.getElementById("weekGrid");
    grid1.innerHTML = "";
    grid2.innerHTML = "";

    if (addedRecipes.length > 0) {
        let i = 0;
        recipes.forEach((recipe) => {
            const title = recipe.title || "";
            const ingredients = recipe.ingredients || [];
            const preferences = recipe.preference || [];
            const restrictions = recipe.restriction || [];
            const utensils = recipe.utensils || [];
            const instruction = recipe.instruction || "";
            const added = addedRecipes.includes(title);

            if (added) {
                const card = document.createElement("div");
                card.className = "recipe-card groceries-card";
                card.id = "addcard" + i.toString();

                card.innerHTML = `
              ${recipe.img ? `<img src="${recipe.img}" alt="${recipe.title}" class="recipe-img" />` : ``}
              <h4>${recipe.title}</h4>
              <p><strong>${recipe.cost}</strong> • ${recipe.time} mins</p>
              <p><strong>Preferences:</strong> ${preferences.join(", ")}</p>
              <p><strong>Restrictions:</strong> ${restrictions.join(", ")}</p>
              ${added ? `<button class="rem-recipe" onclick="remRecipe('${title}', '${card.id}')">Remove</button>` : `<button class="add-recipe" onclick="addRecipe('${title}', '${card.id}')">Add</button>`}
                `;

                grid1.appendChild(card);

                i++;
            }
        });
    } else {
        const card = document.createElement("div");
        card.className = "recipe-card groceries-card";

        card.innerHTML = `<h4>No Added Recipes!</h4>`;

        grid1.appendChild(card);
    }

    if (scheduledRecipes.length > 0) {
        let i = 0;
        recipes.forEach((recipe) => {
            const title = recipe.title || "";
            const ingredients = recipe.ingredients || [];
            const preferences = recipe.preference || [];
            const restrictions = recipe.restriction || [];
            const utensils = recipe.utensils || [];
            const instruction = recipe.instruction || "";
            const scheduled = scheduledRecipes.includes(title);

            if (added) {
                const card = document.createElement("div");
                card.className = "recipe-card groceries-card";
                card.id = "weekcard" + i.toString();

                card.innerHTML = `
              ${recipe.img ? `<img src="${recipe.img}" alt="${recipe.title}" class="recipe-img" />` : ``}
              <h4>${recipe.title}</h4>
              <p><strong>${recipe.cost}</strong> • ${recipe.time} mins</p>
              <p><strong>Preferences:</strong> ${preferences.join(", ")}</p>
              <p><strong>Restrictions:</strong> ${restrictions.join(", ")}</p>
              ${added ? `<button class="rem-recipe" onclick="remRecipe('${title}', '${card.id}')">Remove</button>` : `<button class="add-recipe" onclick="addRecipe('${title}', '${card.id}')">Add</button>`}
                `;

                grid2.appendChild(card);

                i++;
            }
        });
    } else {
        const card = document.createElement("div");
        card.className = "recipe-card groceries-card";

        card.innerHTML = `<h4>No Added Recipes!</h4>`;

        grid2.appendChild(card);
    }
}
