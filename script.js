// API Call 
const URL = "https://fakestoreapiserver.reactbd.com/nextamazon";
let cardID = document.querySelector('.cardID');
let mainDiv = document.querySelector('.mainDiv');

function addProduct(jsonData) {
    jsonData.forEach(product => {
        let clone = cardID.cloneNode(true);
        clone.style.display = "block";

        let productTitle = clone.querySelector('.productTitle');
        productTitle.innerText = product.title;

        let productImage = clone.querySelector('.productImage');
        productImage.src = product.image;

        let productDescription = clone.querySelector('.productDescription');
        productDescription.innerText = product.description;

        let oldPrice = clone.querySelector('.oldPrice');
        oldPrice.innerText = (parseFloat(product.oldPrice) * 120).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        let newPrice = clone.querySelector('.newPrice');
        newPrice.innerText = (product.price * 120).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        let band = clone.querySelector('.band');
        band.innerText = product.brand;

        let category = clone.querySelector('.category');
        category.innerText = product.category;

        let addCartButton = clone.querySelector('.add-cart');
        addCartButton.addEventListener('click', () => addToCart(clone));

        mainDiv.appendChild(clone);
    });
}

const getProducts = async () => {
    let response = await fetch(URL);
    let jsonData = await response.json();
    addProduct(jsonData);
};
getProducts();


// Cart Functionality 
const cartIcon = document.querySelector('#cart-icon');
const cart = document.querySelector('.cart');
const cartClose = document.querySelector('#cart-close');
cartIcon.addEventListener('click', () => cart.classList.add('active'));
cartClose.addEventListener('click', () => cart.classList.remove('active'));

const cartContent = document.querySelector('.cart-content');

const addToCart = (productBox) => {
    const productImgSrc = productBox.querySelector('.productImage').src;
    const productTitle = productBox.querySelector('.productTitle').textContent;
    const productPrice = productBox.querySelector('.newPrice').textContent;

    const cartItems = cartContent.querySelectorAll('.cart-product-title');
    for (let item of cartItems) {
        if (item.textContent === productTitle) {
            alert('This item is already in the cart!');
            return;
        }
    }

    const cartBox = document.createElement('div');
    cartBox.classList.add('cart-box');
    cartBox.innerHTML = `
        <img src="${productImgSrc}" class="cart-img">
        <div class="cart-detail">
            <h2 class="cart-product-title">${productTitle}</h2>
            <span class="cart-price">${productPrice}</span>
            <div class="cart-quantity">
                <button class="decrement">-</button>
                <span class="number">1</span>
                <button class="increment">+</button>
            </div>
        </div>
        <i class="ri-delete-bin-line cart-remove"></i>
    `;

    cartContent.appendChild(cartBox);

    cartBox.querySelector('.cart-remove').addEventListener('click', () => {
        cartBox.remove();
        updateTotalPrice();
        updateCartCount(-1);
    });

    cartBox.querySelector('.cart-quantity').addEventListener('click', event => {
        const numberElement = cartBox.querySelector('.number');
        let quantity = parseInt(numberElement.textContent);

        if (event.target.classList.contains('decrement') && quantity > 1) {
            quantity--;
        } else if (event.target.classList.contains('increment')) {
            quantity++;
        }

        numberElement.textContent = quantity;
        updateTotalPrice();
    });

    updateCartCount(1);
    updateTotalPrice();
};

const updateTotalPrice = () => {
    const totalPriceElement = document.querySelector('.total-price');
    const cartBoxes = cartContent.querySelectorAll('.cart-box');
    let total = 0;
    cartBoxes.forEach(cartBox => {
        const priceElement = cartBox.querySelector('.cart-price');
        const quantityElement = cartBox.querySelector('.number');

        const price = parseFloat(priceElement.textContent.replace(/,/g, ''));
        const quantity = parseInt(quantityElement.textContent);
        total += price * quantity;
    });
    totalPriceElement.textContent = `${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Taka`;
};

let cartItemCount = 0;
const updateCartCount = (change) => {
    const cartItemCountBadge = document.querySelector('.cart-item-count');
    cartItemCount += change;
    if (cartItemCount > 0) {
        cartItemCountBadge.style.visibility = 'visible';
        cartItemCountBadge.textContent = cartItemCount;
    } else {
        cartItemCountBadge.style.visibility = 'hidden';
        cartItemCountBadge.textContent = '';
    }
};

const buyNowButton = document.querySelector('.btn-buy');
buyNowButton.addEventListener('click', () => {
    const cartBoxes = cartContent.querySelectorAll('.cart-box');
    if (cartBoxes.length === 0) {
        alert('Your cart is empty. Please add items to your cart before buying...');
        return;
    }

    cartBoxes.forEach(cartBox => cartBox.remove());
    cartItemCount = 0;
    updateCartCount(0);
    updateTotalPrice();

    alert('Thank you for your purchase!');
});
