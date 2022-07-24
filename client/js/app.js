const mobilemenu = document.querySelector('.mobile-menu');

mobilemenu.addEventListener('click', (e) => {
    document.querySelector(".menu").classList.toggle("show");
});
