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
    }

    if (limit != 0) { //show button if there is more
        document.getElementById("showMoreViewed").style.display = "block";
    }
    else { //hide button if showed all
        document.getElementById("showMoreViewed").style.display = "none";
    }
}

function getNewPapers(max) {
    newPapers = []; //clear 
    const prefix = "all:";
    const currentDate = new Date();
    const year = currentDate.getFullYear() % 100; 
    const month = currentDate.getMonth() + 1; 

    // Pad the month with a leading zero if it's a single digit
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;

    const yearAndMonth = `${prefix}${year}${formattedMonth}`;

    // Searches recent articles from current month
    fetch(`http://export.arxiv.org/api/query?search_query=${yearAndMonth}&sortBy=submittedDate&sortOrder=descending&max_results=${max}`)
        .then(response => response.text())
        .then(data => {

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, 'text/xml');
            const entries = xmlDoc.getElementsByTagName('entry');

            // Extract Title and PDF Link
            for (const entry of entries) {
                const title = entry.getElementsByTagName('title')[0].textContent;
                const pdfLink = entry.getElementsByTagName('link')[1].getAttribute('href'); 
                newPapers.push({ title, pdfLink });
            }
            addNewPapers();

        })
        .catch(error => {
            console.error('Error fetching arXiv data:', error);
        });
}

function getViewedPapers() {
    // Retrieve the paperHistory from localStorage
    var paperHistoryString = localStorage.getItem('paperHistory');

    // Parse the string into an array
    var paperHistory = paperHistoryString ? JSON.parse(paperHistoryString) : [];
    console.log(paperHistory);

    if (!paperHistory|| !paperHistory.length) {
        document.getElementById("nothing").style.display = "block";
    }
    else {
        document.getElementById("nothing").style.display = "none";
    }

    addViewedPapers(paperHistory);
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

});
