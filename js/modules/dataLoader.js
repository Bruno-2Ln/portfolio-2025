import { config } from './config.js';

export async function loadPortfolioData() {
    try {
        const response = await fetch('../data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur de chargement des données:', error);
        return null;
    }
}
