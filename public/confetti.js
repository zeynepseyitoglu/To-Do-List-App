import confetti from 'https://cdn.skypack.dev/canvas-confetti';

//display confetti
function makeConfetti(){
    confetti()
}

//add event listener to the confetti button
const btn = document.getElementById("confetti")
btn.addEventListener("click", makeConfetti);