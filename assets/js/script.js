document.getElementById('loginButton').addEventListener('click', function() {
  window.location.href = 'login.html';
});

document.getElementById('cartButton').addEventListener('click', function() {
  window.location.href = 'cart.html';
});
/* Mobile navbar toggle */

const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelector("[data-nav-toggler]");

navToggler.addEventListener("click", function () {
  navbar.classList.toggle("active");
});

/* Header active */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  header.classList[this.scrollY > 50 ? "add" : "remove"]("active");
});

window.addEventListener('load', function() {
  setTimeout(function() {
    var loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    } else {
      console.error("Loading screen not found");
    }
  }, 500); // (1000ms = 1s)
});