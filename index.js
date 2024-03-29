import "./scss/style.scss";

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (!isMobile) {
  alert("האתר נתמך ממשכשיר נייד בלבד");
}

// Your code to run since DOM is loaded and ready
if (window.innerWidth > 690) {
  document.getElementsByTagName('body')[0].classList.add("desktop-mode");
  alert("האתר נתמך ממשכשיר נייד בלבד");
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
let pizzaPhoneNumber = '972544832779';
// fetch the phone number from the API
fetch("https://otblh8o1gi.execute-api.us-east-2.amazonaws.com/pizza-sahki-stage/getPhoneNumber")
  .then(response => response.text())
  .then((response) => {
    pizzaPhoneNumber = response;
})
.catch(err => console.log(err));
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
${toppingText ? `עם תוספת: ${toppingText}%0a` : 'בלי תוספות%0a'}
סה״כ: ${price} ש״ח%0a
😍`;
}

const allTypes = [], allToppings = [];

const updatePizzaToppingsElement = pizzaType => {
  pizzaToppingsElement.innerHTML = `
  <option disabled selected value placeholdered>בחר את התוספת</option>
  ${allToppings.filter(({type}) => type === pizzaType).map(({type, text, price}) => `<option type="${type}" price=${price} text="${text}">${text}</option>`).join('')}
`;
}

const enablePizzaToppingsElement = () => {
  pizzaToppingsElement.removeAttribute("disabled");
}

const addPizzaToppingsElementMultiple = () => {
  pizzaToppingsElement.setAttribute("multiple", "");
}

const removePizzaToppingsElementMultiple = () => {
  pizzaToppingsElement.removeAttribute("multiple");
}

let pizzaText = '', pizzaPrice = 0;


const onPizzaClick = (event => {
  // get the pizza type
  const selectedOption = event.target[event.target.options.selectedIndex];
  pizzaText = selectedOption.getAttribute("text");
  pizzaPrice = +selectedOption.getAttribute("price");
  const pizzaType = selectedOption.getAttribute("type");
  const isMultipleToppings = selectedOption.getAttribute("isMultipleToppings") === 'true';
  // update the WA message
  const waMsg = createWaMsg(pizzaText, '', pizzaPrice);
  const waLink = createWaLink(waMsg);
  setWaLinkElementHref(waLink);
  enablePizzaToppingsElement();
  updatePizzaToppingsElement(pizzaType);
  if (isMultipleToppings) {
    addPizzaToppingsElementMultiple();
  } else {
    removePizzaToppingsElementMultiple();
  }
});

const onToppingClick = (event => {
  // get the selected options
  const selectedOptions = Array.from(pizzaToppingsElement.selectedOptions);
  // update the price
  let toppingPrice = 0;
  const selectedPizzaType = pizzaTypesElement.options[pizzaTypesElement.options.selectedIndex].getAttribute("type") ;
  // don't change the "selectedOptions.length - 1" in mobile it's count the place holder as selected
  if (selectedPizzaType === 'toast') {
    toppingPrice = Math.max(((selectedOptions.length - 1) * 5) - 10, 0);
  } else {
    toppingPrice = Math.max(((selectedOptions.length - 1) * 5), 0);
  }
  const toppingText = selectedOptions.filter(option => !option.hasAttribute("placeholdered")).map(({text}) => text).join(', ');
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

Promise.all([db.collection("pizza-types").where("enabled", "==", true).get(), db.collection("toppings").where("enabled", "==", true).get()]).then(([pizzaTypeQuerySnapshot, toppingsQuerySnapshot]) => {
  pizzaTypeQuerySnapshot.forEach((doc) => {
    allTypes.push(doc.data());
  });
  toppingsQuerySnapshot.forEach((doc) => {
    allToppings.push(doc.data());
  });

  pizzaTypesElement.innerHTML = `
    <option disabled selected value>בחר את הסוג</option>
    ${allTypes.map(({type, text, price, isMultipleToppings}) => `<option 
      type="${type}" 
      price=${price} 
      text="${text}"
      isMultipleToppings="${isMultipleToppings}">
        ${text}
    </option>`).join('')}
  `;
});




