// CopyMinds - Modern Dark Theme with Multi-language Support



// Waitlist data
let waitlistData = {
    count: 100,
    users: []
};

// Top Traders data
const topTradersData = [
    {
        name: "Annette Black",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Annette",
        profit: "120.5%",
        winRate: "89%",
        followers: "2.4K"
    },
    {
        name: "Jerome Bell", 
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jerome",
        profit: "98.1%",
        winRate: "85%",
        followers: "1.8K"
    },
    {
        name: "Kathryn Murphy",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kathryn", 
        profit: "76.3%",
        winRate: "82%",
        followers: "1.2K"
    },
    {
        name: "Robert Fox",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
        profit: "65.8%",
        winRate: "78%",
        followers: "956"
    }
];

// Store chart instances to prevent memory leaks
let chartInstances = {};

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize navigation
    initializeNavigation();
    
    // Initialize language functionality
    initializeLanguage();
    
    // Initialize waitlist functionality
    await initializeWaitlist();
    
    // Initialize charts with delay to ensure elements are ready
    setTimeout(() => {
        initializeCharts();
    }, 500);
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize scroll effects
    initializeScrollEffects();
});

// Initialize charts with proper error handling
function initializeCharts() {
    // Only initialize if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded');
        return;
    }
    
    // Initialize hero chart
    createHeroChart();

    // Initialize ultra-line-chart
    const ultraLine = document.getElementById('ultra-line-chart');
    if (ultraLine) {
        if (chartInstances['ultra-line-chart']) {
            chartInstances['ultra-line-chart'].destroy();
            delete chartInstances['ultra-line-chart'];
        }
        const ctx = ultraLine.getContext('2d');
        chartInstances['ultra-line-chart'] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 12}, (_, i) => `Month ${i+1}`),
                datasets: [{
                    label: 'Performance',
                    data: [12, 19, 3, 5, 2, 3, 17, 14, 6, 9, 10, 15],
                    borderColor: '#3be37b',
                    backgroundColor: 'rgba(59,227,123,0.1)',
                    borderWidth: 3,
                    pointRadius: 2,
                    tension: 0.35
                }]
            },
            options: {
                plugins: {legend: {display: false}},
                scales: {x: {display: false}, y: {display: false}},
                elements: {point: {radius: 0}},
                responsive: true
            }
        });
    }

    // Initialize ultra-pie-chart
    const ultraPie = document.getElementById('ultra-pie-chart');
    if (ultraPie) {
        if (chartInstances['ultra-pie-chart']) {
            chartInstances['ultra-pie-chart'].destroy();
            delete chartInstances['ultra-pie-chart'];
        }
        const ctx = ultraPie.getContext('2d');
        chartInstances['ultra-pie-chart'] = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['BTC', 'ETH', 'SOL', 'Others'],
                datasets: [{
                    data: [40, 30, 20, 10],
                    backgroundColor: ['#fed136', '#3be37b', '#1e90ff', '#232946'],
                    borderWidth: 2
                }]
            },
            options: {
                plugins: {legend: {display: true, position: 'bottom'}},
                responsive: true
            }
        });
    }

    // Initialize trader charts
    initializeLargeTraderCharts();
}

// Initialize animations with proper element checks
function initializeAnimations() {
    // Counter animations
    const counters = document.querySelectorAll('.counter-number, .stat-number');
    if (counters.length > 0) {
        animateCounters(counters);
    }
    
    // Scroll animations
    const animatedElements = document.querySelectorAll('.feature-card, .team-card, .modern-trader-card');
    if (animatedElements.length > 0) {
        observeElements(animatedElements);
    }
}

// Initialize scroll effects
function initializeScrollEffects() {
    // Parallax effects
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-bg, .neural-network');
        
        parallaxElements.forEach(element => {
            if (element) {
                const speed = element.dataset.speed || 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            }
        });
    });
}

