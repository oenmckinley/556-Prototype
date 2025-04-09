const index2month = {
    0:'Jan',
    1:'Feb',
    2:'Mar',
    3:'Apr',
    4:'May',
    5:'Jun',
    6:'Jul',
    7:'Aug',
    8:'Sep',
    9:'Oct',
    10:'Nov',
    11:'Dec'
}

const index2day = {
    1:'Mon',
    2:'Tue',
    3:'Wed',
    4:'Thu',
    5:'Fri',
    6:'Sat',
    0:'Sun'
}

window.onload = function() {

    // load added recipes
    fetch('../data/added_recipes.json').then(response => {
        if(!response.ok){
            throw new Error('Load data failed!');
        }
        return response.json();
    }).then(data => {
        let added_recipes = data;

        const added_recipes_div = document.getElementsByClassName('added_recipes_list')[0];
        
        for (let index = 0; index < added_recipes.length; index++) {
            const newDiv = document.createElement('div');
            newDiv.classList.add('recipes');
            newDiv.style.top = `${Math.floor(index/6)*20+3}%`
            newDiv.style.left = `${(index%6)*16+3}%`;
            const newp = document.createElement('p');
            newp.classList.add('recipe_name');
            newp.innerHTML = added_recipes[index];
            newDiv.appendChild(newp);
            added_recipes_div.appendChild(newDiv);
        }

        let recipes = document.getElementsByClassName('recipes');
        let recipesList = Array.from(recipes);
        recipesList.forEach(element => {
            element.addEventListener('mouseenter', (event) => {
                const hover_div = document.createElement('div');
                hover_div.classList.add('recipe_hover_div');
                element.appendChild(hover_div);

            });
            element.addEventListener('mouseleave', (event) => {
                const delete_div = element.getElementsByClassName('recipe_hover_div')[0];
                console.log(delete_div);
                if(delete_div){
                    element.removeChild(delete_div);
                }
            });

        });
    });

    // load the scheduled meals
    const currentDate = new Date();
    const dayone = new Date();
    dayone.setDate(currentDate.getDate()-currentDate.getDay());

    fetch('../data/scheduled_recipes.json').then(response => {
        if(!response.ok){
            throw new Error('Load data failed!');
        }
        return response.json();
    }).then(data => {

        const date_range = document.getElementsByClassName('schedule_date_selection')[0];
        date_range.innerHTML = `${index2month[dayone.getMonth()]} ${dayone.getDate()} - `;

        for(let index=0; index<7; index++){
            const newday = new Date();
            newday.setDate(dayone.getDate()+index);
            if(index==6){
                date_range.innerHTML += `${index2month[newday.getMonth()]} ${newday.getDate()}`;
            }

            let key = `${newday.getFullYear()}-${newday.getMonth()+1}-${newday.getDate()}`;
            let meals = data[key];
            const currentDiv = document.getElementById(`day${index+1}`);
            currentDiv.getElementsByClassName('calendar_date')[0].innerHTML = `${index2day[newday.getDay()]} ${index2month[newday.getMonth()]} ${newday.getDate()}`;
            if(meals){
                let breakfast = meals['breakfast'];
                let lunch = meals['lunch'];
                let dinner = meals['dinner'];

                if(breakfast){
                    const breakfast_div = currentDiv.getElementsByClassName('calendar_breakfast')[0]
                    breakfast_div.getElementsByClassName('meal_name')[0].innerHTML = breakfast.join(', ');
                    breakfast_div.style.background = '#FFD9D9';
                }
                if(lunch){
                    const lunch_div = currentDiv.getElementsByClassName('calendar_lunch')[0]
                    lunch_div.getElementsByClassName('meal_name')[0].innerHTML = lunch.join(', ');
                    lunch_div.style.background = '#FEE6C9';
                }
                if(dinner){
                    const dinner_div = currentDiv.getElementsByClassName('calendar_dinner')[0]
                    dinner_div.getElementsByClassName('meal_name')[0].innerHTML = dinner.join(', ');
                    dinner_div.style.background = '#D2F0FF';
                }
            }
            

        }

    });

}
