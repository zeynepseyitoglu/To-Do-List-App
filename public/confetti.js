import confetti from 'https://cdn.skypack.dev/canvas-confetti';

function makeConfetti(){
    confetti()
}

const btn = document.getElementById("confetti")
btn.addEventListener("click", makeConfetti);