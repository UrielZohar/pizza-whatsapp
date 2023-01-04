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
const allPizzaPics = document.querySelectorAll('.pizza-pic');
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
  'type1': {text: 'עם פטריות ובצל ירוק', price: 50} ,
  'type2': {text: 'עם מוצרלה ובזיליקום', price: 50},
  'type3': {text: 'עם רוטב פיצה וביצים', price: 50},
}

// remove all marks
const removeAllMarks = () => {
  allPizzaPics.forEach(elm => elm.classList.remove('marked'));
}

const onPizzaPicClick = (event => {
  // remove marked for all
  removeAllMarks();
  // get the pizza type
  const pizzaType = event.target.getAttribute('data-pizza-type');
  // update the WA message
  const waMsg = createWaMsg(pizzaTypeToTextMap[pizzaType].text, pizzaTypeToTextMap[pizzaType].price);
  const waLink = createWaLink(waMsg);
  setWaLinkElementHref(waLink);
  // add marked to the current one
  event.target.classList.add('marked');
});

allPizzaPics.forEach(elm => elm.addEventListener('click', onPizzaPicClick));