// Animate counters with proper checks
function animateCounters(counters) {
    counters.forEach(counter => {
        if (!counter) return;
        
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        if (isNaN(target)) return;
        
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number with commas
            const formatted = Math.floor(current).toLocaleString();
            
            // Preserve any prefix/suffix
            const originalText = counter.getAttribute('data-original') || counter.textContent;
            const prefix = originalText.match(/^[^\d]*/)[0];
            const suffix = originalText.match(/[^\d]*$/)[0];
            
            counter.textContent = prefix + formatted + suffix;
        }, 20);
    });
}

// Observe elements for scroll animations
function observeElements(elements) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.classList) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        if (element && element.classList) {
            observer.observe(element);
        }
    });
}

// Waitlist Data Management
async function loadWaitlistData() {
    try {
        // Try to load from PHP endpoint first
        const response = await fetch('./waitlist.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            waitlistData = await response.json();
        } else {
            // Fallback to JSON file
            const jsonResponse = await fetch('./waitlist.json');
            if (jsonResponse.ok) {
                waitlistData = await jsonResponse.json();
            } else {
                // Fallback to localStorage
                const savedData = localStorage.getItem('copyminds_waitlist');
                if (savedData) {
                    waitlistData = JSON.parse(savedData);
                } else {
                    // Initialize with 100 fake users
                    waitlistData = {
                        count: 100,
                        users: generateFakeUsers(100)
                    };
                    await saveWaitlistData();
                }
            }
        }
        updateWaitlistCounter();
    } catch (error) {
        console.error('Error loading waitlist data:', error);
        // Fallback to default data
        waitlistData = { count: 100, users: [] };
        updateWaitlistCounter();
    }
}

async function saveWaitlistData() {
    try {
        // Save to localStorage as backup
        localStorage.setItem('copyminds_waitlist', JSON.stringify(waitlistData));
        
        // Send to PHP endpoint
        const response = await fetch('./waitlist.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(waitlistData)
        });
        
        if (!response.ok) {
            console.warn('Failed to save to server, data saved locally');
        }
        
    } catch (error) {
        console.error('Error saving waitlist data:', error);
    }
}

function generateFakeUsers(count) {
    const fakeUsers = [];
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'protonmail.com'];
    const experiences = ['beginner', 'intermediate', 'advanced', 'professional'];
    
    for (let i = 0; i < count; i++) {
        const randomDomain = domains[Math.floor(Math.random() * domains.length)];
        const randomExp = experiences[Math.floor(Math.random() * experiences.length)];
        
        fakeUsers.push({
            email: `user${i + 1}@${randomDomain}`,
            experience: randomExp,
            timestamp: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000, // Random time in last 30 days
            language: 'en'
        });
    }
    
    return fakeUsers;
}

async function addToWaitlist(email, experience) {
    try {
        // Send data to PHP endpoint
        const response = await fetch('./waitlist.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                experience: experience,
                language: currentLanguage
            })
        });
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Failed to add to waitlist');
        }
        
        // Update local data
        waitlistData.count = result.count;
        
        // Update counter
        updateWaitlistCounter();
        
        // Save to localStorage as backup
        localStorage.setItem('copyminds_waitlist', JSON.stringify(waitlistData));
        
        return result.user;
        
    } catch (error) {
        console.error('Error adding to waitlist:', error);
        throw error;
    }
}

function updateWaitlistCounter() {
    const counters = document.querySelectorAll('#waitlistCount, #waitlistDisplay, #footerWaitlistCount');
    counters.forEach(counter => {
        if (counter) {
            animateCounterTo(counter, waitlistData.count);
        }
    });
}

