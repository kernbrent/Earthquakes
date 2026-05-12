
document.addEventListener('DOMContentLoaded', () => {

    const mobileButton = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');

    if (mobileButton && nav) {

        mobileButton.addEventListener('click', () => {
            nav.classList.toggle('mobile-open');
        });

    }

});
