const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';

fetch(url)
  .then(response => response.json())
  .then(data => {
    const prophets = data.prophets;
    const cards = document.querySelector('#cards');

    prophets.forEach(prophet => {
      const card = document.createElement('section');
      card.setAttribute('class', 'card');

      const h2 = document.createElement('h2');
      h2.textContent = `${prophet.name} ${prophet.lastname}`;
      card.appendChild(h2);

      const birthDate = document.createElement('p');
      birthDate.textContent = `Date of Birth: ${prophet.birthdate}`;
      card.appendChild(birthDate);

      const birthPlace = document.createElement('p');
      birthPlace.textContent = `Place of Birth: ${prophet.birthplace}`;
      card.appendChild(birthPlace);

      const image = document.createElement('img');
      image.setAttribute('src', prophet.imageurl);
      image.setAttribute('alt', `${prophet.name} ${prophet.lastname}`);
    card.appendChild(image);
    // Make the image responsive with inline styles


      cards.appendChild(card);
    });
  })
  // Handle errors
  .catch(error => console.error('Error fetching data:', error));


// Update the footer with the last modified date
const currentYear = new Date().getFullYear();
const yearElement = document.querySelector('#current-year');
// Update the copyright text
const copyrightText = document.querySelector('#copyright');
copyrightText.textContent = `© ${currentYear} Jonathan M. Muembia | Latter-day Prophets`;
// Update the last modified date
const lastUpdatedDate = document.querySelector('#last-updated-date');
lastUpdatedDate.textContent = `Last Updated: ${document.lastModified}`;

