const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");

const ingredientsLink = document.getElementById("ingredientsLink");
if (ingredientsLink && recipeId) {
    ingredientsLink.href = `ingredients.html?id=${recipeId}`;
}

fetch("../recipes_with_instructions.json")
    .then((res) => res.json())
    .then((recipes) => {
        const recipe = recipes.find(r => r.id == recipeId);
        if (recipe) {
            displayRecipe(recipe);
        } else {
            document.body.innerHTML = "<h2>Recipe not found.</h2>";
        }
    });

    function displayRecipe(recipe) {
        // Optional: Update image and title
        // document.querySelector('.video img').src = recipe.img;
        document.querySelector('.video h3').innerHTML = `<u>${recipe.title}</u>`;
    
        // Process the instruction string into multiple paragraphs
        const instructionLines = recipe.instruction
            ? recipe.instruction.split('\n').map(line => `<p>${line}</p>`).join('')
            : '<p>No instructions available.</p>';
    
        const content = `
            <p><strong>Cost:</strong> ${recipe.cost}</p>
            <p><strong>Time:</strong> ${recipe.time} mins</p>
            <p><strong>Preferences:</strong> ${recipe.preference?.join(", ")}</p>
            <p><strong>Restrictions:</strong> ${recipe.restriction?.join(", ")}</p>
            <p><strong>Utensils:</strong> ${recipe.utensils?.join(", ")}</p>
            <p><strong>Instructions:</strong></p>
            ${instructionLines}
        `;
    
        document.querySelector('.col .row').innerHTML += content;
    }
    