function animateCounterTo(element, targetValue) {
    const currentValue = parseInt(element.textContent) || 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(currentValue + (targetValue - currentValue) * progress);
        
        element.textContent = value;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Language Functions
function changeLanguage(lang) {
    currentLanguage = lang;
    
    // Save to both localStorage and cookies
    localStorage.setItem('copyminds_language', lang);
    setCookie('copyminds_language', lang, 365); // Save for 1 year
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Translate all elements
    translatePage();
    
    // Update language display
    updateLanguageDisplay();
    
    // Close modal properly with backdrop removal
    const languageModal = document.getElementById('languageModal');
    if (languageModal) {
        const modal = bootstrap.Modal.getInstance(languageModal);
        if (modal) {
            modal.hide();
        }
        
        // Force remove backdrop and modal-open class
        setTimeout(() => {
            // Remove any remaining backdrops
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => {
                if (backdrop && backdrop.parentNode) {
                    backdrop.parentNode.removeChild(backdrop);
                }
            });
            
            // Remove modal-open class from body
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }, 300);
    }
}

// Cookie management functions
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function translatePage() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
}

function updateLanguageDisplay() {
    const langDisplay = document.getElementById('currentLang');
    const flagDisplay = document.getElementById('currentFlag');
    
    if (langDisplay) {
        langDisplay.textContent = currentLanguage.toUpperCase();
    }
    
    if (flagDisplay) {
        // Map language codes to country codes for flagcdn.com
        const countryMap = {
            'en': 'us',
            'es': 'es', 
            'fr': 'fr',
            'tr': 'tr'
        };
        
        const countryCode = countryMap[currentLanguage] || 'us';
        flagDisplay.src = `https://flagcdn.com/w40/${countryCode}.png`;
        flagDisplay.alt = `${currentLanguage.toUpperCase()} Flag`;
    }
}

// Navigation
function initializeNavigation() {
    const navbar = document.querySelector('.navbar-collapse');
    if (!navbar) return;

    // Handle navbar collapse on mobile
    const navLinks = document.querySelectorAll('.modern-nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) {
                const bsCollapse = new bootstrap.Collapse(navbar, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        });
    });

    // Handle scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.modern-glass-nav');
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    });
}

// Initialize language functionality
function initializeLanguage() {
    // Check for saved language preference (cookies first, then localStorage)
    let savedLanguage = getCookie('copyminds_language') || localStorage.getItem('copyminds_language') || 'en';
    
    // Validate saved language
    if (!translations[savedLanguage]) {
        savedLanguage = 'en';
    }
    
    // Set the language
    changeLanguage(savedLanguage);
    
    // Language selector functionality
    const languageBtn = document.querySelector('.modern-language-selector');
    const languageModal = document.getElementById('languageModal');
    
    if (languageBtn && languageModal) {
        languageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = new bootstrap.Modal(languageModal, {
                backdrop: true,
                keyboard: true,
                focus: true
            });
            modal.show();
        });
        
        // Handle modal close events
        languageModal.addEventListener('hidden.bs.modal', () => {
            // Ensure backdrop is removed
            setTimeout(() => {
                const backdrops = document.querySelectorAll('.modal-backdrop');
                backdrops.forEach(backdrop => {
                    if (backdrop && backdrop.parentNode) {
                        backdrop.parentNode.removeChild(backdrop);
                    }
                });
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            }, 100);
        });
    }
    
    // Language selection buttons
    const languageBtns = document.querySelectorAll('.modern-language-btn');
    languageBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const lang = btn.getAttribute('data-lang');
                if (lang && translations[lang]) {
                    // Update active state
                    languageBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Change language
                    changeLanguage(lang);
                }
            });
        }
    });
    
    // Update active language button
    updateActiveLanguageButton();
}

// Update active language button
function updateActiveLanguageButton() {
    const languageBtns = document.querySelectorAll('.modern-language-btn');
    languageBtns.forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        if (lang === currentLanguage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Initialize waitlist functionality
async function initializeWaitlist() {
    // Load waitlist data
    await loadWaitlistData();
    
    // Initialize waitlist form
    initializeWaitlistForm();
    
    // Update displays
    updateTopTradersDisplay();
}

// Initialize waitlist form with proper error handling
function initializeWaitlistForm() {
    const form = document.getElementById('waitlistForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email');
        const experience = document.getElementById('experience');
        
        if (!email || !experience) {
            console.error('Form elements not found');
            return;
        }
        
        if (!email.value || !experience.value) {
            showAlert('Please fill in all fields.', 'danger');
            return;
        }
        
        if (!isValidEmail(email.value)) {
            showAlert('Please enter a valid email address.', 'danger');
            return;
        }
        
        try {
            // Add to waitlist
            await addToWaitlist(email.value, experience.value);
            
            // Reset form
            form.reset();
            
            // Show success message
            showAlert('Successfully added to waitlist!', 'success');
        } catch (error) {
            console.error('Error adding to waitlist:', error);
            showAlert(error.message || 'An error occurred. Please try again.', 'danger');
        }
    });
}

