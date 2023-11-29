document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const suggestions = document.getElementById('suggestions');
    const favoritesList = document.getElementById('favorites-list');
    const apiKey = '1'; // Use the developer test key '1'

    // Function to fetch meal suggestions based on user input
    const fetchSuggestions = async () => {
        const query = searchInput.value;
        suggestions.innerHTML = '';

        if (query.length > 2) {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/${apiKey}/search.php?s=${query}`);
            const data = await response.json();

            if (data.meals) {
                data.meals.forEach(meal => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.className = 'suggestion-item';
                    suggestionItem.textContent = meal.strMeal;

                    // Add a "Favorite" button
                    const favoriteButton = document.createElement('button');
                    favoriteButton.className = 'btn btn-success btn-sm ml-1 fav';
                    favoriteButton.textContent = 'Favorite';
                    favoriteButton.addEventListener('click', () => addToFavorites(meal));
                    suggestionItem.appendChild(favoriteButton);

                    suggestionItem.addEventListener('click', () => showMealDetail(meal));
                    suggestions.appendChild(suggestionItem);
                });
            }
        }
    };

    // Function to add a meal to favorites
    const addToFavorites = (meal) => {
        const favoriteItem = document.createElement('li');
        favoriteItem.className = 'list-group-item';
        favoriteItem.innerHTML = `
            <strong class="name_meal">${meal.strMeal}</strong>
            <button class="btn btn-danger btn-sm float-right remove" onclick="removeFromFavorites(this)">Remove</button>
        `;
        favoritesList.appendChild(favoriteItem);

        // Save favorites list to localStorage
        saveFavoritesToLocalStorage();
    };


    // Function to remove a meal from favorites
    window.removeFromFavorites = (button) => {
        const listItem = button.parentElement;
        favoritesList.removeChild(listItem);

        // Save favorites list to localStorage
        saveFavoritesToLocalStorage();
    };

    // Function to save favorites list to localStorage
    const saveFavoritesToLocalStorage = () => {
        // const favoriteItems = Array.from(favoritesList.children).map(item => item.innerText);
        const nameMealElements = Array.from(favoritesList.querySelectorAll('.name_meal'));
        const favoriteNames = nameMealElements.map(element => element.textContent);
        localStorage.setItem('favorites', JSON.stringify(favoriteNames));
    };

    // Function to load favorites from localStorage
    const loadFavoritesFromLocalStorage = () => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        storedFavorites.forEach(favoriteText => {
            const favoriteItem = document.createElement('li');
            favoriteItem.className = 'list-group-item';
            favoriteItem.innerHTML = favoriteText;
            favoritesList.appendChild(favoriteItem);

            // Add a "Remove" button to each loaded favorite
            const removeButton = document.createElement('button');
            removeButton.className = 'btn btn-danger btn-sm float-right';
            removeButton.textContent = 'Remove';
            removeButton.onclick = function () {
                removeFromFavorites(removeButton);
            };
            favoriteItem.appendChild(removeButton);
        });
    };


    // Function to remove a meal from favorites
    // window.removeFromFavorites = (button) => {
    //     const listItem = button.parentElement;
    //     favoritesList.removeChild(listItem);
    // };


    // Function to open a new page with meal details
    const showMealDetail = (meal) => {
        const mealDetailPage = window.open('', '_blank');
        mealDetailPage.document.write(`
            <html>
            <head>
                <title>${meal.strMeal}</title>
                <!-- Add Bootstrap CSS link -->
                <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
                <!-- Add custom CSS styles here if needed -->
                <link rel="stylesheet" href="style2.css">   
            </head>
            <body>
                <h2 class="text-center">${meal.strMeal}</h2>
                <div class="container-box">
                    <div class="container mt-5">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="img-fluid">
                    </div>
                    <div class="container mt-5 main">
                        <h3>Meal Instructions</h3>
                        <p>${meal.strInstructions}</p>
                    </div>
                </div>
            </body>
            </html>
        `);
    };

    // Load favorites from localStorage when the page loads
    loadFavoritesFromLocalStorage();

    // Event listener for search input
    searchInput.addEventListener('input', fetchSuggestions);
});
