let allRecipes = [];

document.getElementById("date-start").value = getDateInput(new Date())
document.getElementById("date-end").value = getDateInput(new Date())

init();

function init() {
    fetch("../recipes_with_instructions.json")
        .then((res) => res.json())
        .then((recipes) => {
            allRecipes = recipes;
            addIngredients(recipes);
            renderGroceries(recipes);
            renderGroceryList(recipes);
        });
}

function renderGroceryList(recipes = allRecipes) {
    let added = document.getElementById("added-select").checked;
    let week = document.getElementById("week-select").checked;
    let range = document.getElementById("range-select").checked;

    let groceries = getGroceries(recipes, added, week, range);

    const list = document.getElementById("gl");
    list.innerHTML = ``;
    if (groceries.length === 0) list.innerHTML = `<li>No ingredients to add.</li>`
    else {
        groceries.forEach((ingredient) => {
            list.innerHTML += `<li>${ingredient}</li>`
        })
    }
}

function getDateFromDiv(id) {
    let d = document.getElementById(id).value.split("-");
    return new Date(d[0],d[1]-1,d[2])
}

function getGroceries(recipes, added, week, range) {
    let addedGroceries = getAddedGroceries();
    let weekGroceries = getWeekGroceries(recipes);

    let start = getDateFromDiv("date-start");
    let end = getDateFromDiv("date-end");
    let rangeGroceries = getRangeGroceries(recipes, start, end);

    let groceries = []

    if (added) {
        addedGroceries.forEach((ingredient) => {
            if (!groceries.includes(ingredient)) groceries.push(ingredient);
        })
    }
    if (week) {
        weekGroceries.forEach((ingredient) => {
            if (!groceries.includes(ingredient)) groceries.push(ingredient);
        })
    }
    if (range) {
        rangeGroceries.forEach((ingredient) => {
            if (!groceries.includes(ingredient)) groceries.push(ingredient);
        })
    }

    return groceries;
}

function scheduled(key, title) {
    //console.log(key in scheduledRecipes)
    if (!(key in scheduledRecipes)) return false;
    if ('breakfast' in scheduledRecipes[key] && scheduledRecipes[key]['breakfast'].includes(title)) return true;
    if ('lunch' in scheduledRecipes[key] && scheduledRecipes[key]['lunch'].includes(title)) return true;
    if ('dinner' in scheduledRecipes[key] && scheduledRecipes[key]['dinner'].includes(title)) return true;
    return false;
}

function added(title) {
    //console.log(addedRecipes)
    //console.log(title)
    for (let i = 0; i < addedRecipes.length; i++) {
        if (addedRecipes[i].title === title) {
            return true;
        }
    }
    return false;
}

function getKey(date) {
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
}

function getDateInput(date) {
    return `${date.getFullYear()}-${date.getMonth() < 9 ? "0" + (date.getMonth()+1).toString() : (date.getMonth()+1).toString()}-${date.getDate()}`
}

function addRecipe(title, cardId) {
    const recipe = allRecipes.find(r => r.title === title);
    if (!addedRecipes.some(r => r.title === title)) addedRecipes.push(recipe);
    sessionStorage.setItem("addedRecipes", JSON.stringify(addedRecipes));
    //document.getElementById(cardId).querySelector("button").outerHTML = `<button class="rem-recipe" onclick="remRecipe('${title}', '${cardId}')">Remove</button>`;
    init();
}

function remRecipe(title, cardId) {
    addedRecipes = addedRecipes.filter(r => r.title !== title);
    sessionStorage.setItem("addedRecipes", JSON.stringify(addedRecipes));
    document.getElementById(cardId).querySelector("button").outerHTML = `<button class="add-recipe" onclick="addRecipe('${title}', '${cardId}')">Add</button>`;
    init();
}


