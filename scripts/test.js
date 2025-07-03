const navButton = document.querySelector('#nav-button');

navButton.addEventListener('click', () => {
  navButton.classList.toggle('show');
    navMenu.classList.toggle('show');
});
const navMenu = document.querySelector('#nav-menu');