var inputElement = document.getElementById("search-bar");

inputElement.addEventListener("keydown", function (event) {
    // Check if the pressed key is Enter (key code 13)
    if (event.keyCode === 13) {
        var search = document.getElementById("search-bar").value;
        if (search !== null && search.trim() !== "") {
            localStorage.setItem("searchValue", search);
        }

        // Construct the URL for the destination HTML file
        var destinationURL = "../public/searchresults.html";

        // Redirect to the destination HTML file first
        window.location.href = destinationURL;

        event.preventDefault();
    }
});
