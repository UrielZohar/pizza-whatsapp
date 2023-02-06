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
${toppingText ? `עם תוספת ${toppingText}%0a` : 'בלי תוספות%0a'}
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
  const allOptions = Array.from(pizzaToppingsElement.options);
  console.log(selectedOptions.length);
  // update the price
  const toppingPrice = Math.max((selectedOptions.length * 5) - 5, 0);
  const toppingText = selectedOptions.map(({text}) => text).join(', ');
  // update the WA message
  const waMsg = createWaMsg(pizzaText, toppingText, pizzaPrice + toppingPrice);
  const waLink = createWaLink(waMsg);
  setWaLinkElementHref(waLink);
  // Disable the toppings if they are more two
  if (selectedOptions.length > 2) {
    allOptions.forEach(option => {
      option.setAttribute("disabled", "");
    });
    selectedOptions.forEach(option => {
      option.removeAttribute("disabled");
    });
  } else {
    allOptions.forEach(option => {
      !option.hasAttribute("placeholdered") && option.removeAttribute("disabled");
    });
  }
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




