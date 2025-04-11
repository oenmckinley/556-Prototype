const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");

const recipeLink = document.getElementById("recipeLink");
const ingredientsLink = document.getElementById("ingredientsLink");

if (recipeId) {
    if (recipeLink) recipeLink.href = `recipe.html?id=${recipeId}`;
    if (ingredientsLink) ingredientsLink.href = `ingredients.html?id=${recipeId}`;
}

fetch("../recipes_with_instructions.json")
    .then((res) => res.json())
    .then((recipes) => {
        const recipe = recipes.find(r => r.id == recipeId);
        if (recipe) {
            displayIngredients(recipe);
        } else {
            document.body.innerHTML = "<h2>Recipe not found.</h2>";
        }
    });

function displayIngredients(recipe) {
    // Insert ingredient data into HTML elements
    // You can update this based on your layout
    document.querySelector('.video h3').innerHTML = `<u>${recipe.title}</u>`;
    const content = `
        <p><strong>Cost:</strong> ${recipe.cost}</p>
        <p><strong>Time:</strong> ${recipe.time} mins</p>
        <p><strong>Ingredients:</strong></p>
        <ul>
            ${recipe.ingredients?.map(item => `<li>${item}</li>`).join('')}
        </ul>
    `;
    document.getElementById("ingredientsContainer").innerHTML = content;

}
