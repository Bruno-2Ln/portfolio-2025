export function initializeExperienceSection(experiences) {
    const experienceContainer = document.getElementById('experience-timeline');

    experiences.forEach((exp, index) => {
        const groupElement = createExperienceGroup(exp, index);
        experienceContainer.appendChild(groupElement);
    });

    initializeScrollAnimation();
}

function createExperienceGroup(exp, index) {
    const groupElement = document.createElement('div');
    groupElement.classList.add('experience-group');

    const dateMarker = document.createElement('div');
    dateMarker.classList.add('timeline-date');
    dateMarker.textContent = exp.period;

    const expElement = document.createElement('div');
    expElement.classList.add('experience-item');
    expElement.classList.add(index % 2 === 0 ? 'experience-left' : 'experience-right');

    expElement.innerHTML = `
        <div class="experience-content">
            <h3 class="experience-title">${exp.title}</h3>
            <p class="experience-company">${exp.company}</p>
            <p class="experience-description">${exp.description}</p>
        </div>
    `;

    groupElement.appendChild(dateMarker);
    groupElement.appendChild(expElement);

    return groupElement;
}

function initializeScrollAnimation() {
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const experienceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('animate');
                void entry.target.offsetWidth;
                entry.target.classList.add('animate');
            } else {
                entry.target.classList.remove('animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.experience-item').forEach(item => {
        experienceObserver.observe(item);
    });
}
