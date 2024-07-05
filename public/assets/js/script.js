import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDUG--VRfZjTxf3qD0t4YCBqoxvasL5fhg",
  authDomain: "shoppieonlineshop.firebaseapp.com",
  databaseURL: "https://shoppieonlineshop-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "shoppieonlineshop",
  storageBucket: "shoppieonlineshop.appspot.com",
  messagingSenderId: "583068599076",
  appId: "1:583068599076:web:93028c3f550b504f7c69b1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

function registerUser(name, email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('User created:', user.uid);
      // save user info to the database
      return set(ref(database, 'users/' + user.uid), {
        username: name,
        email: email
      });
    })
    .then(() => {
      console.log('User data saved');
      window.location.href = 'login.html'; // redirect login.html
    })
    .catch((error) => {
      console.error('Error during registration:', error);
      alert('Error: ' + error.message);
    });
}

document.addEventListener('DOMContentLoaded', function () {
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      registerUser(name, email, password);
    });
  }

  const loginButton = document.getElementById('loginButton');
  if (loginButton) {
    loginButton.addEventListener('click', function() {
      window.location.href = 'login.html';
    });
  } else {
    console.error("loginButton not found");
  }

  const cartButton = document.getElementById('cartButton');
  if (cartButton) {
    cartButton.addEventListener('click', function() {
      window.location.href = 'cart.html';
    });
  } else {
    console.error("cartButton not found");
  }

  const navbar = document.querySelector("[data-navbar]");
  const navToggler = document.querySelector("[data-nav-toggler]");
  if (navToggler) {
    navToggler.addEventListener("click", function () {
      if (navbar) {
        navbar.classList.toggle("active");
      } else {
        console.error("navbar not found");
      }
    });
  } else {
    console.error("navToggler not found");
  }

  const header = document.querySelector("[data-header]");
  if (header) {
    window.addEventListener("scroll", function () {
      header.classList[this.scrollY > 50 ? "add" : "remove"]("active");
    });
  } else {
    console.error("header not found");
  }
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
