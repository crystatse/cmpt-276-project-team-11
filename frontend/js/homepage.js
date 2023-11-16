//temporary
var newPapers = [];
var viewedPapersr = [];

// still needs proper routing to chatbot
function addNewPapers() {
    var ul = document.getElementById("new");

    // Iterate over the newPapers array in reverse order to show newest first
    for (let i = newPapers.length - 1; i >= 0; i--) {
        console.log("iterating");
        const paper = newPapers[i];

        var li = document.createElement("li");
        li.setAttribute("class", "published");

        var a = document.createElement("a");
        a.href = `chatbot.html?pdfURL=${encodeURIComponent(paper.pdfLink)}`;
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

// still in progress
function addViewedPapers() {
    var ul = document.getElementById("recent");
    var li = document.createElement("li");
    li.setAttribute("class", "published")

    var a = document.createElement("a");
    a.href = "chatbot.html";
    a.appendChild(li);

    var img = document.createElement("img");
    img.src = "../images/article_icon.png";
    li.appendChild(img);

    // to be changed
    var p = document.createElement("p");
    p.innerHTML = "recent published paper example #1";
    li.appendChild(p);

    ul.insertBefore(a, ul.childNodes[0]);
    console.log('added');
}

// temporary testing functionality
for (let i = 0; i < 9; i++) {
    addViewedPapers();
}

// temporary search input saving
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


// finished
function getNewPapers() {
    const prefix = "all:";
    const currentDate = new Date();
    const year = currentDate.getFullYear() % 100; 
    const month = currentDate.getMonth() + 1; 

    // Pad the month with a leading zero if it's a single digit
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;

    const yearAndMonth = `${prefix}${year}${formattedMonth}`;

    // Searches recent articles from current month
    fetch(`http://export.arxiv.org/api/query?search_query=${yearAndMonth}&sortBy=submittedDate&sortOrder=descending&max_results=9`)
        .then(response => response.text())
        .then(data => {

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, 'text/xml');
            const entries = xmlDoc.getElementsByTagName('entry');

            // Extract Title and PDF Link
            for (const entry of entries) {
                const title = entry.getElementsByTagName('title')[0].textContent;
                const pdfLink = entry.getElementsByTagName('link')[1].getAttribute('href'); 

                console.log('Title:', title);
                console.log('PDF Link:', pdfLink);
                console.log('---');
                newPapers.push({ title, pdfLink });
            }
            addNewPapers();

        })
        .catch(error => {
            console.error('Error fetching arXiv data:', error);
        });
}

getNewPapers();

