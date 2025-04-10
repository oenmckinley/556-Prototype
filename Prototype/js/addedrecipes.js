let addedRecipes = sessionStorage.getItem('addedRecipes');
if (addedRecipes != null) addedRecipes = addedRecipes.split(',');
else if (addedRecipes == null) addedRecipes = [];

let scheduledRecipes = sessionStorage.getItem('scheduledRecipes');
if (scheduledRecipes != null) scheduledRecipes = scheduledRecipes.split(',');
else if (scheduledRecipes == null) scheduledRecipes = [];

function addRecipe(title, cid) {
    if (!addedRecipes.includes(title)) {
        addedRecipes.push(title);
    }

    let card = document.getElementById(cid);
    let newHTML = card.innerHTML;

    newHTML = newHTML.replace("add-recipe","rem-recipe");
    newHTML = newHTML.replace("addRecipe(",'remRecipe(');
    newHTML = newHTML.replace(">Add<",'>Remove<');

    card.innerHTML = newHTML;
    sessionStorage.setItem('addedRecipes', addedRecipes);
    console.log(addedRecipes)
}

function remRecipe(title, cid) {
    const index = addedRecipes.indexOf(title);
    if (index > -1) { // only splice array when item is found
        addedRecipes.splice(index, 1); // 2nd parameter means remove one item only
    }

    let card = document.getElementById(cid);
    let newHTML = card.innerHTML;

    newHTML = newHTML.replace("rem-recipe","add-recipe");
    newHTML = newHTML.replace("remRecipe(",'addRecipe(');
    newHTML = newHTML.replace(">Remove<",'>Add<');

    card.innerHTML = newHTML;

    sessionStorage.setItem('addedRecipes', addedRecipes);
    console.log(addedRecipes)

}
