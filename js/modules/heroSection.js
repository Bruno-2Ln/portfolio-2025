import { config } from './config.js';

export function initializeHeroSection(data) {
    document.getElementById('name').textContent = data.personal.name;
    document.getElementById('hero-description').textContent = data.personal.description;
    document.getElementById('about-content').innerHTML = `<p>${data.personal.bio}</p>`;

    const heroPhoto = document.getElementById('hero-photo');
    heroPhoto.src = data.personal.photo || config.DEFAULT_PROFILE_PHOTO;
    heroPhoto.alt = `Photo de ${data.personal.name}`;

    initializeContactLinks(data.personal);
    initializeTypedAnimation(data.personal.title);
}

function initializeContactLinks(personalData) {
    const contactLinks = document.getElementById('contact-links');
    contactLinks.innerHTML = `
        <div><a href="${personalData.contact.linkedin}" target="_blank"><img src="${personalData.photo_lkd}" alt="icon linkedin"></a></div>
        <div><a href="${personalData.contact.gitlab}" target="_blank"><img src="${personalData.photo_gitlab}" alt="icon gitlab"></a></div>
        <div><a href="${personalData.contact.github}" target="_blank"><img src="${personalData.photo_github}" alt="icon github"></a></div>
    `;
}

function initializeTypedAnimation(title) {
    new Typed('#typed-output', {
        strings: [
            'Développeur Ionic',
            'Développeur Angular',
            title,
        ],
        typeSpeed: 80,
        backSpeed: 40,
        backDelay: 2000,
        loop: false
    });
}
