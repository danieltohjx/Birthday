// ========================================
// CONFIGURATION - Edit these values
// ========================================

const CONFIG = {
    // Relationship details
    partnerName: "My Love",
    yourName: "Your Love",
    relationshipStartDate: "2020-01-01", // Format: YYYY-MM-DD
    
    // First Date details
    firstDate: {
        date: "2020-01-01",
        location: "Cozy Café on Main Street",
        whatHappened: "We met at that little café you suggested. The one with the big windows and the plants everywhere. I remember being nervous, wondering if I'd said the right things in our messages. But when you walked in, everything felt natural. We talked for hours, and I didn't want it to end.",
        whatStoodOut: "Your laugh. The way you got excited talking about the things you love. How comfortable the silence felt between us, even on a first date. I remember thinking, 'I could do this forever.' And here we are.",
        howItFelt: "Honestly? It felt like coming home. Like something just clicked into place. I walked away knowing that this wasn't just another date—this was the start of something real. Something worth holding onto.",
        photos: [
            "assets/photos/firstdate1.jpg",
            "assets/photos/firstdate2.jpg"
        ]
    },
    
    // Favorite moments photos (for moments.html and homepage collage)
    moments: [
        {
            image: "assets/photos/moment1.jpg",
            caption: "That sunset we watched together, the world felt like it stopped just for us"
        },
        {
            image: "assets/photos/moment2.jpg",
            caption: "Your smile in this photo still makes my heart skip a beat"
        },
        {
            image: "assets/photos/moment3.jpg",
            caption: "The day everything felt perfect, just being with you"
        },
        {
            image: "assets/photos/moment4.jpg",
            caption: "Adventures are always better when you're by my side"
        },
        {
            image: "assets/photos/moment5.jpg",
            caption: "This moment reminded me why I fell for you"
        },
        {
            image: "assets/photos/moment6.jpg",
            caption: "Just another day loving you more than yesterday"
        }
    ],
    
    // Travels data
    travels: [
        {
            location: "Paris, France",
            dates: "June 2021",
            highlights: [
                "Watching the Eiffel Tower sparkle at midnight",
                "Getting lost in the streets of Montmartre and finding that perfect little bistro",
                "The look on your face when we saw the view from Sacré-Cœur"
            ],
            photos: [
                "assets/photos/paris1.jpg",
                "assets/photos/paris2.jpg",
                "assets/photos/paris3.jpg"
            ]
        },
        {
            location: "Tokyo, Japan",
            dates: "March 2022",
            highlights: [
                "Cherry blossoms in full bloom at Ueno Park",
                "Our midnight ramen adventure in Shibuya",
                "That quiet moment at the temple where everything felt so peaceful"
            ],
            photos: [
                "assets/photos/tokyo1.jpg",
                "assets/photos/tokyo2.jpg"
            ]
        },
        {
            location: "Bali, Indonesia",
            dates: "December 2022",
            highlights: [
                "Sunrise at Mount Batur - the most beautiful view with the most beautiful person",
                "Our cooking class where we laughed more than we cooked",
                "Beach walks at sunset, just us and the waves"
            ],
            photos: [
                "assets/photos/bali1.jpg",
                "assets/photos/bali2.jpg",
                "assets/photos/bali3.jpg"
            ]
        }
    ]
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

function calculateDaysTogether(startDate) {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ========================================
// THEME MANAGEMENT
// ========================================

function initTheme() {
    const themeSelect = document.getElementById('theme-select');
    if (!themeSelect) return;
    
    // Load saved theme or use default
    const savedTheme = localStorage.getItem('selectedTheme') || 'pink';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeSelect.value = savedTheme;
    
    // Listen for theme changes
    themeSelect.addEventListener('change', (e) => {
        const theme = e.target.value;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('selectedTheme', theme);
    });
}

// ========================================
// HOMEPAGE FUNCTIONALITY
// ========================================

function initHomepage() {
    // Update relationship counter
    const daysTogether = document.getElementById('days-together');
    const sinceDate = document.getElementById('since-date');
    
    if (daysTogether && sinceDate) {
        const days = calculateDaysTogether(CONFIG.relationshipStartDate);
        daysTogether.textContent = days.toLocaleString();
        sinceDate.textContent = CONFIG.relationshipStartDate;
    }
    
    // Create photo collage animation
    const collage = document.getElementById('photo-collage');
    if (collage && CONFIG.moments.length > 0) {
        // Use first 6 photos for collage
        const photosToShow = CONFIG.moments.slice(0, 6);
        
        photosToShow.forEach((moment, index) => {
            setTimeout(() => {
                createPolaroid(collage, moment.image, index);
            }, index * 300); // Stagger the animations
        });
    }
}

function createPolaroid(container, imageSrc, index) {
    const polaroid = document.createElement('div');
    polaroid.className = 'polaroid';
    
    // Random position within container
    const maxWidth = container.offsetWidth - 270;
    const maxHeight = 400;
    const left = getRandomInt(0, Math.max(0, maxWidth));
    const top = getRandomInt(0, maxHeight);
    
    // Random rotation
    const rotation = getRandomInt(-15, 15);
    
    polaroid.style.left = `${left}px`;
    polaroid.style.top = `${top}px`;
    polaroid.style.setProperty('--rotation', `${rotation}deg`);
    polaroid.style.animationDelay = '0s';
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = 'Memory';
    img.onerror = function() {
        // If image doesn't load, use a placeholder
        this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="250" height="250"%3E%3Crect fill="%23ddd" width="250" height="250"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EPhoto ' + (index + 1) + '%3C/text%3E%3C/svg%3E';
    };
    
    polaroid.appendChild(img);
    container.appendChild(polaroid);
}

// ========================================
// MOMENTS PAGE
// ========================================

function initMomentsPage() {
    const grid = document.getElementById('moments-grid');
    if (!grid) return;
    
    CONFIG.moments.forEach((moment) => {
        const card = document.createElement('div');
        card.className = 'moment-card';
        
        const img = document.createElement('img');
        img.src = moment.image;
        img.alt = moment.caption;
        img.onerror = function() {
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EMemory%3C/text%3E%3C/svg%3E';
        };
        
        const caption = document.createElement('div');
        caption.className = 'moment-caption';
        caption.textContent = moment.caption;
        
        card.appendChild(img);
        card.appendChild(caption);
        grid.appendChild(card);
    });
}

// ========================================
// FIRST DATE PAGE
// ========================================

function initFirstDatePage() {
    // Update date metadata
    const dateEl = document.getElementById('first-date-date');
    const locationEl = document.getElementById('first-date-location');
    
    if (dateEl) dateEl.textContent = CONFIG.firstDate.date;
    if (locationEl) locationEl.textContent = CONFIG.firstDate.location;
    
    // Update story sections
    const whatHappened = document.getElementById('what-happened');
    const whatStoodOut = document.getElementById('what-stood-out');
    const howItFelt = document.getElementById('how-it-felt');
    
    if (whatHappened) whatHappened.textContent = CONFIG.firstDate.whatHappened;
    if (whatStoodOut) whatStoodOut.textContent = CONFIG.firstDate.whatStoodOut;
    if (howItFelt) howItFelt.textContent = CONFIG.firstDate.howItFelt;
    
    // Add photos if they exist
    const photosContainer = document.getElementById('first-date-photos');
    if (photosContainer && CONFIG.firstDate.photos.length > 0) {
        CONFIG.firstDate.photos.forEach((photoSrc) => {
            const img = document.createElement('img');
            img.src = photoSrc;
            img.alt = 'First Date Memory';
            img.className = 'story-photo';
            img.onerror = function() {
                this.style.display = 'none';
            };
            photosContainer.appendChild(img);
        });
    }
}

// ========================================
// TRAVELS PAGE
// ========================================

function initTravelsPage() {
    const container = document.getElementById('travels-content');
    if (!container) return;
    
    CONFIG.travels.forEach((travel) => {
        const section = document.createElement('div');
        section.className = 'travel-section';
        
        // Header
        const header = document.createElement('div');
        header.className = 'travel-header';
        
        const location = document.createElement('h2');
        location.className = 'travel-location';
        location.textContent = travel.location;
        
        const dates = document.createElement('div');
        dates.className = 'travel-dates';
        dates.textContent = travel.dates;
        
        header.appendChild(location);
        header.appendChild(dates);
        
        // Highlights
        const highlights = document.createElement('ul');
        highlights.className = 'travel-highlights';
        
        travel.highlights.forEach((highlight) => {
            const li = document.createElement('li');
            li.textContent = highlight;
            highlights.appendChild(li);
        });
        
        // Photos
        const photosGrid = document.createElement('div');
        photosGrid.className = 'travel-photos';
        
        travel.photos.forEach((photoSrc) => {
            const img = document.createElement('img');
            img.src = photoSrc;
            img.alt = `${travel.location} memory`;
            img.className = 'travel-photo';
            img.onerror = function() {
                this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="12" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EPhoto%3C/text%3E%3C/svg%3E';
            };
            photosGrid.appendChild(img);
        });
        
        section.appendChild(header);
        section.appendChild(highlights);
        section.appendChild(photosGrid);
        container.appendChild(section);
    });
}

// ========================================
// LETTER PAGE
// ========================================

function initLetterPage() {
    const signatureName = document.getElementById('signature-name');
    if (signatureName) {
        signatureName.textContent = CONFIG.yourName;
    }
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme on all pages
    initTheme();
    
    // Detect current page and initialize accordingly
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);
    
    if (page === '' || page === 'index.html') {
        initHomepage();
    } else if (page === 'moments.html') {
        initMomentsPage();
    } else if (page === 'first-date.html') {
        initFirstDatePage();
    } else if (page === 'travels.html') {
        initTravelsPage();
    } else if (page === 'letter.html') {
        initLetterPage();
    }
});
