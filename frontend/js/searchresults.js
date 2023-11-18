console.log("Script loaded successfully");

otherSiteRequest = false;
endResults = 5;
searchInputValue = "";
document.addEventListener("DOMContentLoaded", function () {
    // Call your functions here after the HTML has fully loaded
    var search = localStorage.getItem("searchValue");
    console.log("local storage: " + search);

    if(search !== null) {
        // The search value exists in local storage
        otherSiteRequest = true;
        searchFromOther();
    } else {
        
    }
});
if(otherSiteRequest === false) {

    var inputElement = document.getElementById("search-bar");

        inputElement.addEventListener("keydown", function (event) {
            // Check if the pressed key is Enter (key code 13)
            if (event.keyCode === 13) {
                
                var searchInput = document.getElementById("search-bar").value;
                searchInputValue = searchInput;
                // Update the UI with the search input
                document.getElementById("search-results-for").textContent = "Search Results for: " + searchInput;
                document.getElementById("title").textContent = searchInput + " - results";

                // Load in search results using the input
                searchArXiv(searchInput, endResults);
            }
        });
}
window.addEventListener("scroll", function () {
    // Check if the user has reached the bottom of the page
    if (window.innerHeight + window.scrollY + 100 >= document.body.offsetHeight) {
        // Load more results when scrolling to the bottom
        loadMoreResults();
    }
});
function loadMoreResults() {
    // Increment the starting point for results
    endResults += 5; // Increase by the desired number of results to load

    searchArXiv(searchInputValue, endResults);
}
function searchFromOther() {

    console.log("searchFromOther called");
    var search = localStorage.getItem("searchValue");
    searchInputValue = search;
    localStorage.removeItem("searchValue");
    document.getElementById("search-results-for").textContent = "Search Results for: " + search;
    document.getElementById("title").textContent = search + " - results";
    searchArXiv(search, endResults);
}

function searchArXiv(search, end) {

    // Get the value from the search bar
    var searchValue = search

    var operators = ['AND', 'OR', 'NOT'];
    var queryParts = [];
    var useLogicalOperator = false;

    operators.forEach(operator => {
        if (searchValue.includes(operator)) {
            useLogicalOperator = true;
        }
    });

    // If a logical operator is found, construct the query with it
    if (useLogicalOperator) {
        // Surround each keyword with double-quotes to handle phrases
        searchValue = searchValue.split(' ').map(keyword => `"${keyword}"`).join(' ');
    }
    // ArXiv API endpoint
    var apiUrl = "https://export.arxiv.org/api/query";

    // Construct the query parameters
    var params = {
        search_query: "all:" + searchValue,
        sortBy: "relevance",
        sortOrder: "descending",
        start: 0,
        max_results: end // number of results to load
    };

    // Convert the params object to a query string
    var queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');

    // Make the API request
    fetch(apiUrl + '?' + queryString)
        .then(response => response.text())
        .then(data => {

            // print output to console
            console.log(data);

            //Parse XML file
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(data, "text/xml");

            // Extracting titles, summaries, authors, and links from the XML
            var entries = xmlDoc.querySelectorAll("entry");
            var results = [];

            entries.forEach(entry => {
                
                // Extract title and summary
                var title = entry.querySelector("title").textContent;
                var summary = entry.querySelector("summary").textContent;

                // Extract authors and concatenate their names
                var authorElements = entry.querySelectorAll("author");
                var authors = Array.from(authorElements).map(author => author.textContent).join(",");

                // Extract link
                var linkElement = entry.querySelector("link[title='pdf']");
                var link = linkElement ? linkElement.getAttribute("href") : "Link not available";

                results.push({ title, summary, authors, link });
            });

            // Display titles, summaries, authors, and links on the HTML page
            displayResults(results);
        })
        .catch(error => {
            // Error catcher
            console.error('Error fetching data:', error);
        });
}

function displayResults(results) {
    var resultsContainer = document.getElementById("search-results-container");
    var buttonsContainer = document.getElementById("article-button-container");

    // Clear previous results
    resultsContainer.innerHTML = "";
    buttonsContainer.innerHTML = "";

    // Create and append new elements for each result
    results.forEach(result => {
        var resultContainer = document.createElement("div");
        resultContainer.classList.add("results-div");

        // Create a link element with the title as the text content
        var titleLinkElement = document.createElement("a");
        titleLinkElement.textContent = result.title;
        titleLinkElement.classList.add('hyperlink-style');
        titleLinkElement.addEventListener("click", function() {
            // Redirect to the article link when the title is clicked
            this.classList.add('clicked');
            window.open(`chatbot.html?pdfURL=${encodeURIComponent(result.link)}`, '_blank');
            saveHistory(result.title,result.link);
        });
        
        var buttonContainer = document.createElement("div");
        buttonContainer.classList.add("image-div"); // added to "button-div" class

        var titleElement = document.createElement("h3");
        titleElement.appendChild(titleLinkElement);

        var summaryElement = document.createElement("p");
        summaryElement.innerHTML = "<b>Description:</b> " + result.summary;

        var authorsElement = document.createElement("p");
        authorsElement.innerHTML = "<b>Authors:</b> " + result.authors;

        // Append all elements to the result container
        resultContainer.appendChild(titleElement);
        resultContainer.appendChild(summaryElement);
        resultContainer.appendChild(authorsElement);

        // Append the result container to the results container
        resultsContainer.appendChild(resultContainer);
        // Create a new img element for each result
        var articleImage = document.createElement("img");
        articleImage.classList.add("article-icons"); // added to "image-div" class
        articleImage.src = "../images/article_icon.png";
        articleImage.alt = "Read Article Image";
        articleImage.addEventListener("click", function() {
            // Redirect to the article link when the image is clicked (temporarily functionalaity and it will be changed to go to chat page) 
            window.open(`chatbot.html?pdfURL=${encodeURIComponent(result.link)}`, '_blank');
            saveHistory(result.title,result.link);
        });

        buttonContainer.appendChild(articleImage);
        buttonsContainer.appendChild(buttonContainer);
    });
}

function saveHistory(title, pdf) {
    // Retrieve the paperHistory from localStorage
    var paperHistoryString = localStorage.getItem('paperHistory');
    var paperHistory = paperHistoryString ? JSON.parse(paperHistoryString) : [];

    // Define the new paper
    var newPaper = [title, pdf];

    // Remove any duplicate from the array
    paperHistory = paperHistory.filter(paper => paper[0] !== title || paper[1] !== pdf);

    // Add the new paper to the array
    console.log("adding: " + newPaper);
    paperHistory.push(newPaper);

    // Store the updated array in localStorage
    localStorage.setItem('paperHistory', JSON.stringify(paperHistory));
}

