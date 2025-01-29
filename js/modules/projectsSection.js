export function initializeProjectsSection(projects) {
    const projectsContainer = document.getElementById('projects-grid');

    projects.forEach(project => {
        const projectElement = createProjectCard(project);
        projectsContainer.appendChild(projectElement);
    });
}

function createProjectCard(project) {
    const projectElement = document.createElement('div');
    projectElement.classList.add('project-card');

    const particles = createParticles(15);

    projectElement.innerHTML = `
        <div class="project-inner">
            <div class="project-front">
                <div class="project-particles">${particles}</div>
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

    projectElement.addEventListener('click', () => {
        projectElement.classList.toggle('flipped');
    });

    return projectElement;
}

function createParticles(count) {
    return Array(count).fill(null).map(() => {
        const size = Math.random() * 2 + 1;
        return `<div class="particle" style="
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            width: ${size}px;
            height: ${size}px;
            animation-delay: ${Math.random()}s;
        "></div>`;
    }).join('');
}
