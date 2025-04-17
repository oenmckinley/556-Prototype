window.onload = function() {
    const allRecipes = JSON.parse(sessionStorage.getItem("allRecipes")) || [];
    const container = document.getElementById("recipe-container");

    // Make sure the container exists
    if (container) {
        addedRecipes.forEach((title) => {
            const recipe = allRecipes.find((r) => r.title === title);
            if (recipe) {
                const card = document.createElement("div");
                card.className = "recipe-card";
                card.innerHTML = `
                    <h2>${recipe.title}</h2>
                    <p><strong>Cost:</strong> ${recipe.cost}</p>
                    <p><strong>Time:</strong> ${recipe.time} mins</p>
                    <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
                    <p><strong>Preferences:</strong> ${recipe.preference.join(', ')}</p>
                    <p><strong>Restrictions:</strong> ${recipe.restriction.join(', ')}</p>
                    <p><strong>Utensils:</strong> ${recipe.utensils.join(', ')}</p>
                    <p><strong>Instructions:</strong> ${recipe.instruction}</p>
                `;
                container.appendChild(card);
            }
        });
    } else {
        console.error("Recipe container not found!");
    }
};
