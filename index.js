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