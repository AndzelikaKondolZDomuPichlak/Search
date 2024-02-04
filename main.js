const initializeSearch = (wrapperId) => {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) {
    console.error("Search wrapper not found");
    return;
  }

  const searchButton = wrapper.querySelector(".search__button");
  const input = wrapper.querySelector(".search__input");
  const spinner = wrapper.querySelector(".search__spinner");
  const resultsList = wrapper.querySelector(".search__results");
  const messageElement = wrapper.querySelector(".search__message");
  const resetButton = wrapper.querySelector(".search__reset");

  const states = {
    IDLE: "IDLE",
    LOADING: "LOADING",
    SUCCESS: "SUCCESS",
    ERROR: "ERROR",
    NO_RESULTS: "NO_RESULTS",
  };

  let currentState = states.IDLE;
  let currentData = null;

  const setState = (newState, payload = null) => {
    currentState = newState;
    currentData = payload;
    render();
  };

  const showSpinner = (isVisible) => {
    spinner.classList[isVisible ? "add" : "remove"]("search__spinner--visible");
  };

  const showMessage = (message) => {
    messageElement.textContent = message;
  };

  const clearResults = () => {
    resultsList.innerHTML = "";
  };

  const displayResults = (products) => {
    clearResults();
    products.forEach((product) => {
      const li = document.createElement("li");
      li.classList.add("search__result-item");
      li.innerHTML = `
        <span class="search__product-name">${product.title}</span>
        <span class="search__product-price">$${product.price}</span>
      `;
      resultsList.appendChild(li);
    });
  };

  const render = () => {
    showSpinner(currentState === states.LOADING);
    messageElement.textContent = "";
    resultsList.classList.remove("search__results--visible");
    resetButton.classList.remove("search__reset--visible");
    searchButton.disabled = currentState === states.LOADING;

    switch (currentState) {
      case states.SUCCESS:
        displayResults(currentData);
        resultsList.classList.add("search__results--visible");
        resetButton.classList.add("search__reset--visible");
        break;
      case states.ERROR:
        clearResults();
        showMessage("An error occurred. Please try again.");
        resetButton.classList.add("search__reset--visible");
        break;
      case states.NO_RESULTS:
        clearResults();
        showMessage("No results found.");
        resetButton.classList.add("search__reset--visible");
        break;
    }
  };

  const fetchSearchResults = async (searchTerm) => {
    setState(states.LOADING);
    try {
      const apiURL = `https://dummyjson.com/products/search?q=${encodeURIComponent(
        searchTerm
      )}&limit=5&delay=1000`;
      const response = await fetch(apiURL);
      if (!response.ok)
        throw new Error(`Network response was not ok: ${response.statusText}`);
      const data = await response.json();
      setState(
        data.products.length === 0 ? states.NO_RESULTS : states.SUCCESS,
        data.products
      );
    } catch (error) {
      console.error("Error fetching data: ", error);
      setState(states.ERROR);
    }
  };

  searchButton.addEventListener("click", (event) => {
    event.preventDefault();
    const searchTerm = input.value.trim();
    if (searchTerm) {
      fetchSearchResults(searchTerm);
    }
  });

  resetButton.addEventListener("click", () => {
    setState(states.IDLE);
    input.value = "";
    searchButton.disabled = true;
  });

  input.addEventListener("input", () => {
    searchButton.disabled = !input.value.trim();
  });
};

initializeSearch("component");
