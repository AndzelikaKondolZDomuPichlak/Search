const states = {
  IDLE: "IDLE",
  LOADING: "LOADING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  NO_RESULTS: "NO_RESULTS",
};

let currentState = states.IDLE;

const searchButton = document.getElementById("search");
const input = document.getElementById("input");
const spinner = document.getElementById("spinner");
const resultsList = document.getElementById("results");
const messageElement = document.getElementById("message");
const resetButton = document.getElementById("resetButton");

function setState(newState) {
  currentState = newState;
  render();
}

function showSpinner(isVisible) {
  if (isVisible) {
    spinner.classList.add("search__spinner--visible");
  } else {
    spinner.classList.remove("search__spinner--visible");
  }
}

function showMessage(message) {
  messageElement.textContent = message;
}

function clearResults() {
  resultsList.innerHTML = "";
}

resetButton.addEventListener("click", () => {
  setState(states.IDLE);
  input.value = "";
  searchButton.disabled = true;
});

function render() {
  switch (currentState) {
    case states.LOADING:
      showSpinner(true);
      clearResults();
      resultsList.classList.remove("search__results--visible");
      showMessage("");
      resetButton.classList.remove("search__reset--visible");
      break;
    case states.SUCCESS:
      resetButton.classList.add("search__reset--visible");
      showSpinner(false);
      resultsList.classList.add("search__results--visible");
      break;
    case states.ERROR:
      showMessage("An error occurred. Please try again.");
      clearResults();
      resetButton.classList.add("search__reset--visible");
      showSpinner(false);
      break;
    case states.NO_RESULTS:
      showMessage("No results found.");
      clearResults();
      resetButton.classList.add("search__reset--visible");
      showSpinner(false);
      break;
    default:
      resetButton.classList.remove("search__reset--visible");
      showSpinner(false);
      showMessage("");
      resultsList.classList.remove("search__results--visible");
  }
}

function displayResults(products) {
  if (products.length === 0) {
    setState(states.NO_RESULTS);
    return;
  }
  products.forEach((product) => {
    const li = document.createElement("li");
    li.classList.add("search__result-item");
    li.innerHTML = `<span class="search__product-name">${product.title}</span>
                    <span class="search__product-price">$${product.price}</span>`;
    resultsList.appendChild(li);
  });
  setState(states.SUCCESS);
}

input.addEventListener("input", () => {
  searchButton.disabled = !input.value.trim();
});

searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  const searchTerm = input.value.trim();

  if (!searchTerm) {
    return;
  }

  setState(states.LOADING);

  const apiURL = `https://dummyjson.com/products/search?q=${encodeURIComponent(
    searchTerm
  )}&limit=5&delay=1000`;

  fetch(apiURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      displayResults(data.products);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      setState(states.ERROR);
    });
});
