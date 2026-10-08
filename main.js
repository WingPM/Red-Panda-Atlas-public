// ==========================================
// 1. SELECT ELEMENTS
// ==========================================

const mainNav = document.querySelector('.main-nav');
const continentGrid = document.querySelector('#continent-grid');
const zooResults = document.querySelector('#zoo-results');
const countryFilter = document.querySelector('#country-filter');
const form = document.querySelector('#finding-form');
const logoLink = document.querySelector('.logo-link');

// ==========================================
// 2. DATA DEFINITIONS
// ==========================================

const regions = ['Asia', 'North America', 'Europe', 'Australia', 'South America', 'Africa', 'Antarctica'];

const navLinks = [
    { text: 'Home', href: 'index.html' },
    { text: 'Asia', href: 'asia.html' },
    { text: 'Europe', href: 'europe.html' },
    { text: 'North America', href: 'north-america.html' },
    { text: 'Australia', href: 'australia.html' },
    { text: 'South America', href: 'south-america.html' },
    { text: 'Africa', href: 'africa.html' },
    { text: 'Antarctica', href: 'antarctica.html' }
];

const logoImages = [
    { src: 'red_panda_logok0.png', alt: 'Website logo made by Kayle' },
    { src: 'red_panda_logob0.png', alt: 'Website logo made by Vendyl/Frayl' },
    { src: 'red_panda_logok0.png', alt: 'Website logo made by Kayle' },
    { src: 'red_panda_logob0.png', alt: 'Website logo made by Vendyl/Frayl' }
];

// ==========================================
// 3. BUILD NAVIGATION BAR & LOGO (ALL PAGES)
// ==========================================

if (logoLink) {
    const selectedLogo = logoImages[Math.floor(Math.random() * logoImages.length)];
    const imgTag = document.createElement('img');
    imgTag.src = selectedLogo.src;
    imgTag.alt = selectedLogo.alt;
    logoLink.prepend(imgTag);
}

if (mainNav) {
    const navList = document.createElement('ul');
    navLinks.forEach(link => {
        navList.innerHTML += `<li><a href="${link.href}">${link.text}</a></li>`;
    });
    mainNav.appendChild(navList);
}

// ==========================================
// 4. HOMEPAGE REGION CARDS (INDEX.HTML ONLY)
// ==========================================

if (continentGrid) {
    regions.forEach(region => {
        const fileName = region.toLowerCase().replace(' ', '-') + '.html';
        continentGrid.innerHTML += `
            <a href="${fileName}" class="continent-card">
                <img src="https://cdn-icons-png.flaticon.com/512/10990/10990736.png" alt="${region} map icon">
                <h3>${region}</h3>
                <p>Explore red panda locations in ${region}.</p>
                <p class="card-link">Explore <span class="arrow">&rarr;</span></p>
            </a>
        `;
    });
}

// ==========================================
// 5. CONTINENT ZOO DISPLAY & FILTERING
// ==========================================

if (zooResults) {
    const currentContinent = document.body.dataset.continent;
    const continentZoos = (typeof zooData !== 'undefined' && zooData[currentContinent]) ? zooData[currentContinent] : [];

    function displayZoos(listToRender) {
        zooResults.innerHTML = '';

        if (listToRender.length === 0) {
            zooResults.innerHTML = '<p>No zoos found for this selection.</p>';
            return;
        }

        listToRender.forEach(zoo => {
            const locationText = zoo.state
                ? `${zoo.city}, ${zoo.state}, ${zoo.country}`
                : `${zoo.city}, ${zoo.country}`;

            zooResults.innerHTML += `
                <div class="zoo-card">
                    <h3>${zoo.name}</h3>
                    <p><strong>Location:</strong> ${locationText}</p>
                    ${zoo.website ? `<a href="${zoo.website}" target="_blank" rel="noopener">Visit Website &rarr;</a>` : ''}
                </div>
            `;
        });
    }

    displayZoos(continentZoos);

    if (countryFilter) {
        const filterOptions = [...new Set(continentZoos.map(zoo => zoo.state || zoo.country))].filter(Boolean);
        filterOptions.sort((a, b) => a.localeCompare(b));

        filterOptions.forEach(option => {
            countryFilter.innerHTML += `<option value="${option}">${option}</option>`;
        });

        countryFilter.addEventListener('change', (event) => {
            const selectedValue = event.target.value;
            if (selectedValue === '') {
                displayZoos(continentZoos);
            } else {
                const filteredList = continentZoos.filter(zoo =>
                    zoo.state === selectedValue || zoo.country === selectedValue
                );
                displayZoos(filteredList);
            }
        });
    }
}

// ==========================================
// 6. FORM SUBMISSION (FORMSPREE)
// ==========================================

if (form) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const zooName = document.querySelector('#zoo-name').value;
        const zooContinent = document.querySelector('#zoo-continent').value;
        const zooCity = document.querySelector('#zoo-city').value;
        const zooState = document.querySelector('#zoo-state').value;
        const zooCountry = document.querySelector('#zoo-country').value;
        let zooWebsite = document.querySelector('#zoo-website').value.trim();

        if (zooWebsite) {
            if (!/^https?:\/\//i.test(zooWebsite)) {
                zooWebsite = 'https://' + zooWebsite;
            }

            try {
                const parsedUrl = new URL(zooWebsite);
                if (!parsedUrl.hostname.includes('.')) throw new Error('Invalid domain');
                zooWebsite = parsedUrl.href;
            } catch (error) {
                alert('Please enter a valid website address (e.g., zoo.com or https://zoo.com).');
                return;
            }
        }

        const payload = {
            zooName: zooName,
            continent: zooContinent,
            city: zooCity,
            state: zooState || 'N/A',
            country: zooCountry,
            website: zooWebsite || 'N/A'
        };

        try {
            const response = await fetch('https://formspree.io/f/mnpnkllz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert(`Thank you! Your finding for "${zooName}" in ${zooCity}, ${zooCountry} (${zooContinent}) has been submitted.`);
                form.reset();
            } else {
                alert('There was an issue sending your submission. Please try again.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Unable to connect. Please check your internet connection.');
        }
    });
}

// ==========================================
// 7. GLOBAL FOOTER DISCLAIMER & BACK-TO-TOP
// ==========================================

const footerContainer = document.querySelector('footer .footer-content');
if (footerContainer) {
    const legalBar = document.createElement('div');
    legalBar.className = 'legal-bar';
    legalBar.innerHTML = `<p>Independent non-commercial hobby project. Not affiliated with, endorsed by, or partnered with Red Panda Network, EAZA, AZA SAFE, or any zoo/sanctuary.</p>`;
    footerContainer.before(legalBar);
}

// Back-to-Top Button Creation
const backToTopBtn = document.createElement('button');
backToTopBtn.id = 'back-to-top';
backToTopBtn.setAttribute('aria-label', 'Back to top');
backToTopBtn.innerHTML = '↑ Top';
document.body.appendChild(backToTopBtn);

const footer = document.querySelector('footer');

window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }

    if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        if (footerRect.top < viewportHeight) {
            const overlap = viewportHeight - footerRect.top;
            backToTopBtn.style.bottom = `${overlap + 20}px`;
        } else {
            backToTopBtn.style.bottom = '25px';
        }
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});