function renderGroceries(recipes = allRecipes) {
    const grid1 = document.getElementById("addedGrid");
    const grid2 = document.getElementById("weekGrid");
    const grid3 = document.getElementById("rangeGrid");
    grid1.innerHTML = "";
    grid2.innerHTML = "";
    grid3.innerHTML = "";

    let start = getDateFromDiv("date-start");
    let end = getDateFromDiv("date-end");

    let weekRecipes = getWeekRecipes(recipes);
    let rangeRecipes = getRangeRecipes(recipes, start, end);

    if (addedRecipes.length > 0) {
        let i = 0;
        addedRecipes.forEach((recipe) => {
            const title = recipe.title || "";
            const ingredients = recipe.ingredients || [];
            const preferences = recipe.preference || [];
            const restrictions = recipe.restriction || [];
            const utensils = recipe.utensils || [];
            const instruction = recipe.instruction || "";

            const card = document.createElement("div");
            card.className = "recipe-card groceries-card";
            card.id = "addcard" + i.toString();
            card.innerHTML = `<h4>${recipe.title}</h4>`;
            //card.innerHTML = `
          //<h4>${recipe.title}</h4>
          //<p><strong>${recipe.cost}</strong> • ${recipe.time} mins</p>
          //${added(title) ? `<button class="rem-recipe" onclick="remRecipe('${title}', '${card.id}')">Remove</button>` : `<button class="add-recipe" onclick="addRecipe('${title}', '${card.id}')">Add</button>`}
            //`;

            //console.log(added(title))
            grid1.appendChild(card);

            i++;

        });
    } else {
        const card = document.createElement("div");
        card.className = "recipe-card no-groceries-card";

        card.innerHTML = `<h4>No Added Recipes!</h4>`;

        grid1.appendChild(card);
    }

    //console.log(scheduledRecipes)
    if (weekRecipes.length > 0) {
        let n = 0;
        let printed = [];
        recipes.forEach((recipe) => {
            const title = recipe.title || "";
            const ingredients = recipe.ingredients || [];
            const preferences = recipe.preference || [];
            const restrictions = recipe.restriction || [];
            const utensils = recipe.utensils || [];
            const instruction = recipe.instruction || "";

            let current_week = []
            let current_date = new Date();
            let current_week_end = new Date();
            current_week_end.setDate(current_week_end.getDate()+6);
            for (let i = 0; i < 7; i++) {
                let curr = new Date();
                curr.setDate(curr.getDate()+i);
                let key = getKey(curr);
                //console.log(scheduledRecipes)
                //console.log(key)
                //console.log(title)

                if (scheduled(key, title) && !printed.includes(title)) {

                    const card = document.createElement("div");
                    card.className = "recipe-card groceries-card";
                    card.id = "weekcard" + n.toString();

                    card.innerHTML = `<h4>${recipe.title}</h4>`;

                    //card.innerHTML = `
                  //<h4>${recipe.title}</h4>
                  //<p><strong>${recipe.cost}</strong> • ${recipe.time} mins</p>
                  //${added(title) ? `<button class="rem-recipe" onclick="remRecipe('${title}', '${card.id}')">Remove</button>` : `<button class="add-recipe" onclick="addRecipe('${title}', '${card.id}')">Add</button>`}
                    //`;

                    grid2.appendChild(card);

                    printed.push(title);
                    n++;
                }
            }
        });
    } else {
        const card = document.createElement("div");
        card.className = "recipe-card no-groceries-card";

        card.innerHTML = `<h4>No Planned Recipes!</h4>`;

        grid2.appendChild(card);
    }

    if (rangeRecipes.length > 0) {
        let n = 0;
        rangeRecipes.forEach((recipe) => {
            const title = recipe.title || "";

            const card = document.createElement("div");
            card.className = "recipe-card groceries-card";
            card.id = "rangecard" + n.toString();

            card.innerHTML = `<h4>${recipe.title}</h4>`;

            //card.innerHTML = `
          //<h4>${recipe.title}</h4>
          //<p><strong>${recipe.cost}</strong> • ${recipe.time} mins</p>
          //${added(title) ? `<button class="rem-recipe" onclick="remRecipe('${title}', '${card.id}')">Remove</button>` : `<button class="add-recipe" onclick="addRecipe('${title}', '${card.id}')">Add</button>`}
            //`;

            grid3.appendChild(card);
            n++;
        });
    } else {
        const card = document.createElement("div");
        card.className = "recipe-card no-groceries-card";

        card.innerHTML = `<h4>No Planned Recipes!</h4>`;

        grid3.appendChild(card);
    }
}

function downloadGroceries(ext) {
    let list = document.getElementById("gl").innerHTML;
    list = list.replaceAll('</li><li>', '\n');
    list = list.replaceAll('<li>', '').replace('</li>', '')
    if (ext === 'csv') list = 'Ingredients\n'

    let filename = 'groceries.'+ext
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(list));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
}