// Show alert with proper error handling
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => {
        if (alert && alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    });
    
    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert after form
    const form = document.getElementById('waitlistForm');
    if (form && form.parentNode) {
        form.parentNode.insertBefore(alert, form.nextSibling);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alert && alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 5000);
    }
}

// Update top traders display with error handling
function updateTopTradersDisplay() {
    const container = document.querySelector('.top-traders-list');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Add traders
    topTradersData.forEach((trader, index) => {
        const traderElement = createTraderElement(trader, index);
        if (traderElement) {
            container.appendChild(traderElement);
        }
    });
}

// Create trader element with proper error handling
function createTraderElement(trader, index) {
    if (!trader) return null;
    
    const traderDiv = document.createElement('div');
    traderDiv.className = 'trader-item';
    
    traderDiv.innerHTML = `
        <div class="trader-avatar">
            <img src="${trader.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + trader.name}" 
                 alt="${trader.name || 'Trader'}" 
                 onerror="this.src='https://api.dicebear.com/7.x/initials/svg?seed=${trader.name || 'User'}'">
        </div>
        <div class="trader-info">
            <div class="trader-name">${trader.name || 'Anonymous'}</div>
            <div class="trader-stats">
                <div class="trader-profit">${trader.profit || '+0%'}</div>
                <div class="trader-meta">${trader.followers || '0'} followers • ${trader.winRate || '0%'} win rate</div>
            </div>
        </div>
        <div class="trader-chart">
            <canvas id="modernTraderChart${index}" width="80" height="40"></canvas>
        </div>
    `;
    
    return traderDiv;
}

// Trading Dashboard
function initializeTradingDashboard() {
    // Initialize Top Traders display
    updateTopTradersDisplay();
    
    // Initialize large trader charts
    initializeLargeTraderCharts();
    
    // Initialize Chart.js if available
    const chartCanvas = document.getElementById('profitChart');
    if (chartCanvas && typeof Chart !== 'undefined') {
        const ctx = chartCanvas.getContext('2d');
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 120);
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0.05)');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
                datasets: [{
                    label: 'Profit',
                    data: [1200, 1800, 2100, 2400, 2200, 2600, 2847],
                    borderColor: '#fed136',
                    backgroundColor: gradient,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#fed136',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false
                    }
                },
                elements: {
                    point: {
                        radius: 0
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }
}

// Initialize large trader charts with error handling
function initializeLargeTraderCharts() {
    // Destroy existing charts first
    Object.keys(chartInstances).forEach(key => {
        if (chartInstances[key] && typeof chartInstances[key].destroy === 'function') {
            chartInstances[key].destroy();
            delete chartInstances[key];
        }
    });

    for (let i = 0; i < 4; i++) {
        const canvasId = `modernTraderChart${i}`;
        const canvas = document.getElementById(canvasId);
        if (canvas) {
            createModernTraderChart(canvasId, i);
        }
    }
}

function createModernTraderChart(canvasId, traderIndex) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    // Destroy existing chart if it exists
    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
        delete chartInstances[canvasId];
    }

    const ctx = canvas.getContext('2d');
    
    // Generate sample data
    const labels = [];
    const data = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        labels.push(date.getDate());
        
        // Generate realistic trading data
        const baseValue = 1000 + (traderIndex * 200);
        const trend = (29 - i) * (5 + traderIndex * 2);
        const volatility = (Math.random() - 0.5) * 100;
        data.push(Math.max(0, baseValue + trend + volatility));
    }
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Performance',
                data: data,
                borderColor: '#ffd700',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointHoverBackgroundColor: '#ffd700',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(13, 17, 23, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffd700',
                    borderColor: '#ffd700',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false
                }
            },
            scales: {
                x: {
                    display: false,
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: false,
                    grid: {
                        display: false
                    }
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });

    // Store chart instance
    chartInstances[canvasId] = chart;
}

