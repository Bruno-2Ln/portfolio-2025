export function initializeCvModal() {
    console.log('test');
    const cvModal = document.getElementById('cv-modal');
    const cvButton = document.getElementById('cv-trigger');
    const closeModal = cvModal.querySelector('.close-modal');

    // Fonction pour afficher ou cacher la modal
    const toggleModal = (show) => {
        if (show) {
            cvModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        } else {
            cvModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    };

    // Fonction pour mettre à jour l'aperçu du CV dans l'iframe
    const updateCvPreview = (pdfPath) => {
        const iframe = cvModal.querySelector('iframe'); // On récupère l'iframe de la modal
        iframe.src = pdfPath; // On change la source du PDF dans l'iframe
    };

    // Ajouter l'événement pour l'ouverture de la modal
    cvButton?.addEventListener('click', (e) => {
        e.preventDefault();
        toggleModal(true);
    });

    // Ajouter l'événement pour fermer la modal
    closeModal?.addEventListener('click', () => toggleModal(false));

    // Fermer la modal si on clique à l'extérieur
    cvModal?.addEventListener('click', (e) => {
        if (e.target === cvModal) toggleModal(false);
    });

    // Ajouter les événements pour changer l'aperçu du CV
    const cvThumbnails = document.querySelectorAll('.cv-thumbnail');
    cvThumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener('click', (e) => {
            e.preventDefault();
            const pdfPath = thumbnail.getAttribute('data-pdf');
            updateCvPreview(pdfPath); // Met à jour l'aperçu dans l'iframe
        });
    });
}
