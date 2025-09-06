/**
 * Google Sheets Logger
 * Logs user activities to Google Sheets via Google Apps Script
 */

class CyberSecLogger {
    constructor() {
        // Google Apps Script Web App URL - TO BE CONFIGURED
        this.scriptUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
        this.sheetId = '1QjLOF5JR3V6MtM1KWYMB_VHQ_jUGL2pSK-OJus8Z9sA';
        this.fallbackLogs = []; // Store logs locally if Google Sheets is unavailable
        this.currentUser = this.getCurrentUser();
        
        // Initialize logger
        this.init();
    }
    
    init() {
        console.log('CyberSec Logger initialized');
        console.log('Sheet ID:', this.sheetId);
        console.log('Current user:', this.currentUser);
        
        // Log page load
        this.log('page_load', 'User visited the site');
        
        // Set up periodic sync for offline logs
        setInterval(() => this.syncOfflineLogs(), 30000); // Every 30 seconds
    }
    
    getCurrentUser() {
        // Check if user is logged in (will be implemented with auth)
        const userData = localStorage.getItem('cyberSecUser');
        if (userData) {
            try {
                return JSON.parse(userData);
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
        return { name: 'Anonymous', email: null };
    }
    
    /**
     * Main logging function
     * @param {string} action - The action performed
     * @param {string} extra - Additional information
     * @param {Object} metadata - Optional metadata
     */
    async log(action, extra = '', metadata = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            user: this.currentUser.name || 'Anonymous',
            email: this.currentUser.email || '',
            action: action,
            extra: extra,
            metadata: JSON.stringify(metadata),
            userAgent: navigator.userAgent,
            url: window.location.href,
            sessionId: this.getSessionId()
        };
        
        console.log('Logging:', logEntry);
        
        try {
            // Try to send to our API first (which will handle Google Sheets)
            await this.sendToAPI(logEntry);
        } catch (error) {
            console.error('Failed to send to API:', error);
            
            // Try direct Google Apps Script as fallback
            try {
                await this.sendToGoogleSheets(logEntry);
            } catch (gsError) {
                console.error('Failed to send to Google Sheets:', gsError);
                
                // Store locally for later sync
                this.storeOffline(logEntry);
            }
        }
    }
    
    /**
     * Send log entry to our Hono API
     */
    async sendToAPI(logEntry) {
        const response = await fetch('/api/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: logEntry.action,
                user: logEntry.user,
                extra: `${logEntry.extra} | ${logEntry.metadata}`,
                timestamp: logEntry.timestamp,
                userAgent: logEntry.userAgent,
                url: logEntry.url
            })
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        return response.json();
    }
    
    /**
     * Send log entry directly to Google Apps Script
     */
    async sendToGoogleSheets(logEntry) {
        // This will be used when Google Apps Script is configured
        const response = await fetch(this.scriptUrl, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(logEntry)
        });
        
        // Note: Due to no-cors mode, we can't check response status
        console.log('Sent to Google Sheets (no response available due to CORS)');
    }
    
    /**
     * Store log entry offline for later sync
     */
    storeOffline(logEntry) {
        this.fallbackLogs.push(logEntry);
        
        // Store in localStorage for persistence
        try {
            const existingLogs = JSON.parse(localStorage.getItem('cyberSecOfflineLogs') || '[]');
            existingLogs.push(logEntry);
            
            // Keep only last 100 logs to avoid storage issues
            const recentLogs = existingLogs.slice(-100);
            localStorage.setItem('cyberSecOfflineLogs', JSON.stringify(recentLogs));
        } catch (e) {
            console.error('Failed to store offline log:', e);
        }
        
        console.log('Stored log offline:', logEntry);
    }
    
    /**
     * Sync offline logs when connection is restored
     */
    async syncOfflineLogs() {
        const offlineLogs = JSON.parse(localStorage.getItem('cyberSecOfflineLogs') || '[]');
        
        if (offlineLogs.length === 0) return;
        
        console.log(`Syncing ${offlineLogs.length} offline logs...`);
        
        const syncedLogs = [];
        
        for (const logEntry of offlineLogs) {
            try {
                await this.sendToAPI(logEntry);
                syncedLogs.push(logEntry);
            } catch (error) {
                console.error('Failed to sync log:', error);
                break; // Stop syncing if we hit an error
            }
        }
        
        if (syncedLogs.length > 0) {
            // Remove synced logs from offline storage
            const remainingLogs = offlineLogs.filter(log => 
                !syncedLogs.some(synced => 
                    synced.timestamp === log.timestamp && synced.action === log.action
                )
            );
            
            localStorage.setItem('cyberSecOfflineLogs', JSON.stringify(remainingLogs));
            console.log(`Synced ${syncedLogs.length} offline logs`);
        }
    }
    
    /**
     * Get or create session ID
     */
    getSessionId() {
        let sessionId = sessionStorage.getItem('cyberSecSession');
        if (!sessionId) {
            sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('cyberSecSession', sessionId);
        }
        return sessionId;
    }
    
    /**
     * Convenience methods for common actions
     */
    
    logAcceptance() {
        this.log('responsibility_accepted', 'User accepted responsibility agreement');
    }
    
    logDecline() {
        this.log('responsibility_declined', 'User declined responsibility agreement');
    }
    
    logToggleLanguage(language) {
        this.log('language_toggle', `Switched to ${language} language`);
    }
    
    logResourceClick(resource) {
        this.log('resource_click', `Clicked on ${resource}`, { resource });
    }
    
    logChallengeAttempt(challenge, result) {
        this.log('challenge_attempt', `Attempted ${challenge}: ${result}`, { challenge, result });
    }
    
    logAdminLogin(success) {
        this.log('admin_login', success ? 'Admin login successful' : 'Admin login failed');
    }
    
    logSectionView(section) {
        this.log('section_view', `Viewed ${section} section`, { section });
    }
    
    logButtonClick(buttonName) {
        this.log('button_click', `Clicked ${buttonName}`, { button: buttonName });
    }
    
    logFormSubmit(formName, data = {}) {
        this.log('form_submit', `Submitted ${formName}`, { form: formName, ...data });
    }
    
    logError(error, context = '') {
        this.log('error', `Error: ${error.message || error}`, { 
            error: error.toString(), 
            context,
            stack: error.stack 
        });
    }
    
    /**
     * Get recent activity logs for admin dashboard
     */
    getRecentLogs(limit = 50) {
        const logs = JSON.parse(localStorage.getItem('cyberSecOfflineLogs') || '[]');
        return logs.slice(-limit).reverse(); // Most recent first
    }
}

// Initialize logger when DOM is ready
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        window.cyberSecLogger = new CyberSecLogger();
    });
    
    // Also handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (window.cyberSecLogger) {
            if (document.hidden) {
                window.cyberSecLogger.log('page_hidden', 'User switched away from tab');
            } else {
                window.cyberSecLogger.log('page_visible', 'User returned to tab');
            }
        }
    });
    
    // Handle page unload
    window.addEventListener('beforeunload', () => {
        if (window.cyberSecLogger) {
            window.cyberSecLogger.log('page_unload', 'User leaving site');
        }
    });
    
    // Handle errors
    window.addEventListener('error', (event) => {
        if (window.cyberSecLogger) {
            window.cyberSecLogger.logError(event.error, 'Global error handler');
        }
    });
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CyberSecLogger;
}