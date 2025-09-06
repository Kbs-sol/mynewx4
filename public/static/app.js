/**
 * Main Application JavaScript
 * Handles UI interactions, authentication, challenges, and admin functionality
 */

class CyberSecApp {
    constructor() {
        this.isResponsibilityAccepted = false;
        this.isAdminLoggedIn = false;
        this.currentUser = null;
        this.challengeAttempts = 0;
        
        this.init();
    }
    
    init() {
        console.log('CyberSec Academy App initializing...');
        
        // Check if responsibility was already accepted
        this.isResponsibilityAccepted = localStorage.getItem('responsibilityAccepted') === 'true';
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize UI
        this.initializeUI();
        
        // Start loading sequence
        this.startLoadingSequence();
        
        console.log('CyberSec Academy App initialized');
    }
    
    setupEventListeners() {
        // Responsibility modal
        this.setupResponsibilityModal();
        
        // Admin functionality
        this.setupAdminFunctionality();
        
        // Challenge functionality
        this.setupChallengeFunctionality();
        
        // Resource links
        this.setupResourceLinks();
        
        // Navigation and UI
        this.setupNavigation();
        
        // Authentication (placeholder)
        this.setupAuthentication();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }
    
    setupResponsibilityModal() {
        const acceptBtn = document.getElementById('accept-btn');
        const declineBtn = document.getElementById('decline-btn');
        
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.acceptResponsibility());
        }
        
        if (declineBtn) {
            declineBtn.addEventListener('click', () => this.declineResponsibility());
        }
    }
    
    setupAdminFunctionality() {
        const adminBtn = document.getElementById('admin-btn');
        const adminForm = document.getElementById('admin-form');
        const adminCancel = document.getElementById('admin-cancel');
        const adminClose = document.getElementById('admin-close');
        
        if (adminBtn) {
            adminBtn.addEventListener('click', () => this.showAdminModal());
        }
        
        if (adminForm) {
            adminForm.addEventListener('submit', (e) => this.handleAdminLogin(e));
        }
        
        if (adminCancel) {
            adminCancel.addEventListener('click', () => this.hideAdminModal());
        }
        
        if (adminClose) {
            adminClose.addEventListener('click', () => this.hideAdminDashboard());
        }
    }
    
    setupChallengeFunctionality() {
        const challengeForm = document.getElementById('challenge-form');
        
        if (challengeForm) {
            challengeForm.addEventListener('submit', (e) => this.handleChallenge(e));
        }
    }
    
    setupResourceLinks() {
        const resourceLinks = document.querySelectorAll('.resource-link');\n        \n        resourceLinks.forEach(link => {\n            link.addEventListener('click', (e) => {\n                e.preventDefault();\n                const resource = link.getAttribute('data-resource');\n                this.handleResourceClick(resource, link);\n            });\n        });\n    }\n    \n    setupNavigation() {\n        // Smooth scrolling for internal links\n        const internalLinks = document.querySelectorAll('a[href^=\"#\"]');\n        \n        internalLinks.forEach(link => {\n            link.addEventListener('click', (e) => {\n                e.preventDefault();\n                const targetId = link.getAttribute('href').substring(1);\n                const targetElement = document.getElementById(targetId);\n                \n                if (targetElement) {\n                    targetElement.scrollIntoView({ behavior: 'smooth' });\n                    \n                    if (window.cyberSecLogger) {\n                        window.cyberSecLogger.logSectionView(targetId);\n                    }\n                }\n            });\n        });\n        \n        // Button click tracking\n        const buttons = document.querySelectorAll('button:not(#admin-btn):not(#accept-btn):not(#decline-btn)');\n        \n        buttons.forEach(button => {\n            button.addEventListener('click', () => {\n                const buttonText = button.textContent.trim();\n                \n                if (window.cyberSecLogger) {\n                    window.cyberSecLogger.logButtonClick(buttonText);\n                }\n            });\n        });\n    }\n    \n    setupAuthentication() {\n        const loginBtn = document.getElementById('login-btn');\n        \n        if (loginBtn) {\n            loginBtn.addEventListener('click', () => this.handleLogin());\n        }\n        \n        // Check for existing user session\n        const userData = localStorage.getItem('cyberSecUser');\n        if (userData) {\n            try {\n                this.currentUser = JSON.parse(userData);\n                this.updateAuthUI();\n            } catch (e) {\n                console.error('Error parsing user data:', e);\n            }\n        }\n    }\n    \n    setupKeyboardShortcuts() {\n        document.addEventListener('keydown', (e) => {\n            // Admin shortcut: Ctrl+Shift+A\n            if (e.ctrlKey && e.shiftKey && e.key === 'A') {\n                e.preventDefault();\n                this.showAdminModal();\n            }\n            \n            // Language toggle shortcut: Ctrl+L\n            if (e.ctrlKey && e.key === 'l') {\n                e.preventDefault();\n                if (window.languageToggle) {\n                    window.languageToggle.toggle();\n                }\n            }\n        });\n    }\n    \n    initializeUI() {\n        // Set up intersection observer for animations\n        this.setupScrollAnimations();\n        \n        // Update UI based on current state\n        this.updateUI();\n    }\n    \n    setupScrollAnimations() {\n        const observerOptions = {\n            threshold: 0.1,\n            rootMargin: '0px 0px -50px 0px'\n        };\n        \n        const observer = new IntersectionObserver((entries) => {\n            entries.forEach(entry => {\n                if (entry.isIntersecting) {\n                    entry.target.style.opacity = '1';\n                    entry.target.style.transform = 'translateY(0)';\n                    \n                    // Log section view\n                    if (window.cyberSecLogger) {\n                        const sectionId = entry.target.id || 'unnamed-section';\n                        window.cyberSecLogger.logSectionView(sectionId);\n                    }\n                }\n            });\n        }, observerOptions);\n        \n        // Observe sections\n        const sections = document.querySelectorAll('section');\n        sections.forEach(section => {\n            section.style.opacity = '0';\n            section.style.transform = 'translateY(30px)';\n            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';\n            observer.observe(section);\n        });\n    }\n    \n    startLoadingSequence() {\n        const loadingScreen = document.getElementById('loading-screen');\n        const responsibilityModal = document.getElementById('responsibility-modal');\n        \n        // Hide loading screen after 2 seconds\n        setTimeout(() => {\n            if (loadingScreen) {\n                loadingScreen.style.opacity = '0';\n                loadingScreen.style.transition = 'opacity 0.5s ease';\n                \n                setTimeout(() => {\n                    loadingScreen.style.display = 'none';\n                    \n                    // Show responsibility modal if not accepted\n                    if (!this.isResponsibilityAccepted && responsibilityModal) {\n                        responsibilityModal.classList.remove('hidden');\n                    }\n                }, 500);\n            }\n        }, 2000);\n    }\n    \n    acceptResponsibility() {\n        const modal = document.getElementById('responsibility-modal');\n        \n        this.isResponsibilityAccepted = true;\n        localStorage.setItem('responsibilityAccepted', 'true');\n        \n        // Log acceptance\n        if (window.cyberSecLogger) {\n            window.cyberSecLogger.logAcceptance();\n        }\n        \n        // Hide modal with animation\n        if (modal) {\n            modal.style.opacity = '0';\n            modal.style.transition = 'opacity 0.3s ease';\n            \n            setTimeout(() => {\n                modal.classList.add('hidden');\n                modal.style.opacity = '1';\n            }, 300);\n        }\n        \n        console.log('Responsibility accepted');\n    }\n    \n    declineResponsibility() {\n        // Log decline\n        if (window.cyberSecLogger) {\n            window.cyberSecLogger.logDecline();\n        }\n        \n        // Redirect away or show message\n        alert('You must accept the responsibility agreement to access CyberSec Academy. Redirecting...');\n        \n        setTimeout(() => {\n            window.location.href = 'https://www.google.com';\n        }, 2000);\n        \n        console.log('Responsibility declined');\n    }\n    \n    showAdminModal() {\n        const modal = document.getElementById('admin-modal');\n        const passwordField = document.getElementById('admin-password');\n        \n        if (modal) {\n            modal.classList.remove('hidden');\n        }\n        \n        if (passwordField) {\n            passwordField.focus();\n        }\n        \n        if (window.cyberSecLogger) {\n            window.cyberSecLogger.log('admin_modal_opened', 'Admin modal displayed');\n        }\n    }\n    \n    hideAdminModal() {\n        const modal = document.getElementById('admin-modal');\n        const passwordField = document.getElementById('admin-password');\n        \n        if (modal) {\n            modal.classList.add('hidden');\n        }\n        \n        if (passwordField) {\n            passwordField.value = '';\n        }\n    }\n    \n    async handleAdminLogin(e) {\n        e.preventDefault();\n        \n        const passwordField = document.getElementById('admin-password');\n        const password = passwordField ? passwordField.value : '';\n        \n        try {\n            const response = await fetch('/api/admin/login', {\n                method: 'POST',\n                headers: {\n                    'Content-Type': 'application/json'\n                },\n                body: JSON.stringify({ password })\n            });\n            \n            const result = await response.json();\n            \n            if (result.success) {\n                this.isAdminLoggedIn = true;\n                this.hideAdminModal();\n                this.showAdminDashboard();\n                \n                if (window.cyberSecLogger) {\n                    window.cyberSecLogger.logAdminLogin(true);\n                }\n            } else {\n                alert('Invalid password!');\n                \n                if (window.cyberSecLogger) {\n                    window.cyberSecLogger.logAdminLogin(false);\n                }\n            }\n        } catch (error) {\n            console.error('Admin login error:', error);\n            alert('Login failed. Please try again.');\n            \n            if (window.cyberSecLogger) {\n                window.cyberSecLogger.logError(error, 'Admin login');\n            }\n        }\n    }\n    \n    showAdminDashboard() {\n        const dashboard = document.getElementById('admin-dashboard');\n        \n        if (dashboard) {\n            dashboard.classList.remove('hidden');\n            this.populateAdminDashboard();\n        }\n    }\n    \n    hideAdminDashboard() {\n        const dashboard = document.getElementById('admin-dashboard');\n        \n        if (dashboard) {\n            dashboard.classList.add('hidden');\n        }\n        \n        this.isAdminLoggedIn = false;\n    }\n    \n    populateAdminDashboard() {\n        const activityLogs = document.getElementById('activity-logs');\n        \n        if (activityLogs && window.cyberSecLogger) {\n            const logs = window.cyberSecLogger.getRecentLogs(20);\n            \n            activityLogs.innerHTML = logs.map(log => `\n                <div class=\"bg-gray-800 p-3 rounded border-l-4 border-green-500 mb-2\">\n                    <div class=\"flex justify-between items-start\">\n                        <div>\n                            <div class=\"text-green-400 font-semibold\">${log.action}</div>\n                            <div class=\"text-gray-300 text-sm\">${log.user} - ${log.extra}</div>\n                        </div>\n                        <div class=\"text-gray-500 text-xs\">\n                            ${new Date(log.timestamp).toLocaleString()}\n                        </div>\n                    </div>\n                </div>\n            `).join('');\n        }\n    }\n    \n    handleChallenge(e) {\n        e.preventDefault();\n        \n        const username = document.getElementById('username')?.value || '';\n        const password = document.getElementById('password')?.value || '';\n        const resultDiv = document.getElementById('challenge-result');\n        \n        this.challengeAttempts++;\n        \n        // Simple SQL injection detection (educational purpose)\n        const sqlPatterns = [\n            /'/i,\n            /or\\s+1\\s*=\\s*1/i,\n            /union\\s+select/i,\n            /admin'\\s*--/i,\n            /';\\s*drop/i\n        ];\n        \n        const hasSqlInjection = sqlPatterns.some(pattern => \n            pattern.test(username) || pattern.test(password)\n        );\n        \n        let result = '';\n        let success = false;\n        \n        if (hasSqlInjection) {\n            success = true;\n            result = `\n                <div class=\"text-green-400 font-bold\">🎉 Success!</div>\n                <div class=\"text-sm mt-2\">Flag: CYBERSEC{SQL_1NJ3CT10N_M4ST3R}</div>\n                <div class=\"text-xs text-gray-400 mt-2\">You found a SQL injection vulnerability!</div>\n            `;\n        } else if (username === 'admin' && password === 'password') {\n            result = `\n                <div class=\"text-blue-400\">Valid login, but no flag here.</div>\n                <div class=\"text-xs text-gray-400 mt-2\">Try thinking like a hacker... 🤔</div>\n            `;\n        } else {\n            result = `\n                <div class=\"text-red-400\">Invalid credentials.</div>\n                <div class=\"text-xs text-gray-400 mt-2\">Attempts: ${this.challengeAttempts}</div>\n            `;\n        }\n        \n        if (resultDiv) {\n            resultDiv.innerHTML = result;\n        }\n        \n        // Log the attempt\n        if (window.cyberSecLogger) {\n            window.cyberSecLogger.logChallengeAttempt('SQL Injection Basics', {\n                success,\n                attempts: this.challengeAttempts,\n                input: { username: username.substring(0, 50), password: password.substring(0, 50) }\n            });\n        }\n        \n        console.log('Challenge attempt:', { success, attempts: this.challengeAttempts });\n    }\n    \n    handleResourceClick(resource, linkElement) {\n        // Resource URLs mapping\n        const resourceUrls = {\n            'tryhackme': 'https://tryhackme.com',\n            'hackthebox': 'https://hackthebox.com',\n            'overthewire': 'https://overthewire.org',\n            'kali': 'https://kali.org',\n            'burpsuite': 'https://portswigger.net/burp',\n            'nmap': 'https://nmap.org',\n            'metasploit': 'https://metasploit.com',\n            'oscp': 'https://www.offensive-security.com/pwk-oscp/',\n            'ceh': 'https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/',\n            'cissp': 'https://www.isc2.org/Certifications/CISSP',\n            'security+': 'https://www.comptia.org/certifications/security'\n        };\n        \n        const url = resourceUrls[resource];\n        \n        if (url) {\n            // Log the click\n            if (window.cyberSecLogger) {\n                window.cyberSecLogger.logResourceClick(resource);\n            }\n            \n            // Add visual feedback\n            linkElement.style.color = '#22c55e';\n            linkElement.style.transform = 'translateX(10px)';\n            \n            setTimeout(() => {\n                linkElement.style.color = '';\n                linkElement.style.transform = '';\n            }, 200);\n            \n            // Open in new tab after short delay\n            setTimeout(() => {\n                window.open(url, '_blank');\n            }, 300);\n        } else {\n            console.error('Resource URL not found for:', resource);\n        }\n    }\n    \n    handleLogin() {\n        // Placeholder for Google/Discord login\n        alert('Authentication coming soon! For now, all actions are logged as \"Anonymous\".');\n        \n        if (window.cyberSecLogger) {\n            window.cyberSecLogger.log('login_attempted', 'User clicked login button');\n        }\n    }\n    \n    updateAuthUI() {\n        const authSection = document.getElementById('auth-section');\n        \n        if (!authSection) return;\n        \n        if (this.currentUser) {\n            authSection.innerHTML = `\n                <div class=\"flex items-center space-x-3\">\n                    <span class=\"text-green-400\">👋 ${this.currentUser.name}</span>\n                    <button id=\"logout-btn\" class=\"text-red-400 hover:text-red-300 text-sm\">\n                        <i class=\"fas fa-sign-out-alt\"></i>\n                    </button>\n                </div>\n            `;\n            \n            // Add logout functionality\n            const logoutBtn = document.getElementById('logout-btn');\n            if (logoutBtn) {\n                logoutBtn.addEventListener('click', () => this.handleLogout());\n            }\n        } else {\n            authSection.innerHTML = `\n                <button id=\"login-btn\" class=\"bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors\">\n                    <i class=\"fab fa-google mr-2\"></i>Sign In\n                </button>\n            `;\n            \n            // Re-add login functionality\n            const loginBtn = document.getElementById('login-btn');\n            if (loginBtn) {\n                loginBtn.addEventListener('click', () => this.handleLogin());\n            }\n        }\n    }\n    \n    handleLogout() {\n        this.currentUser = null;\n        localStorage.removeItem('cyberSecUser');\n        this.updateAuthUI();\n        \n        if (window.cyberSecLogger) {\n            window.cyberSecLogger.log('logout', 'User logged out');\n        }\n    }\n    \n    updateUI() {\n        // Update various UI elements based on current state\n        this.updateAuthUI();\n        \n        // Add any other UI updates here\n    }\n}\n\n// Initialize app when DOM is ready\nif (typeof window !== 'undefined') {\n    window.addEventListener('DOMContentLoaded', () => {\n        window.cyberSecApp = new CyberSecApp();\n    });\n}\n\n// Export for use in other scripts\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = CyberSecApp;\n}"