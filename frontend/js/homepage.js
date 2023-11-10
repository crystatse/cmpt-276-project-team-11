function addViewedPapers() {
    var ul = document.getElementById("recent");
    console.log(ul);
    var li = document.createElement("li");
    li.setAttribute("class", "published")
    console.log(li);

    var a = document.createElement("a");
    // change link later
    a.href = "https://example.com";
    a.appendChild(li);

    var img = document.createElement("img");
    img.src = "../icons/papers_icon.png";
    li.appendChild(img);
    var p = document.createElement("p");
    p.innerHTML = "recent published paper example #1";
    li.appendChild(p);
    ul.insertBefore(a, ul.childNodes[0]);
    console.log('added');
}

function addNewPapers() {
    var ul = document.getElementById("new");
    console.log(ul);
    var li = document.createElement("li");
    li.setAttribute("class", "published")
    console.log(li);

    var a = document.createElement("a");
    // change link later
    a.href = "https://example.com";
    a.appendChild(li);

    var img = document.createElement("img");
    img.src = "../icons/papers_icon.png";
    li.appendChild(img);
    var p = document.createElement("p");
    p.innerHTML = "recent published paper example #1";
    li.appendChild(p);
    ul.insertBefore(a, ul.childNodes[0]);
    console.log('added');
}

for (let i = 0; i < 5; i++) {
    addViewedPapers();
    addNewPapers();
  }

  var searchBar = document.getElementById('search');
  searchBar.addEventListener('input', function() {
      // Save input data to localStorage
      localStorage.setItem('searchQuery', searchBar.value);
  });