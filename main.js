document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const modal = document.getElementById('contact-modal');
    const ctaButton = document.querySelector('.cta-button');
    const closeModal = document.querySelector('.close-modal');
    const modalTrigger = document.getElementById('modal-trigger');

    // Définir des images par défaut
    const DEFAULT_PROFILE_PHOTO = 'assets/images/hero2.jpg';

    // Charger les données depuis le fichier JSON
    fetch('/data.json')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Informations personnelles
            document.getElementById('name').textContent = data.personal.name;

            // Description
            document.getElementById('hero-description').textContent = data.personal.description;

            document.getElementById('about-content').innerHTML = `<p>${data.personal.bio}</p>`;

            // Photo de profil
            document.getElementById('hero-photo').src = data.personal.photo || DEFAULT_PROFILE_PHOTO;
            document.getElementById('hero-photo').alt = `Photo de ${data.personal.name}`;

            // Liens de contact
            // <div><a href="mailto:${data.personal.contact.email}"><img src="${data.personal.photo_mail}" alt="icon email"></a></div>
            const contactLinks = document.getElementById('contact-links');
            contactLinks.innerHTML = `
                <div><a href="${data.personal.contact.linkedin}" target="_blank"><img src="${data.personal.photo_lkd}" alt="icon linkedin"></a></div>
                <div><a href="${data.personal.contact.gitlab}" target="_blank"><img src="${data.personal.photo_gitlab}" alt="icon gitlab"></a></div>
                <div><a href="${data.personal.contact.github}" target="_blank"><img src="${data.personal.photo_github}" alt="icon github"></a></div>
            `;

            // Animation de typing avec le titre
            new Typed('#typed-output', {
                strings: [
                    'Développeur Ionic',
                    'Développeur Angular',
                    data.personal.title,
                ],
                typeSpeed: 80,
                backSpeed: 40,
                backDelay: 2000,
                loop: false
            });

            // Expériences
            const experienceContainer = document.getElementById('experience-timeline');

            // Création des expériences
            data.experiences.forEach((exp, index) => {
                // Création du groupe d'expérience
                const groupElement = document.createElement('div');
                groupElement.classList.add('experience-group');

                // Création du marqueur de date
                const dateMarker = document.createElement('div');
                dateMarker.classList.add('timeline-date');
                dateMarker.textContent = exp.period;
                groupElement.appendChild(dateMarker);

                // Création de la carte d'expérience
                const expElement = document.createElement('div');
                expElement.classList.add('experience-item');
                expElement.classList.add(index % 2 === 0 ? 'experience-left' : 'experience-right');

                // Contenu de la carte
                expElement.innerHTML = `
                    <div class="experience-content">
                        <h3 class="experience-title">${exp.title}</h3>
                        <p class="experience-company">${exp.company}</p>
                        <p class="experience-description">${exp.description}</p>
                    </div>
                `;

                // Ajout de la carte au groupe
                groupElement.appendChild(expElement);

                // Ajout du groupe au conteneur
                experienceContainer.appendChild(groupElement);
            });

            // Observer pour les animations au scroll
            const observerOptions = {
                root: null,
                threshold: 0.1,
                rootMargin: '0px'
            };

            const experienceObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Réinitialisation de l'animation
                        entry.target.classList.remove('animate');
                        void entry.target.offsetWidth; // Force reflow
                        entry.target.classList.add('animate');
                    } else {
                        entry.target.classList.remove('animate');
                    }
                });
            }, observerOptions);

            // Observation de toutes les cartes d'expérience
            document.querySelectorAll('.experience-item').forEach(item => {
                experienceObserver.observe(item);
            });

            // Projets
            const projectsContainer = document.getElementById('projects-grid');
            data.projects.forEach((project) => {
                const projectElement = document.createElement('div');
                projectElement.classList.add('project-card');

                // Création des particules
                const particles = Array(15).fill(null).map((_, i) => {
                    const size = Math.random() * 2 + 1; // Tailles entre 1 et 3px
                    return `<div class="particle" style="
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${size}px;
        animation-delay: ${Math.random()}s;
    "></div>`;
                }).join('');

                projectElement.innerHTML = `
        <div class="project-inner">
            <div class="project-front">
                <div class="project-particles">
                    ${particles}
                </div>
                <div class="project-image-container">
                    <img src="${project.image}" alt="${project.title}" class="project-image">
                </div>
                <div class="project-front-content">
                    <h3 class="project-title">${project.title}</h3>
                    <div class="project-preview">Cliquez pour plus de détails →</div>
                </div>
            </div>
            <div class="project-back">
                <p class="project-description">${project.description}</p>
                <div class="project-technologies">
                    ${project.technologies.map(tech => `
                        <span class="tech-badge">${tech}</span>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

                // Gestion du retournement de la carte
                projectElement.addEventListener('click', () => {
                    projectElement.classList.toggle('flipped');
                });

                projectsContainer.appendChild(projectElement);
            });

            const modal = document.getElementById('contact-modal');
            const ctaButton = document.querySelector('.cta-button');
            const closeModal = document.querySelector('.close-modal');

            ctaButton.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; // Empêche le défilement
            });

            closeModal.addEventListener('click', () => {
                modal.classList.remove('show');
                document.body.style.overflow = ''; // Réactive le défilement
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                    document.body.style.overflow = '';
                }
            });

            // Ajouter ces constantes au début de votre fichier, avant le reste du code
            const STORAGE_KEY = 'form_submissions';
            const MAX_SUBMISSIONS = 5; // Maximum de soumissions par 24h
            const SUBMISSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 heures en ms

