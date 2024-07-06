import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBBTA30z56EzSGwN7JKMnmJ2qww2vtM7S0",
  authDomain: "shoppie-3cea3.firebaseapp.com",
  databaseURL: "https://shoppie-3cea3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "shoppie-3cea3",
  storageBucket: "shoppie-3cea3.appspot.com",
  messagingSenderId: "417371063433",
  appId: "1:417371063433:web:7c6525c13fa6a605b03258"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);


//func register
function registerUser(name, email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('User created:', user.uid);
      // save user info to the database
      const registrationDate = new Date().toISOString();
            return set(ref(database, 'users/' + user.uid), {
                username: name,
                email: email,
                registrationDate: registrationDate
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

//func login
function loginUser(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // signed in 
      const user = userCredential.user;
      console.log('User logged in:', user.uid);
      window.location.href = 'index.html'; // redirect index.html
    })
    .catch((error) => {
      console.error('Error during login:', error);
      alert('Login failed, password or email is wrong.');
    });
}

//login si register buttons
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

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      loginUser(email, password);
    });
  }

  const authButton = document.getElementById('loginButton')
  const greeting = document.getElementById('greeting');
  const accountTab = document.getElementById('accountTab')

//user authentification check
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userRef = ref(database, 'users/' + user.uid);
      get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
              const userData = snapshot.val();
              greeting.textContent = `${userData.username}`;
              document.getElementById('userName').textContent = userData.username;
              document.getElementById('userEmail').textContent = userData.email;
              if (userData.registrationDate) {
                document.getElementById('registrationDate').textContent = new Date(userData.registrationDate).toLocaleDateString();
              } else {
                console.error('No registration date found for the user');
              }
          } else {
              console.error('No user data found');
          }
      }).catch((error) => {
          console.error('Error fetching user data:', error);
      });

      if (accountTab) {
        accountTab.style.display = 'block'; // show fav tab
      }

      authButton.textContent = 'Logout';
      authButton.onclick = function() {
        signOut(auth).then(() => {
          alert('You have been logged out.');
          window.location.href = 'index.html';
        }).catch((error) => {
          console.error('Error during logout:', error);
        });
      };
    } else {
      greeting.textContent = '';
      if (accountTab) {
        accountTab.style.display = 'none'; // hide fav tab
      }
      authButton.textContent = 'Login';
      authButton.onclick = function() {
        window.location.href = 'login.html';
      };
    }
  });

  //sign in button index
  const loginButton = document.getElementById('loginButton');
  if (loginButton) {
    loginButton.addEventListener('click', function() {
      window.location.href = 'login.html';
    });
  } else {
    console.error("loginButton not found");
  }

  //cart button index
  const cartButton = document.getElementById('cartButton');
  if (cartButton) {
    cartButton.addEventListener('click', function() {
      window.location.href = 'cart.html';
    });
  } else {
    console.error("cartButton not found");
  }

//nav bar
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

//loading screan
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
