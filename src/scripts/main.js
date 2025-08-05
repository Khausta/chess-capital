function clearHoverEffects () {
    document.querySelectorAll('.hover').forEach(_ => {
        _.classList.remove('hover');
    })
}

if (window.matchMedia("(max-width: 768px)").matches) {
    clearHoverEffects();
}