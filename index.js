import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import "./scss/style.scss";




// Your code to run since DOM is loaded and ready
if (window.innerWidth > 690) {
  document.getElementsByTagName('body')[0].classList.add("desktop-mode");
} else {
  document.getElementsByTagName('body')[0].classList.add("mobile-mode");
}

// get all pizza picutes
const allPizzaPics = document.querySelectorAll('.pizza-pic');

// remove all marks
const removeAllMarks = () => {
  allPizzaPics.forEach(elm => elm.classList.remove('marked'));
}

const onPizzaPicClick = (event => {
  // remove marked for all
  removeAllMarks();
  // add marked to the current one
  event.target.classList.add('marked');
});

allPizzaPics.forEach(elm => elm.addEventListener('click', onPizzaPicClick));