// Ajouter ces fonctions utilitaires
            function checkSubmissionLimit() {
                const submissions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                const now = Date.now();
                const validSubmissions = submissions.filter(timestamp =>
                    now - timestamp < SUBMISSION_TIMEOUT
                );
                localStorage.setItem(STORAGE_KEY, JSON.stringify(validSubmissions));
                return validSubmissions.length < MAX_SUBMISSIONS;
            }

            function addSubmission() {
                const submissions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                submissions.push(Date.now());
                localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
            }

// Remplacer votre gestionnaire de formulaire existant par celui-ci
            if (contactForm) {
                contactForm.addEventListener('submit', async (e) => {
                    e.preventDefault();

                    // Vérifier le honeypot
                    const honeypot = document.getElementById('phone');
                    if (honeypot && honeypot.value) {
                        console.log('Bot détecté');
                        return false;
                    }

                    // Vérifier la limite de soumissions
                    if (!checkSubmissionLimit()) {
                        showFormMessage('Trop de messages envoyés. Veuillez réessayer plus tard.', 'error');
                        return false;
                    }

                    const submitButton = contactForm.querySelector('.submit-button');
                    const originalText = submitButton.innerHTML;
                    submitButton.innerHTML = 'Envoi en cours...';
                    submitButton.disabled = true;

                    try {
                        // Obtenir le token reCAPTCHA
                        const recaptchaToken = await new Promise((resolve, reject) => {
                            grecaptcha.ready(function() {
                                grecaptcha.execute('6LeliMYqAAAAAJ2_CMkHP2YwMCTMos7ehJSeB4qy', {action: 'submit'})
                                    .then(resolve, reject);
                            });
                        });

                        document.getElementById('recaptchaResponse').value = recaptchaToken;

                        // Validation supplémentaire
                        const message = contactForm.querySelector('#message').value;
                        if (message.length < 10 || message.length > 1000) {
                            throw new Error('Le message doit contenir entre 10 et 1000 caractères');
                        }

                        // Envoi via EmailJS avec vos identifiants existants
                        const response = await emailjs.sendForm(
                            'service_aikb04n',
                            'template_fjeti6b',
                            contactForm
                        );

                        if (response.status === 200) {
                            addSubmission();
                            showFormMessage('Message envoyé avec succès !', 'success');
                            contactForm.reset();
                        } else {
                            throw new Error('Erreur lors de l\'envoi');
                        }
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

            function showFormMessage(message, type) {
                const oldMessage = document.querySelector('.form-message');
                if (oldMessage) {
                    oldMessage.remove();
                }

                const messageElement = document.createElement('div');
                messageElement.className = `form-message ${type}`;
                messageElement.textContent = message;
                contactForm.appendChild(messageElement);

                setTimeout(() => {
                    messageElement.remove();
                }, 5000);
            }

            const modalTrigger = document.getElementById('modal-trigger');
            if (modalTrigger) {
                modalTrigger.addEventListener('click', (e) => {
                    e.preventDefault(); // Empêche le comportement par défaut du lien
                    modal.classList.add('show');
                    document.body.style.overflow = 'hidden'; // Empêche le défilement
                });
            }
        })
        .catch(error => {
            console.error('Erreur de chargement des données:', error);
        });
});
