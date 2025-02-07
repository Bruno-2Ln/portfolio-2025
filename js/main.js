import { loadPortfolioData } from './modules/dataLoader.js';
import { initializeHeroSection } from './modules/heroSection.js';
import { initializeExperienceSection } from './modules/experienceSection.js';
import { initializeProjectsSection } from './modules/projectsSection.js';
import { initializeContactForm } from './modules/contactForm.js';
import { initializeCvModal } from "./modules/exportCv.js";

document.addEventListener('DOMContentLoaded', async () => {
    const data = await loadPortfolioData();
    if (!data) return;

    initializeHeroSection(data);
    initializeExperienceSection(data.experiences);
    initializeProjectsSection(data.projects);
    initializeContactForm();
    initializeCvModal();
});
