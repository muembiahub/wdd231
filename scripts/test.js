const navButton = document.querySelector('#nav-button');

navButton.addEventListener('click', () => {
  navButton.classList.toggle('show');
    navMenu.classList.toggle('show');
});
const navMenu = document.querySelector('#nav-menu');
lastModified = new Date(document.lastModified);
document.querySelector('#last-modified').textContent = `${lastModified.toLocaleDateString()} ${lastModified.toLocaleTimeString()}`;
const currentYear = new Date().getFullYear();
document.querySelector('#current-year').textContent = currentYear;
const footer = document.querySelector('footer');
footer.innerHTML = footer.innerHTML.replace('2023', currentYear);
