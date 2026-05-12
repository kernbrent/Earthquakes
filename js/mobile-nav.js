
function initializeMobileMenu() {
    const button = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');

    if(button && nav){
        button.addEventListener('click', () => {
            nav.classList.toggle('mobile-open');
        });
    }
}
