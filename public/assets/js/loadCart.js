import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

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

document.addEventListener('DOMContentLoaded', function () {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        const cartRef = ref(database, 'carts/' + userId);
  
        get(cartRef).then((snapshot) => {
          if (snapshot.exists()) {
            const cartItems = snapshot.val();
            let itemCount = 0;
            let totalPrice = 0;
            const cartItemsContainer = document.getElementById('cart-items');
            cartItemsContainer.innerHTML = '';
  
            // Iterate through each item in the cart
            for (const productId in cartItems) {
              const item = cartItems[productId];
  
              // Check if product information exists in products object
              if (products.hasOwnProperty(productId)) {
                itemCount += item.quantity;
                totalPrice += item.quantity * products[productId].price;
  
                const cartItemHtml = `
                  <div class="row main align-items-center">
                    <div class="col-2"><img class="img-fluid" src="${products[productId].image}"></div>
                    <div class="col">
                      <div class="row text-muted">${products[productId].type}</div>
                      <div class="row">${products[productId].name}</div>
                    </div>
                    <div class="col">
                      <button class="update-quantity" data-action="decrease" data-product-id="${productId}">-</button>
                      <span class="border">${item.quantity}</span>
                      <button class="update-quantity" data-action="increase" data-product-id="${productId}">+</button>
                    </div>
                    <div class="col">RON ${products[productId].price * item.quantity} <span class="close" data-product-id="${productId}">&#10005;</span></div>
                  </div>
                `;
  
                cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHtml);
              } else {
                console.warn(`Product with ID ${productId} is missing in products object.`);
              }
            }
  
            document.getElementById('item-count').textContent = `${itemCount} items`;
            document.getElementById('summary-item-count').textContent = itemCount;
            document.getElementById('summary-total-price').textContent = totalPrice.toFixed(2);
            document.getElementById('total-price').textContent = totalPrice.toFixed(2);
  
            // Add event listeners for updating quantities
            document.querySelectorAll('.update-quantity').forEach(button => {
              button.addEventListener('click', function (e) {
                e.preventDefault();
                const productId = button.getAttribute('data-product-id');
                const action = button.getAttribute('data-action');
                updateCartQuantity(userId, productId, action);
              });
            });
  
            // Add event listeners for removing items
            document.querySelectorAll('.close').forEach(button => {
              button.addEventListener('click', function () {
                const productId = button.getAttribute('data-product-id');
                removeFromCart(userId, productId);
              });
            });
          } else {
            document.getElementById('cart-items').innerHTML = '<p>Your cart is empty.</p>';
          }
        }).catch((error) => {
          console.error('Error fetching cart data:', error);
        });
      } else {
        window.location.href = 'login.html';
      }
    });
  });
  

// Function to update cart quantity
// Function to update cart quantity
function updateCartQuantity(userId, productId, action) {
    const cartRef = ref(database, 'carts/' + userId + '/' + productId);
  
    get(cartRef).then((snapshot) => {
      if (snapshot.exists()) {
        let currentQuantity = snapshot.val().quantity;
        if (action === 'increase') {
          currentQuantity += 1;
        } else if (action === 'decrease' && currentQuantity > 1) {
          currentQuantity -= 1;
        }
  
        // Update the quantity using set()
        set(cartRef, { quantity: currentQuantity }).then(() => {
          window.location.reload(); // Reload the page to update cart
        }).catch((error) => {
          console.error('Error updating cart quantity:', error);
        });
      }
    }).catch((error) => {
      console.error('Error fetching cart data:', error);
    });
  }
  

// Function to remove item from cart
function removeFromCart(userId, productId) {
  const cartRef = ref(database, 'carts/' + userId + '/' + productId);
  
  set(cartRef, null).then(() => {
    window.location.reload(); // Reload the page to update cart
  }).catch((error) => {
    console.error('Error removing item from cart:', error);
  });
}
