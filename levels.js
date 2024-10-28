document.addEventListener('click', (event) => {
    const target = event.target;
    switch (target.id) {
        case "a": console.log("hi"); break;
        default: break;
    }
});