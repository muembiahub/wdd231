// Inject header.html into a placeholder <div id="header"></div>
fetch('header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;
  });