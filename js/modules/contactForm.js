import { config } from './config.js';

export function initializeContactForm() {
    const modal = document.getElementById('contact-modal');
    const ctaButton = document.querySelector('.cta-button');
    const closeModal = document.querySelector('.close-modal');
    const modalTrigger = document.getElementById('modal-trigger');
    const contactForm = document.getElementById('contact-form');

    setupModalEvents(modal, ctaButton, closeModal, modalTrigger);
    setupFormSubmission(contactForm);
}

function setupModalEvents(modal, ctaButton, closeModal, modalTrigger) {
    const toggleModal = (show) => {
        if (show) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        } else {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    };

    ctaButton?.addEventListener('click', (e) => {
        e.preventDefault();
        toggleModal(true);
    });

    closeModal?.addEventListener('click', () => toggleModal(false));
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) toggleModal(false);
    });

    modalTrigger?.addEventListener('click', (e) => {
        e.preventDefault();
        toggleModal(true);
    });
}

function setupFormSubmission(contactForm) {
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!checkSubmissionLimit()) {
            showFormMessage('Trop de messages envoyés. Veuillez réessayer plus tard.', 'error');
            return;
        }

        const submitButton = contactForm.querySelector('.submit-button');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = 'Envoi en cours...';
        submitButton.disabled = true;

        try {
            await handleFormSubmission(contactForm);
            addSubmission();
            showFormMessage('Message envoyé avec succès !', 'success');
            contactForm.reset();
        } catch (error) {
            showFormMessage(
                error.message || 'Une erreur est survenue. Veuillez réessayer.',
                'error'
            );
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}

async function handleFormSubmission(form) {
    const recaptchaToken = await getReCaptchaToken();
    document.getElementById('recaptchaResponse').value = recaptchaToken;

    const message = form.querySelector('#message').value;
    if (message.length < 10 || message.length > 1000) {
        throw new Error('Le message doit contenir entre 10 et 1000 caractères');
    }

    const response = await emailjs.sendForm(
        config.EMAIL_SERVICE_ID,
        config.EMAIL_TEMPLATE_ID,
        form
    );

    if (response.status !== 200) {
        throw new Error('Erreur lors de l\'envoi');
    }
}

function showFormMessage(message, type) {
    const oldMessage = document.querySelector('.form-message');
    oldMessage?.remove();

    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    document.getElementById('contact-form')?.appendChild(messageElement);

    setTimeout(() => messageElement.remove(), 5000);
}

function checkSubmissionLimit() {
    const submissions = JSON.parse(localStorage.getItem(config.STORAGE_KEY) || '[]');
    const now = Date.now();
    const validSubmissions = submissions.filter(timestamp =>
        now - timestamp < config.SUBMISSION_TIMEOUT
    );
    localStorage.setItem(config.STORAGE_KEY, JSON.stringify(validSubmissions));
    return validSubmissions.length < config.MAX_SUBMISSIONS;
}

function addSubmission() {
    const submissions = JSON.parse(localStorage.getItem(config.STORAGE_KEY) || '[]');
    submissions.push(Date.now());
    localStorage.setItem(config.STORAGE_KEY, JSON.stringify(submissions));
}

async function getReCaptchaToken() {
    return new Promise((resolve, reject) => {
        grecaptcha.ready(function() {
            grecaptcha.execute('6LeliMYqAAAAAJ2_CMkHP2YwMCTMos7ehJSeB4qy', {action: 'submit'})
                .then(resolve, reject);
        });
    });
}
