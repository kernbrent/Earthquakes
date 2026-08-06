document.addEventListener("DOMContentLoaded", () => {

    fetch('components/header.html')
        .then(response => response.text())
        .then(data => {

            document.getElementById('header-placeholder').innerHTML = data;

            initializeMobileMenu();

        });

    const footer = document.querySelector('footer');
    if (footer && !footer.querySelector('.developer-credit')) {
        const credit = document.createElement('a');
        credit.className = 'developer-credit';
        credit.href = 'https://careersteps.net/';
        credit.setAttribute('aria-label', 'Visit Career Steps Consulting LLC');
        credit.innerHTML = `
            <img src="/images/career-steps-logo.png" alt="" width="28" height="28">
            <span>Website developed and maintained by <strong>Career Steps Consulting LLC.</strong></span>
        `;
        footer.appendChild(credit);
    }

});
