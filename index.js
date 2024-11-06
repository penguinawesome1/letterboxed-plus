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
    const worldButton = document.getElementById(`world${i}`);
    worldButton.classList.remove("off");
    const score = localStorage.getItem(`score_level_${i}`);
    if (!score) continue;

    for (let a = 0; a < score; a++) {
        const star = document.createElement("div");
        star.classList.add("star");
        worldButton.querySelector(".star-wrapper").appendChild(star);
    }
}
