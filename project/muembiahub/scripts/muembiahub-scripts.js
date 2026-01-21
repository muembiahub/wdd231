// Mobile nav toggle (simple demo)
const navToggle = document.getElementById('navToggle');
const header = document.querySelector('.site-header');
navToggle?.addEventListener('click', () => {
  const nav = document.querySelector('.nav');
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
});

// Cart + toast
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const toast = document.getElementById('toast');
let count = 0;

function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(()=> toast.classList.remove('show'), 1800);
}

document.querySelectorAll('.add-to-cart').forEach(btn=>{
  btn.addEventListener('click', e=>{
    const card = e.target.closest('.product-card');
    const title = card.dataset.title;
    const price = Number(card.dataset.price);
    count += 1;
    cartCount.textContent = count;
    showToast(`${title} ajouté au panier — $${price.toFixed(2)}`);
  });
});

document.getElementById('newsletterForm')?.addEventListener('submit', e=>{
  e.preventDefault();
  showToast('Merci pour votre inscription !');
});
