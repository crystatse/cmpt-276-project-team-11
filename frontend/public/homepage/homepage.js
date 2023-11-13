//temporary

function addViewedPapers() {
    var ul = document.getElementById("recent");
    var li = document.createElement("li");
    li.setAttribute("class", "published")

    var a = document.createElement("a");
    a.href = "chatbot.html";
    a.appendChild(li);

    var img = document.createElement("img");
    img.src = "homepage/icons/papers_icon.png";
    li.appendChild(img);

    // to be changed
    var p = document.createElement("p");
    p.innerHTML = "recent published paper example #1";
    li.appendChild(p);

    ul.insertBefore(a, ul.childNodes[0]);
    console.log('added');
}

function addNewPapers() {
    var ul = document.getElementById("new");
    var li = document.createElement("li");
    li.setAttribute("class", "published")

    var a = document.createElement("a");
    a.href = "chatbot.html";
    a.appendChild(li);

    var img = document.createElement("img");
    img.src = "homepage/icons/papers_icon.png";
    li.appendChild(img);

    // to be changed
    var p = document.createElement("p");
    p.innerHTML = "recent published paper example #1";
    li.appendChild(p);

    ul.insertBefore(a, ul.childNodes[0]);
    console.log('added');
}


//temporary testing functionality
for (let i = 0; i < 13; i++) {
    addViewedPapers();
}
var total = 13;
var j = 0
for (j; j < 7; j++) {
    addNewPapers();
}



var searchBar = document.getElementById('search');
searchBar.addEventListener('keydown', function(e) {

    if (e.key === 'Enter') {
        // Save input data to localStorage
        localStorage.setItem('searchQuery', searchBar.value);
    }

});