function updateTopTradersDisplay() {
    const tradersContainer = document.getElementById('topTraders');
    if (!tradersContainer) return;
    
    tradersContainer.innerHTML = '';
    
    topTradersData.forEach((trader, index) => {
        const traderElement = document.createElement('div');
        traderElement.className = 'trader-item';
        traderElement.innerHTML = `
            <div class="trader-avatar">
                <img src="${trader.avatar}" alt="${trader.name}">
            </div>
            <div class="trader-info">
                <div class="trader-name">${trader.name}</div>
                <div class="trader-stats">
                    <div class="trader-profit">+${trader.profit}</div>
                    <div class="trader-meta">${trader.winRate} ${getTranslation('trader_win_rate')} • ${trader.followers} ${getTranslation('trader_followers')}</div>
                </div>
            </div>
            <div class="trader-chart">
                <canvas id="traderChart${index}" width="72" height="32"></canvas>
            </div>
        `;
        tradersContainer.appendChild(traderElement);
        
        // Create mini chart for each trader
        setTimeout(() => createTraderChart(`traderChart${index}`, index), 100 + (index * 50));
    });
}

function createTraderChart(canvasId, traderIndex) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;
    
    const ctx = canvas.getContext('2d');
    
    // Generate sample data based on trader index
    const baseData = [20, 35, 25, 45, 30, 55, 40, 65, 50, 70];
    const data = baseData.map(val => val + (traderIndex * 10) + Math.random() * 15);
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 32);
    gradient.addColorStop(0, 'rgba(0, 212, 170, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 212, 170, 0.05)');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(10).fill(''),
            datasets: [{
                data: data,
                borderColor: '#00d4aa',
                backgroundColor: gradient,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointHoverBackgroundColor: '#00d4aa',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(13, 17, 23, 0.9)',
                    titleColor: '#fed136',
                    bodyColor: '#f0f6fc',
                    borderColor: '#00d4aa',
                    borderWidth: 1,
                    cornerRadius: 6,
                    displayColors: false,
                    callbacks: {
                        title: () => topTradersData[traderIndex].name,
                        label: (context) => `+${context.parsed.y.toFixed(1)}%`
                    }
                }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            },
            elements: {
                point: { radius: 0 }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Utility Functions
function trackWaitlistSignup(data) {
    // Analytics tracking would go here
    console.log('Waitlist signup tracked:', data);
}

// Parallax effect for hero elements
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.trading-dashboard');
    
    parallaxElements.forEach(element => {
        const speed = 0.3;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Initialize hero chart and traders
function initializeHeroDashboard() {
    createHeroChart();
    updateHeroTopTraders();
}

// Create hero performance chart
function createHeroChart() {
    const canvas = document.getElementById('heroChart');
    if (!canvas) return;
    
    // Destroy existing chart if it exists
    if (chartInstances['heroChart']) {
        chartInstances['heroChart'].destroy();
        delete chartInstances['heroChart'];
    }
    
    const ctx = canvas.getContext('2d');
    
    // Generate sample data for the last 24 hours
    const labels = [];
    const data = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        labels.push(time.getHours() + ':00');
        
        // Generate realistic trading data with upward trend
        const baseValue = 2500;
        const trend = (23 - i) * 15; // Upward trend
        const volatility = (Math.random() - 0.5) * 200;
        data.push(baseValue + trend + volatility);
    }
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Portfolio Value',
                data: data,
                borderColor: '#ffd700',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#ffd700',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(13, 17, 23, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffd700',
                    borderColor: '#ffd700',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            return 'Time: ' + context[0].label;
                        },
                        label: function(context) {
                            return '$' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: false,
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: false,
                    grid: {
                        display: false
                    }
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });

    // Store chart instance
    chartInstances['heroChart'] = chart;
}

