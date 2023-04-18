document.getElementById("allergy-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const allergiesInput = document.getElementById("allergies");
    const allergies = allergiesInput.value.split(",").map(allergy => allergy.trim());

    try {
        const mealSuggestions = await getMealSuggestions(allergies);
        renderMealSuggestions(mealSuggestions);
    } catch (error) {
        console.error("Error fetching meal suggestions:", error);
    }
});

async function getRandomMeals(numberOfMeals = 5) {
    const apiKey = "1"; // Use the test API key '1' for development
    const apiEndpoint = "https://www.themealdb.com/api/json/v1/1/random.php";
    const meals = [];

    for (let i = 0; i < numberOfMeals; i++) {
        const response = await fetch(`${apiEndpoint}?apiKey=${apiKey}`);

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const jsonResponse = await response.json();
        meals.push(jsonResponse.meals[0]);
    }

    return meals;
}

async function getMealSuggestions(allergies) {
    const allMeals = await getRandomMeals();
    const filteredMeals = allMeals.filter(meal => {
        const ingredients = [];

        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            if (ingredient) {
                ingredients.push(ingredient.toLowerCase());
            } else {
                break;
            }
        }

        return !allergies.some(allergy => ingredients.includes(allergy.toLowerCase()));
    });

    return filteredMeals;
}

function renderMealSuggestions(meals) {
    const container = document.getElementById("meal-suggestions-container");
    container.innerHTML = ""; // Clear any existing content

    meals.forEach(meal => {
        const mealDiv = document.createElement("div");
        mealDiv.className = "meal";

        const mealTitle = document.createElement("h3");
        mealTitle.innerText = meal.strMeal;
        mealDiv.appendChild(mealTitle);

        const mealImage = document.createElement("img");
        mealImage.src = meal.strMealThumb;
        mealImage.alt = meal.strMeal;
        mealDiv.appendChild(mealImage);

        container.appendChild(mealDiv);
    });
}
function playSound() {
    new Audio("./click.mp3").play();
}