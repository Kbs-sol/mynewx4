/**
 * Language Toggle System
 * Toggles between Casual and Professional language with smooth animations
 */

class LanguageToggle {
    constructor() {
        this.isProfessional = false;
        this.isAnimating = false;
        
        // Language pairs - expandable
        this.languagePairs = {
            'hero-subtitle': {
                casual: "Don't feel bad if you make mistakes. Learning hacking is fun and cool!",
                professional: "Errors are part of the learning process — refine and improve. Cybersecurity learning is engaging and rewarding."
            },
            'basics-desc': {
                casual: "Ask anything, no judgement. Start with networking fundamentals.",
                professional: "Inquiries are welcome without bias. Begin with networking fundamentals."
            },
            'tools-desc': {
                casual: "Don't worry about being perfect. Learn Nmap, Burp Suite, and Kali Linux.",
                professional: "Precision develops with practice. Master Nmap, Burp Suite, and Kali Linux."
            },
            'labs-desc': {
                casual: "Hands-on practice is super important. Try TryHackMe and HackTheBox.",
                professional: "Practical application is essential. Engage with TryHackMe and HackTheBox."
            },
            'challenges-desc': {
                casual: "Take it easy, everyone struggles sometimes. Work towards OSCP or CEH.",
                professional: "Progress steadily through challenges. Pursue OSCP or CEH certification."
            },
            'challenge-desc': {
                casual: "Don't stress if this seems hard at first. Try to find the hidden flag in this vulnerable login form!",
                professional: "Complexity is manageable with systematic approach. Locate the concealed flag in this vulnerable authentication form."
            },
            'community-desc': {
                casual: "Come hang out with other learners! Everyone's really welcoming and helpful.",
                professional: "Engage with fellow practitioners. The community maintains supportive and collaborative standards."
            }
        };
        
        this.init();
    }
    
    init() {
        // Load saved preference
        const savedPreference = localStorage.getItem('cyberSecLanguage');
        this.isProfessional = savedPreference === 'professional';
        
        // Set up toggle button
        this.setupToggleButton();
        
        // Apply initial language setting
        this.applyLanguage(false); // No animation on initial load
        
        console.log('Language Toggle initialized. Mode:', this.isProfessional ? 'Professional' : 'Casual');
    }
    
    setupToggleButton() {
        const toggleButton = document.getElementById('language-toggle');
        const slider = document.getElementById('toggle-slider');
        
        if (!toggleButton || !slider) {
            console.error('Language toggle elements not found');
            return;
        }
        
        // Set initial position
        if (this.isProfessional) {
            slider.classList.add('professional');
        }
        
        // Add click event listener
        toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggle();
        });
        
        // Add keyboard support
        toggleButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggle();
            }
        });
        
        // Add ARIA attributes
        toggleButton.setAttribute('role', 'switch');
        toggleButton.setAttribute('aria-checked', this.isProfessional);
        toggleButton.setAttribute('aria-label', 'Toggle between casual and professional language');
    }
    
    toggle() {
        if (this.isAnimating) return;
        
        this.isProfessional = !this.isProfessional;
        
        // Update slider position
        const slider = document.getElementById('toggle-slider');
        const toggleButton = document.getElementById('language-toggle');
        
        if (slider) {
            if (this.isProfessional) {
                slider.classList.add('professional');
            } else {
                slider.classList.remove('professional');
            }
        }
        
        // Update ARIA attribute
        if (toggleButton) {
            toggleButton.setAttribute('aria-checked', this.isProfessional);
        }
        
        // Apply language changes with animation
        this.applyLanguage(true);
        
        // Save preference
        localStorage.setItem('cyberSecLanguage', this.isProfessional ? 'professional' : 'casual');
        
        // Log the toggle action
        if (window.cyberSecLogger) {
            window.cyberSecLogger.logToggleLanguage(this.isProfessional ? 'professional' : 'casual');
        }
        
        console.log('Language toggled to:', this.isProfessional ? 'Professional' : 'Casual');
    }
    
    applyLanguage(animated = true) {
        this.isAnimating = animated;
        
        Object.keys(this.languagePairs).forEach((elementId, index) => {
            const element = document.getElementById(elementId);
            if (!element) {
                console.warn(`Element with ID '${elementId}' not found`);
                return;
            }
            
            const pair = this.languagePairs[elementId];
            const newText = this.isProfessional ? pair.professional : pair.casual;
            
            if (animated) {
                // Add delay for staggered animation effect
                setTimeout(() => {
                    this.animateTextChange(element, newText);
                }, index * 100);
            } else {
                element.textContent = newText;
            }
        });
        
        // Reset animation flag after all animations complete
        if (animated) {
            const totalAnimationTime = Object.keys(this.languagePairs).length * 100 + 500;
            setTimeout(() => {
                this.isAnimating = false;
            }, totalAnimationTime);
        }
    }
    
    animateTextChange(element, newText) {
        // Add animation classes
        element.classList.add('text-animate', 'text-fade-out');
        
        setTimeout(() => {
            element.textContent = newText;
            element.classList.remove('text-fade-out');
            element.classList.add('text-fade-in');
            
            setTimeout(() => {
                element.classList.remove('text-animate', 'text-fade-in');
            }, 300);
        }, 200);
    }
    
    /**
     * Add a new language pair
     * @param {string} elementId - The ID of the element to toggle
     * @param {string} casualText - The casual version of the text
     * @param {string} professionalText - The professional version of the text
     */
    addLanguagePair(elementId, casualText, professionalText) {
        this.languagePairs[elementId] = {
            casual: casualText,
            professional: professionalText
        };
        
        // Apply to existing element if it exists
        const element = document.getElementById(elementId);
        if (element) {
            const newText = this.isProfessional ? professionalText : casualText;
            element.textContent = newText;
        }
        
        console.log(`Added language pair for '${elementId}'`);
    }
    
    /**
     * Remove a language pair
     * @param {string} elementId - The ID of the element to remove
     */
    removeLanguagePair(elementId) {
        delete this.languagePairs[elementId];
        console.log(`Removed language pair for '${elementId}'`);
    }
    
    /**
     * Get current language mode
     * @returns {string} 'casual' or 'professional'
     */
    getCurrentLanguage() {
        return this.isProfessional ? 'professional' : 'casual';
    }
    
    /**
     * Set language mode programmatically
     * @param {string} mode - 'casual' or 'professional'
     * @param {boolean} animated - Whether to animate the change
     */
    setLanguage(mode, animated = true) {
        const newIsProfessional = mode === 'professional';
        
        if (newIsProfessional !== this.isProfessional) {
            this.isProfessional = newIsProfessional;
            
            // Update UI
            const slider = document.getElementById('toggle-slider');
            const toggleButton = document.getElementById('language-toggle');
            
            if (slider) {
                if (this.isProfessional) {
                    slider.classList.add('professional');
                } else {
                    slider.classList.remove('professional');
                }
            }
            
            if (toggleButton) {
                toggleButton.setAttribute('aria-checked', this.isProfessional);
            }
            
            // Apply language changes
            this.applyLanguage(animated);
            
            // Save preference
            localStorage.setItem('cyberSecLanguage', mode);
            
            console.log('Language set to:', mode);
        }
    }
    
    /**
     * Get all available language pairs
     * @returns {Object} All language pairs
     */
    getAllLanguagePairs() {
        return { ...this.languagePairs };
    }
}

// Initialize when DOM is ready
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        window.languageToggle = new LanguageToggle();
        
        // Make it available globally for admin dashboard
        window.LanguageToggle = LanguageToggle;
    });
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageToggle;
}