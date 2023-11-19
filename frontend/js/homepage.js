var newPapers = [];
var newCount = 9;
var viewedCount = 9;
getNewPapers(newCount);
getViewedPapers();

function addNewPapers() {
    console.log(newPapers);

    // clear list
    var ul = document.getElementById("new");
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
        console.log("removing");
    }

    // Iterate over the newPapers array in reverse order to show newest first
    for (let i = newPapers.length - 1; i >= 0; i--) {

        console.log("Making New Published Papers");
        const paper = newPapers[i];

        var li = document.createElement("li");
        li.setAttribute("class", "published");

        var a = document.createElement("a");
        a.addEventListener("click", function() {
            // Redirect to the article link when the image is clicked (temporarily functionalaity and it will be changed to go to chat page) 
            window.open(`chatbot.html?pdfURL=${encodeURIComponent(paper.pdfLink)}`, '_blank');
            saveHistory(paper.title, paper.pdfLink);
            location.reload();
        });
        a.appendChild(li);

        var img = document.createElement("img");
        img.src = "../images/article_icon.png";
        li.appendChild(img);

        var p = document.createElement("p");
        p.innerHTML = paper.title;
        li.appendChild(p);

        ul.insertBefore(a, ul.childNodes[0]);
    }
}

function addViewedPapers(papers) {
    var ul = document.getElementById("recent");

    // clear list
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
        console.log("removing");
    }

    var limit = 0;
    if (viewedCount < papers.length) {
        limit = papers.length - viewedCount;
    }
    else {
        limit = 0;
    }
    
    for (let i = limit; i < papers.length; i++) {

        var li = document.createElement("li");
        li.setAttribute("class", "published");

        var a = document.createElement("a");
        a.addEventListener("click", function() {
            // Redirect to the article link when the image is clicked (temporarily functionalaity and it will be changed to go to chat page) 
            window.open(`chatbot.html?pdfURL=${encodeURIComponent(papers[i][1])}`, '_blank');
        });
        a.appendChild(li);

        var img = document.createElement("img");
        img.src = "../images/article_icon.png";
        li.appendChild(img);

        var p = document.createElement("p");
        p.innerHTML = papers[i][0];
        li.appendChild(p);

    ul.insertBefore(a, ul.childNodes[0]);
    console.log('added');
}

// temporary testing functionality
for (let i = 0; i < 9; i++) {
    addViewedPapers();
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

var newButton = document.getElementById("showMoreNew");
newButton.addEventListener("click", () => {

    newCount += 9;
    getNewPapers(newCount);

})

var viewedButton = document.getElementById("showMoreViewed");
viewedButton.addEventListener("click", () => {

    viewedCount += 9;
    getViewedPapers();

})

var searchBar = document.getElementById('search');
searchBar.addEventListener('keydown', function(e) {

    if (e.key === 'Enter') {
        // Save input data to localStorage
        localStorage.setItem('searchQuery', searchBar.value);

        // searching and going to search page code
        var search = document.getElementById("search").value;
        if (search !== null && search.trim() !== "") {
            localStorage.setItem("searchValue", search);
            console.log("added search value to localStorage");
        }

        // Construct the URL for the destination HTML file
        var destinationURL = "../public/searchresults.html";

        // Redirect to the destination HTML file first
        window.location.href = destinationURL;

        event.preventDefault();
        // end
    }

})}
