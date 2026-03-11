In the following project I have implemented all required features: 
  - navigation menu with at least two categories
  - sticky header
  - logo
  - a small section displaying the number of products currently shown in the grid
  - a grid layout containing products
  - filtering section
  - sorting mechanism
  - banner with category title and description
  - load more functionality
  - footer

The technologies used in the project are HTML, CSS and Vanila JS. The product data is loaded dynamically from a JSON file using the Fetch API. After the page loads, the products are stored in a global array and displayed on the page through a rendering function. Filtering and sorting are handled through separate functions. Users can filter products by category, color, and price range using checkboxes and range sliders. The selected filter values are stored in variables, and whenever a filter changes, the product list is updated by applying the corresponding conditions to the products array. Sorting is implemented using the JavaScript sort() method, allowing products to be sorted alphabetically or by price in ascending or descending order. A “Load More” button is implemented to progressively display products. Initially, a limited number of products are shown, and each click on the button increases the number of visible products until all products are displayed. The product count displayed above the list is updated dynamically to reflect how many results are currently visible. Additionally, a custom alert message appears when a product is added to the cart.

The main challenge I encountered during development was organizing the code and establishing the overall architecture.
