import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import "./scss/style.scss";

// Your code to run since DOM is loaded and ready
if (window.innerWidth > 690) {
  document.getElementsByTagName('body')[0].classList.add("desktop-mode");
} else {
  document.getElementsByTagName('body')[0].classList.add("mobile-mode");
}

// get all pizza pictures
const pizzaTypesElement = document.querySelector('#pizzaTypes');
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

const createWaMsg = (pizzaText, price) => {
  return `שלום שאקי 🍕 %0a
אני רוצה פיצה ${pizzaText}%0a
סה״כ: ${price} ש״ח%0a
😍`;
}

const pizzaTypeToTextMap = {
  'sambusak': {text: 'סמבוסק', price: 50} ,
  'thick': {text: 'עבה', price: 50},
  'thin': {text: 'דקה', price: 50},
  'normal': {text: 'רגילה', price: 50},
}

const onPizzaPicClick = (event => {
  // get the pizza type
  const pizzaType = event.target.value;
  // update the WA message
  const waMsg = createWaMsg(pizzaTypeToTextMap[pizzaType].text, pizzaTypeToTextMap[pizzaType].price);
  const waLink = createWaLink(waMsg);
  setWaLinkElementHref(waLink);
});

pizzaTypesElement.addEventListener('change', onPizzaPicClick);