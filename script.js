const searchBtn = document.querySelector('.search-button');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const toggleButton = document.getElementById("fav-button-control");
const dbObjectFavList = "favouritesList";
if (localStorage.getItem(dbObjectFavList) == null) {
   localStorage.setItem(dbObjectFavList, JSON.stringify([]));
}

function updateTask() {
    const db = JSON.parse(localStorage.getItem(dbObjectFavList));
}

toggleButton.addEventListener("click", function () {
    favMealModel();
    window.onload = scrollToMiddle();
});

// event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

async function getMealList() {
    const list = JSON.parse(localStorage.getItem(dbObjectFavList));
    const searchInputTxt = document.getElementById('search-data').value.trim();
  
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`);
      const data = await response.json();
  
      let html = "";
      if (data.meals && data.meals.length > 0) {
        data.meals.forEach(meal => {
          const isMealFav = isFav(list, meal.idMeal);
          html += `
            <div class="meal-item" data-id="${meal.idMeal}">
              <div class="meal-img">
                <img src="${meal.strMealThumb}" alt="food">
              </div>
              <div class="meal-name">
                <h3>${meal.strMeal}</h3>
                <a href="#" class="recipe-btn">Ingredients</a>
              </div>
              <div class="like">
                <i class="fa-solid fa-heart ${isMealFav ? 'active' : ''}" onclick="addRemoveToFavList(${meal.idMeal})"></i>
              </div>
            </div>
          `;
        });
        mealList.classList.remove('notFound');
      } else {
        html = `<div class="info">
                  <h2>Oops, can't find the recipe you're looking for...</h2>
                </div>`;
        mealList.classList.add('notFound');
      }
  
      mealList.innerHTML = html;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  
async function getMealRecipe(e) {
    e.preventDefault();
  
    if (e.target.classList.contains('recipe-btn')) {
      const mealItem = e.target.closest('.meal-item');
      const mealId = mealItem.dataset.id;
  
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        mealRecipeModal(data.meals);
      } catch (error) {
        console.error("Error fetching recipe data:", error);
      }
    }
  }
  

const fetchMealsFromApi = async (url, value) => {
    const response = await fetch(`${url + value}`);
    const meals = await response.json();
    return meals;
}

// create a modal
function mealRecipeModal(meal){

    meal = meal[0];
    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

// for favourites
function addRemoveToFavList(id) {
    let db = JSON.parse(localStorage.getItem(dbObjectFavList));
    let ifExist = false;
    for (let i = 0; i < db.length; i++) {
        if (id == db[i]) {
            ifExist = true;
        }

    } if (ifExist) {
        db.splice(db.indexOf(id), 1);

    } else {
        db.push(id);
        console.log(db);
    }

    localStorage.setItem(dbObjectFavList, JSON.stringify(db));
    getMealList();
    favMealModel();
    updateTask();
}


function isFav(list, id) {
    let res = false;
    for (let i = 0; i < list.length; i++) {
        if (id == list[i]) {
            res = true;
        }
    }
    return res;
}



// create a modal
async function favMealModel(){
    let favList = JSON.parse(localStorage.getItem(dbObjectFavList));
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";

    if (favList.length == 0) {
        html = `<h3 class="emptyList"><b>
        Your favorite recipes list is currently empty. Start adding recipes by clicking the 'Add to Favorites' button on any recipe page!</b></h3>`
    }else{
        for (let i = 0; i < favList.length; i++) {
            const favMealList = await fetchMealsFromApi(url, favList[i]);
            if (favMealList.meals[0]) {
                let element = favMealList.meals[0];
                html += `
                <div class="fav-item">

              
                <div class="fav-item-photo">
                    <img src="${element.strMealThumb}" alt="">
                </div>
                <div class="fav-item-details">
                    <div class="fav-item-name">
                        <strong>Name: </strong>
                        <span class="fav-item-text">
                           ${element.strMeal}
                        </span>
                    </div>
                    <div id="fav-like-button" onclick="addRemoveToFavList(${element.idMeal})">
                        Remove
                    </div>

                </div>

            </div>               
             `
            }
        }
    }
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

// Function to scroll to the middle of the page
function scrollToMiddle() {
    const middleOfPage = document.body.scrollHeight / 2; // Calculate the middle of the page
    window.scrollTo(0, middleOfPage);
  }
  
  
