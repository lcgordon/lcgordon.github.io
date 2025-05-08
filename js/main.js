// Import WindowSystem
import { WindowSystem } from './nwindowManager.js';

// State management
const WindowManager = {
    zIndex: 1000,
    activeWindow: null,
    windows: new Map(),
    THEME_KEY: 'polly-theme',
    isDarkTheme: false
};

// Clock update
function updateClock() {
    const timeElement = document.getElementById('time');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    }
}

// Theme management
function updateTheme(isDark) {
    const icon = document.querySelector('.theme-toggle-btn i');
    if (icon) {
        icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    }
    document.body.classList.toggle('dark-theme', isDark);
    WindowManager.isDarkTheme = isDark;
}

function setupThemeToggle() {
    const themeToggleBtn = document.querySelector('.theme-toggle-btn');
    if (!themeToggleBtn) return;
    
    const savedTheme = localStorage.getItem(WindowManager.THEME_KEY);
    WindowManager.isDarkTheme = savedTheme === 'light' ? false : true;
    
    updateTheme(WindowManager.isDarkTheme);
    
    themeToggleBtn.addEventListener('click', () => {
        WindowManager.isDarkTheme = !WindowManager.isDarkTheme;
        updateTheme(WindowManager.isDarkTheme);
        localStorage.setItem(WindowManager.THEME_KEY, WindowManager.isDarkTheme ? 'dark' : 'light');
    });
}

// Mobile detection and navigation setup
function setupMobileDetection() {
    const isMobile = window.innerWidth <= 768;
    document.body.classList.toggle('is-mobile', isMobile);
    
    // Add console logs for debugging
    console.log('Setting up mobile detection. Is mobile:', isMobile);
    
    if (isMobile) {
        // Initialize mobile navigation
        console.log('Initializing mobile navigation');
        const mobileNavRoot = document.getElementById('mobile-nav-root');
        if (mobileNavRoot) {
            try {
                const root = ReactDOM.createRoot(mobileNavRoot);
                root.render(React.createElement(window.MobileNavigation));
                console.log('Mobile navigation mounted');
            } catch (error) {
                console.error('Error mounting mobile navigation:', error);
            }
        } else {
            console.error('Mobile nav root element not found');
        }
    }
}

// System initialization
function initializeSystemState() {
    if (localStorage.getItem(WindowManager.THEME_KEY) === null) {
        WindowManager.isDarkTheme = true;
        updateTheme(true);
        localStorage.setItem(WindowManager.THEME_KEY, 'dark');
    }

    // Handle window resizing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            handleWindowResize();
            // Also check for mobile navigation on resize
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                setupMobileDetection();
            }
        }, 250);
    });
}

// Window resize handling
function handleWindowResize() {
    const isMobile = window.innerWidth <= 768;
    document.body.classList.toggle('is-mobile', isMobile);
}

// Desktop icons initialization
function initializeDesktopIcons() {
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const type = icon.getAttribute('data-window');
            if (type) {
                WindowSystem.createWindow(type);
            }
        });
    });
}

// Initialize Theme Background
function initializeThemeBackground() {
    const themeBackgroundRoot = document.getElementById('theme-background-root');
    if (themeBackgroundRoot) {
        const root = ReactDOM.createRoot(themeBackgroundRoot);
        root.render(React.createElement(window.ThemeBackground));
    }
}

// Main initialization
async function initialize() {
    try {
        // Basic UI updates first
        updateClock();
        setInterval(updateClock, 1000);
        
        // Setup core functionality
        setupMobileDetection();
        setupThemeToggle();
        initializeSystemState();
        
        // Wait for critical resources
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Initialize UI components
        initializeDesktopIcons();
        initializeThemeBackground();
        
        // Create initial windows
        WindowSystem.createWindow('welcome');
        
        
        console.log('Initialization complete');
    } catch (error) {
        console.error('Initialization failed:', error);
        
    }
}

// Add error handling for script loading
window.addEventListener('error', function(e) {
    console.error('Resource loading error:', e);
    
}, true);

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', initialize);


setTimeout(() => {
   
}, 5000); // 5 second backup timeout

// Global exports
window.toggleStartMenu = toggleStartMenu;
window.toggleCreditMenu = toggleCreditMenu;
window.handleWindowResize = handleWindowResize;
window.WindowSystem = WindowSystem;

// API exports
export const WindowAPI = {
    bringToFront: (windowId) => {
        const windowElement = document.getElementById(windowId);
        if (windowElement) {
            windowElement.style.zIndex = ++WindowManager.zIndex;
        }
    },
    updateLogoVisibility: () => {
        const hasMaximizedWindow = Array.from(WindowManager.windows.values())
            .some(w => w.maximized);
        document.body.classList.toggle('has-maximized-window', hasMaximizedWindow);
    }
};

export const isDarkTheme = () => WindowManager.isDarkTheme;
export const updateThemePublic = updateTheme;