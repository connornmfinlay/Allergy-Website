// Listen for the form submission event on the element with an ID of "allergy-form"
document.getElementById("allergy-form").addEventListener("submit", async (event) => {
    // Prevent the default form submission behavior of the event
    event.preventDefault();

    // Get the value of the input field with an ID of "allergies"
    const allergiesInput = document.getElementById("allergies");
    // Split the string value into an array of individual allergies, and trim each allergy
    const allergies = allergiesInput.value.split(",").map(allergy => allergy.trim());

    try {
        // Attempt to fetch meal suggestions that don't contain any of the inputted allergies
        const mealSuggestions = await getMealSuggestions(allergies);
        // Render the returned meal suggestions
        renderMealSuggestions(mealSuggestions);
    } catch (error) {
        // If an error occurs during the fetch, log the error to the console
        console.error("Error fetching meal suggestions:", error);
    }
});

// An asynchronous function that returns a specified number of random meals
async function getRandomMeals(numberOfMeals = 5) {
    // Define the API key and endpoint
    const apiKey = "1"; // Use the test API key '1' for development
    const apiEndpoint = "https://www.themealdb.com/api/json/v1/1/random.php";
    // Initialize an empty array to store the fetched meals
    const meals = [];

    // Loop for the specified number of meals
    for (let i = 0; i < numberOfMeals; i++) {
        // Make an API request to the endpoint with the API key as a parameter
        const response = await fetch(`${apiEndpoint}?apiKey=${apiKey}`);

        // Check if the response was successful
        if (!response.ok) {
            // If the response was not successful, throw an error with the response status
            throw new Error(`API request failed with status ${response.status}`);
        }

        // Parse the JSON response and push the first meal in the response array to the meals array
        const jsonResponse = await response.json();
        meals.push(jsonResponse.meals[0]);
    }

    // Return the array of fetched meals
    return meals;
}

// An asynchronous function that retrieves a list of random meals and filters out any meals that contain any of the inputted allergies
async function getMealSuggestions(allergies) {
    // Call the getRandomMeals function to retrieve a list of random meals
    const allMeals = await getRandomMeals();
    // Filter out any meals that contain any of the inputted allergies
    const filteredMeals = allMeals.filter(meal => {
        // Initialize an empty array to store the ingredients of the current meal
        const ingredients = [];

        // Iterate over each of the 20 possible ingredient properties
        for (let i = 1; i <= 20; i++) {
            // Get the value of the current ingredient property
            const ingredient = meal[`strIngredient${i}`];
            // If the ingredient property exists, push the ingredient to the ingredients array
            if (ingredient) {
                ingredients.push(ingredient.toLowerCase());
            } else {
                // If the ingredient property does not exist, break out of the loop
                break;
            }
        }

        // Check if any of the inputted allergies are included in the ingredients array
        // Return true if none of the allergies are included, and false otherwise
        return !allergies.some(allergy => ingredients.includes(allergy.toLowerCase()));
    });

    // Return the filtered array of meals
    return filteredMeals;
}

// Define a function called "renderMealSuggestions" that takes an array of meal objects as an argument
function renderMealSuggestions(meals) {
    // Find the container element on the page where meal suggestions will be displayed
    const container = document.getElementById("meal-suggestions-container");
    
    // Clear any existing content inside the container element
    container.innerHTML = "";

    // Loop through each meal object in the array and create a new HTML element to display it
    meals.forEach(meal => {
        // Create a new div element to hold the meal information
        const mealDiv = document.createElement("div");
        mealDiv.className = "meal";

        // Create a new heading element to display the meal title
        const mealTitle = document.createElement("h3");
        mealTitle.innerText = meal.strMeal;
        mealDiv.appendChild(mealTitle);

        // Create a new image element to display the meal thumbnail
        const mealImage = document.createElement("img");
        mealImage.src = meal.strMealThumb;
        mealImage.alt = meal.strMeal;
        mealDiv.appendChild(mealImage);

        // Add the meal div to the container element on the page
        container.appendChild(mealDiv);
    });
}

// Define a function called "playSound" that plays a click sound effect
function playSound() {
    // Create a new Audio object with the path to the click.mp3 file
    new Audio("./click.mp3").play();
}