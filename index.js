import "./scss/style.scss";

// Your code to run since DOM is loaded and ready
if (window.innerWidth > 690) {
  document.getElementsByTagName('body')[0].classList.add("desktop-mode");
} else {
  document.getElementsByTagName('body')[0].classList.add("mobile-mode");
}

// get pizza dropdown
const pizzaTypesElement = document.querySelector('#pizzaTypes');
// get toppings dropdown
const pizzaToppingsElement = document.querySelector('#pizzaToppings');
// get the a href element
const waLinkElement = document.querySelector('.wa-link');

// text constants
const pizzaPhoneNumber = '972544832779';
// const waLinkPrefix = 'https://web.whatsapp.com/send?text=';
const waLinkPrefix = 'whatsapp://send?text=';
const waLinkSuffix = `&phone=${pizzaPhoneNumber}`;

const createWaLink = (msg) => {
  return `${waLinkPrefix}${msg}${waLinkSuffix}`;
}

const setWaLinkElementHref = (href) => {
  waLinkElement.setAttribute('href', href);
}

const createWaMsg = (pizzaText, toppingText, price) => {
  return `שלום שאקי 🍕 %0a
אני רוצה  ${pizzaText}%0a
${toppingText ? `עם תוספת ${toppingText}%0a` : 'בלי תוספות'}
סה״כ: ${price} ש״ח%0a
😍`;
}

const allTypes = [], allToppings = [];

const updatePizzaToppingsElement = pizzaType => {
  pizzaToppingsElement.innerHTML = `
  <option disabled selected value>בחר את התוספת</option>
  ${allToppings.filter(({type}) => type === pizzaType).map(({type, text, price}) => `<option type="${type}" price=${price} text="${text}">${text}</option>`).join('')}
`;
}

let pizzaText = '', pizzaPrice = 0;


const onPizzaClick = (event => {
  // get the pizza type
  const selectedOption = event.target[event.target.options.selectedIndex];
  pizzaText = selectedOption.getAttribute("text");
  pizzaPrice = +selectedOption.getAttribute("price");
  const pizzaType = selectedOption.getAttribute("type");
  // update the WA message
  const waMsg = createWaMsg(pizzaText, '', pizzaPrice);
  const waLink = createWaLink(waMsg);
  setWaLinkElementHref(waLink);
  updatePizzaToppingsElement(pizzaType);
});

const onToppingClick = (event => {
  const selectedOption = event.target[event.target.options.selectedIndex];
  // update the price
  const toppingPrice = +selectedOption.getAttribute("price");
  const toppingText = selectedOption.getAttribute("text");
  // update the WA message
  const waMsg = createWaMsg(pizzaText, toppingText, pizzaPrice + toppingPrice);
  const waLink = createWaLink(waMsg);
  setWaLinkElementHref(waLink);
});

pizzaTypesElement.addEventListener('change', onPizzaClick);
pizzaToppingsElement.addEventListener('change', onToppingClick);


// Firebase part

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDayJwvFEfo4_GAM20eL5s22ENFzda_i3k",
  authDomain: "pizza-whatsapp.firebaseapp.com",
  projectId: "pizza-whatsapp",
  storageBucket: "pizza-whatsapp.appspot.com",
  messagingSenderId: "692237400692",
  appId: "1:692237400692:web:d2180639cfb4b114f1ef21",
  measurementId: "G-YQF0EEN80H"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

Promise.all([db.collection("pizza-types").get(), db.collection("toppings").get()]).then(([pizzaTypeQuerySnapshot, toppingsQuerySnapshot]) => {
  pizzaTypeQuerySnapshot.forEach((doc) => {
    allTypes.push(doc.data());
  });
  toppingsQuerySnapshot.forEach((doc) => {
    allToppings.push(doc.data());
  });

  pizzaTypesElement.innerHTML = `
    <option disabled selected value>בחר את הסוג</option>
    ${allTypes.map(({type, text, price}) => `<option type="${type}" price=${price} text="${text}">${text}</option>`).join('')}
  `;
});