// Update hero top traders display
function updateHeroTopTraders() {
    const container = document.getElementById('heroTopTraders');
    if (!container) return;
    
    const topTraders = [
        {
            name: 'Annette Black',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Annette',
            profit: '+120.5%',
            status: 'active'
        },
        {
            name: 'Jerome Bell',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jerome',
            profit: '+98.1%',
            status: 'active'
        },
        {
            name: 'Kathryn Murphy',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kathryn',
            profit: '+76.3%',
            status: 'active'
        }
    ];
    
    container.innerHTML = topTraders.map(trader => `
        <div class="hero-trader-item">
            <div class="hero-trader-avatar">
                <img src="${trader.avatar}" alt="${trader.name}">
                <div class="trader-status ${trader.status}"></div>
            </div>
            <div class="hero-trader-info">
                <div class="hero-trader-name">${trader.name}</div>
                <div class="hero-trader-profit">${trader.profit}</div>
            </div>
            <div class="hero-trader-action">
                <i class="fas fa-arrow-right"></i>
            </div>
        </div>
    `).join('');
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add to waitlist function
function addToWaitlist(email, experience) {
    try {
        // Get existing waitlist data
        let waitlistData = JSON.parse(localStorage.getItem('waitlistData')) || [];
        
        // Check if email already exists
        if (waitlistData.some(entry => entry.email === email)) {
            throw new Error('Email already registered');
        }
        
        // Add new entry
        const newEntry = {
            id: Date.now(),
            email: email,
            experience: experience,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        waitlistData.push(newEntry);
        
        // Save to localStorage
        localStorage.setItem('waitlistData', JSON.stringify(waitlistData));
        
        // Update counter
        updateWaitlistCounter();
        
        return true;
    } catch (error) {
        console.error('Error adding to waitlist:', error);
        throw error;
    }
}

// Update waitlist counter
function updateWaitlistCounter() {
    const counterElement = document.querySelector('.counter-number');
    if (!counterElement) return;
    
    try {
        const waitlistData = JSON.parse(localStorage.getItem('waitlistData')) || [];
        const baseCount = 100; // Starting with 100 fake entries
        const totalCount = baseCount + waitlistData.length;
        
        // Animate counter
        animateCounter(counterElement, totalCount);
    } catch (error) {
        console.error('Error updating counter:', error);
    }
}

// Animate single counter
function animateCounter(element, target) {
    if (!element) return;
    
    const current = parseInt(element.textContent.replace(/[^\d]/g, '')) || 0;
    const increment = (target - current) / 50;
    let currentValue = current;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= target) {
            currentValue = target;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(currentValue).toLocaleString();
    }, 20);
}

// Load waitlist data
function loadWaitlistData() {
    try {
        // Initialize with fake data if not exists
        if (!localStorage.getItem('waitlistData')) {
            const fakeData = generateFakeWaitlistData();
            localStorage.setItem('waitlistData', JSON.stringify(fakeData));
        }
        
        // Update counter
        updateWaitlistCounter();
    } catch (error) {
        console.error('Error loading waitlist data:', error);
    }
}

// Generate fake waitlist data
function generateFakeWaitlistData() {
    const fakeEmails = [
        'john.doe@example.com', 'jane.smith@example.com', 'mike.johnson@example.com',
        'sarah.wilson@example.com', 'david.brown@example.com', 'lisa.davis@example.com',
        'chris.miller@example.com', 'amanda.garcia@example.com', 'ryan.martinez@example.com',
        'jessica.anderson@example.com'
    ];
    
    const experiences = ['beginner', 'intermediate', 'advanced'];
    
    return fakeEmails.map((email, index) => ({
        id: index + 1,
        email: email,
        experience: experiences[index % 3],
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending'
    }));
}