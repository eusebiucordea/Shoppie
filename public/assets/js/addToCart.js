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

const products = {
  "productID1": {"name": "Adidas Samba", "price": "370", "type": "Sneakers", "image": "assets/images/adidas samba.png" },
  "productID2": {"name": "Short Jeans", "price": "110", "type": "Pants", "image": "assets/images/jens.png" },
  "productID3": {"name": "Metallica T-Shirt", "price": "90", "type": "T-shirt", "image": "assets/images/metalica t.png" },

  "productID4": {"name": "NY Baseball Cap", "price": "80", "type": "Cap", "image": "assets/images/ny cap.png" },
  "productID5": {"name": "Nike Cortez", "price": "385", "type": "Sneakers", "image": "assets/images/nike cortez.png" },
  "productID6": {"name": "Bandanas", "price": "59", "type": "Accessories", "image": "assets/images/bandane.png" },

  "productID7": {"name": "Nike Dunks", "price": "450", "type": "Sneakers", "image": "assets/images/nike dunks.png" },
  "productID8": {"name": "Calvin Klein Belt", "price": "120", "type": "Accessories", "image": "assets/images/belt.png" },
  "productID9": {"name": "Ripped Jeans", "price": "155", "type": "Pants", "image": "assets/images/jens2.png" },

  "productID10": {"name": "Lacoste Poche", "price": "100", "type": "Accessories", "image": "assets/images/borset.png" },
  "productID11": {"name": "Summer Shirt", "price": "170", "type": "Shirt", "image": "assets/images/shirt.png" },
  "productID12": {"name": "Sunglasses", "price": "220", "type": "Accessories", "image": "assets/images/sun glas.png" },
};

// Function to add product to cart
function addToCart(productId) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        const cartRef = ref(database, 'carts/' + userId + '/' + productId);
  
        // Fetch the current quantity
        get(cartRef).then((snapshot) => {
          const currentQuantity = snapshot.exists() ? snapshot.val().quantity : 0;
  
          // Set the updated quantity
          set(cartRef, {
            productId: productId,
            quantity: currentQuantity + 1,
            productName: products[productId].name,
            productPrice: products[productId].price,
            productImage: products[productId].image,
            productType: products[productId].type
          }).then(() => {
            alert('Product added to cart!');
          }).catch((error) => {
            console.error('Error adding to cart:', error);
          });
        }).catch((error) => {
          console.error('Error fetching cart data:', error);
        });
      } else {
        alert('Please log in to add items to your cart.');
        window.location.href = 'login.html';
      }
    });
  }
  
  // Event listener for add to cart buttons
  document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.addtocart-btn');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function() {
        const productId = button.getAttribute('data-product-id');
        addToCart(productId);
      });
    });
  });
