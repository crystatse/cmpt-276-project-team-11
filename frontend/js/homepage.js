var newPapers = [];
var newCount = 10;
var viewedCount = 10;
getNewPapers(newCount);
getViewedPapers();

function addNewPapers() {
    // console.log(newPapers);

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
            saveHistory(paper.title, paper.pdfLink, paper.authors);
            window.location.href = window.location.href.split('#')[0] + '#row';
            location.reload();
        });
        a.appendChild(li);

        var img = document.createElement("img");
        img.src = "../images/article_icon.png";
        li.appendChild(img);

         var pInfo = document.createElement("p");
        pInfo.innerHTML = `<strong>Title:</strong> ${paper.title}<br>
                           <strong>Author(s):</strong> ${paper.authors}<br>
                           <strong>Published Date:</strong> ${paper.date.split('T')[0]}`; // Slice the date string at 'T'
        li.appendChild(pInfo);

        ul.insertBefore(a, ul.childNodes[0]);
    }
    return true;
}

function addViewedPapers(papers) {
    var ul = document.getElementById("recent");
    if (!ul) {
        // console.log('Element with ID "recent" not found.');
        return;
    }

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
            saveHistory(papers[i][0], papers[i][1], papers[i][2]);
            window.location.href = window.location.href.split('#')[0] + '#row';
            location.reload();
        });
        a.appendChild(li);

        var img = document.createElement("img");
        img.src = "../images/article_icon.png";
        li.appendChild(img);

        var pInfo = document.createElement("p");
        pInfo.innerHTML = `<strong>Title:</strong> ${papers[i][0]}<br>
                           <strong>Author(s):</strong> ${papers[i][2]}<br>
                           <strong>Last Viewed:</strong> ${papers[i][3]}`;
        li.appendChild(pInfo);

        ul.insertBefore(a, ul.childNodes[0]);
    }

    // Check if the "showMoreViewed" element exists before trying to access its style property
    var showMoreViewedButton = document.getElementById("showMoreViewed");
    if (showMoreViewedButton) {
        if (limit !== 0) { // show button if there is more
            showMoreViewedButton.style.display = "block";
        } else { // hide button if showed all
            showMoreViewedButton.style.display = "none";
        }
    }
    return true;
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
                const authorElements = entry.querySelectorAll("author");
                const authors = Array.from(authorElements).map(author => author.textContent).join(",");
                const date = entry.getElementsByTagName('published')[0].textContent;
                const pdfLink = entry.getElementsByTagName('link')[1].getAttribute('href'); 
                newPapers.push({ title, authors, date, pdfLink });
            }
            addNewPapers();

        })
        .catch(error => {
            // console.error('Error fetching arXiv data:', error);
        });
}

function getViewedPapers() {
    // Retrieve the paperHistory from localStorage
    var paperHistoryString = localStorage.getItem('paperHistory');

    // Parse the string into an array
    var paperHistory = paperHistoryString ? JSON.parse(paperHistoryString) : [];
    // console.log(paperHistory);

    var nothingElement = document.getElementById("nothing");
    if (nothingElement) {
        if (!paperHistory || !paperHistory.length) {
            nothingElement.style.display = "block";
        } else {
            nothingElement.style.display = "none";
        }
    }

    addViewedPapers(paperHistory);
}

function saveHistory(title, pdf, authors) {
    // Retrieve the paperHistory from localStorage
    var paperHistoryString = localStorage.getItem('paperHistory');
    var paperHistory = paperHistoryString ? JSON.parse(paperHistoryString) : [];

    // Get the current date and time
    var currentDate = new Date();
    var dateString = currentDate.toISOString().split('T')[0];
    var timeString = currentDate.toTimeString().split(' ')[0];

    // Combine date and time into a single string
    var dateTimeString = dateString + ', ' + timeString;

    // Define the new paper
    var newPaper = [title, pdf, authors, dateTimeString];

    // Remove any duplicate from the array
    paperHistory = paperHistory.filter(paper => paper[0] !== title || paper[1] !== pdf);

    // Add the new paper to the array
    console.log("adding: " + newPaper);
    paperHistory.push(newPaper);

    // Store the updated array in localStorage
    localStorage.setItem('paperHistory', JSON.stringify(paperHistory));
}

var newButton = document.getElementById("showMoreNew");
if (newButton !== null) {
    newButton.addEventListener("click", () => {
        newCount += 10;
        getNewPapers(newCount);
    })
}

var viewedButton = document.getElementById("showMoreViewed");
if(viewedButton !== null) {
    viewedButton.addEventListener("click", () => {
        viewedCount += 10;
        getViewedPapers();

    })
}

var searchBar = document.getElementById('search');
if (searchBar !== null) {
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
    
    })
}
module.exports = {
    getNewPapers,
    addNewPapers,
    getViewedPapers,
    addViewedPapers,
    saveHistory
};