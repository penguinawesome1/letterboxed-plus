const slider = document.querySelector(".slider");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

nextBtn.addEventListener('click', () => {
    slider.append(slider.querySelector("section:first-child"));
    document.body.classList.remove(...document.body.classList);
    document.body.classList.add(`bg-${slider.children[0].id}`);
});

prevBtn.addEventListener('click', () => {
    slider.prepend(slider.querySelector("section:last-child"));
    document.body.classList.remove(...document.body.classList);
    document.body.classList.add(`bg-${slider.firstChild.id}`);
});

// localStorage.setItem("current_level", 9);
const currentLevel = localStorage.getItem("current_level");
if (!currentLevel) localStorage.setItem("current_level", 1);
for (let i = 1; i <= currentLevel; i++) {
    const worldButton = document.getElementById(`${i}`);
    worldButton.classList.remove("off");
    const score = localStorage.getItem(`score_level_${i}`);
    console.log(score);
    if (!score) continue;
    
    const star1 = document.getElementById(`star${i*3}`);
    star1.classList.remove("hidden");
    if (score > 1) {
        const star2 = document.getElementById(`star${i*3 - 1}`);
        star2.classList.remove("hidden");
    }
    if (score == 3) {
        const star3 = document.getElementById(`star${i*3 - 2}`);
        star3.classList.remove("hidden");
    }
}