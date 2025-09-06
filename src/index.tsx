import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Enable CORS for frontend-backend communication
app.use('/api/*', cors())

// Serve static files from public directory
app.use('/static/*', serveStatic({ root: './public' }))

// API route to log actions to Google Sheets
app.post('/api/log', async (c) => {
  try {
    const body = await c.req.json()
    const { action, user, extra } = body
    
    // Prepare data for Google Sheets
    const logData = {
      timestamp: new Date().toISOString(),
      user: user || 'Anonymous',
      action: action || 'Unknown',
      extra: extra || ''
    }
    
    // In a real implementation, this would send to Google Sheets
    // For now, we'll return success
    console.log('Log entry:', logData)
    
    return c.json({ success: true, data: logData })
  } catch (error) {
    return c.json({ success: false, error: 'Logging failed' }, 500)
  }
})

// API route for admin authentication
app.post('/api/admin/login', async (c) => {
  try {
    const { password } = await c.req.json()
    
    if (password === 'kalki') {
      return c.json({ success: true, message: 'Admin authenticated' })
    } else {
      return c.json({ success: false, message: 'Invalid password' }, 401)
    }
  } catch (error) {
    return c.json({ success: false, error: 'Authentication failed' }, 500)
  }
})

// Main route - serves the cybersecurity learning website
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CyberSec Academy - Learn Ethical Hacking Responsibly</title>
        
        <!-- External Libraries -->
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        
        <!-- Custom Styles -->
        <link href="/static/styles.css" rel="stylesheet">
        
        <!-- Favicon -->
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛡️</text></svg>">
    </head>
    <body class="bg-gray-900 text-green-400 font-mono overflow-x-hidden">
        <!-- Loading Screen -->
        <div id="loading-screen" class="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <div class="text-center">
                <div class="animate-spin text-6xl mb-4">⚡</div>
                <div class="text-green-400 text-xl">Initializing Security Protocols...</div>
            </div>
        </div>
        
        <!-- Responsibility Modal -->
        <div id="responsibility-modal" class="fixed inset-0 bg-black bg-opacity-95 z-40 flex items-center justify-center hidden">
            <div class="bg-gray-800 border-2 border-red-500 rounded-lg max-w-2xl mx-4 p-8 shadow-2xl">
                <div class="text-center mb-6">
                    <i class="fas fa-exclamation-triangle text-red-500 text-6xl mb-4"></i>
                    <h2 class="text-3xl font-bold text-red-400 mb-2">⚠️ RESPONSIBILITY AGREEMENT ⚠️</h2>
                </div>
                
                <div class="text-gray-300 mb-6 space-y-4">
                    <p class="text-lg font-semibold text-yellow-400">Before accessing CyberSec Academy, you must understand:</p>
                    
                    <ul class="list-disc list-inside space-y-2 text-sm">
                        <li><strong class="text-red-400">Ethical Use Only:</strong> All knowledge gained here must be used for defensive purposes, authorized penetration testing, or educational research only.</li>
                        <li><strong class="text-red-400">Legal Compliance:</strong> You will not use any techniques learned here to attack systems without explicit written permission.</li>
                        <li><strong class="text-red-400">Responsible Disclosure:</strong> Any vulnerabilities discovered must be reported through proper channels.</li>
                        <li><strong class="text-red-400">No Harm:</strong> You will not use this knowledge to cause damage, steal data, or harm individuals or organizations.</li>
                        <li><strong class="text-red-400">Education First:</strong> The primary goal is learning cybersecurity to build better defenses.</li>
                    </ul>
                    
                    <div class="bg-red-900 border border-red-500 rounded p-4 mt-4">
                        <p class="text-red-200 font-bold">⚠️ WARNING: Misuse of cybersecurity knowledge is illegal and unethical. Violations can result in criminal charges, civil liability, and permanent damage to your career and reputation.</p>
                    </div>
                </div>
                
                <div class="flex justify-center space-x-4">
                    <button id="decline-btn" class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors">
                        <i class="fas fa-times mr-2"></i>I Do Not Accept
                    </button>
                    <button id="accept-btn" class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-colors">
                        <i class="fas fa-check mr-2"></i>I Accept & Will Use Responsibly
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Main Navigation -->
        <nav class="bg-black border-b-2 border-green-500 p-4">
            <div class="container mx-auto flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="text-2xl font-bold text-green-400">
                        <i class="fas fa-shield-alt mr-2"></i>
                        CyberSec Academy
                    </div>
                </div>
                
                <div class="flex items-center space-x-6">
                    <!-- Language Toggle -->
                    <div class="flex items-center space-x-3">
                        <span class="text-sm text-gray-400">Language:</span>
                        <div class="relative">
                            <button id="language-toggle" class="bg-gray-700 border-2 border-green-500 rounded-full w-16 h-8 flex items-center transition-all duration-300">
                                <div id="toggle-slider" class="w-6 h-6 bg-green-400 rounded-full shadow-lg transform transition-transform duration-300 translate-x-1"></div>
                            </button>
                            <div class="flex justify-between text-xs mt-1 text-gray-500">
                                <span>Casual</span>
                                <span>Pro</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Admin Button -->
                    <button id="admin-btn" class="text-gray-500 hover:text-green-400 transition-colors">
                        <i class="fas fa-user-shield"></i>
                    </button>
                    
                    <!-- Auth Buttons -->
                    <div id="auth-section">
                        <button id="login-btn" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">
                            <i class="fab fa-google mr-2"></i>Sign In
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        
        <!-- Main Content -->
        <main class="container mx-auto px-4 py-8">
            <!-- Hero Section -->
            <section class="text-center mb-12">
                <h1 class="text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                    Welcome to CyberSec Academy
                </h1>
                <p id="hero-subtitle" class="text-xl text-gray-300 mb-8">
                    Don't feel bad if you make mistakes. Learning hacking is fun and cool!
                </p>
                <div class="flex justify-center space-x-4">
                    <button class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition-colors transform hover:scale-105">
                        <i class="fas fa-play mr-2"></i>Start Learning
                    </button>
                    <button class="border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-black px-8 py-3 rounded-lg font-bold transition-colors">
                        <i class="fas fa-book mr-2"></i>View Resources
                    </button>
                </div>
            </section>
            
            <!-- Getting Started Roadmap -->
            <section id="roadmap-section" class="mb-12">
                <h2 class="text-4xl font-bold mb-8 text-center">
                    <i class="fas fa-route mr-3"></i>Learning Roadmap
                </h2>
                <div class="grid md:grid-cols-4 gap-6">
                    <div class="roadmap-card bg-gray-800 border-2 border-gray-600 rounded-lg p-6 text-center hover:border-green-500 transition-all duration-300 transform hover:scale-105">
                        <div class="text-4xl mb-4">📚</div>
                        <h3 class="text-xl font-bold mb-2 text-green-400">1. Basics</h3>
                        <p id="basics-desc" class="text-gray-300">Ask anything, no judgement. Start with networking fundamentals.</p>
                    </div>
                    <div class="roadmap-card bg-gray-800 border-2 border-gray-600 rounded-lg p-6 text-center hover:border-green-500 transition-all duration-300 transform hover:scale-105">
                        <div class="text-4xl mb-4">🛠️</div>
                        <h3 class="text-xl font-bold mb-2 text-green-400">2. Tools</h3>
                        <p id="tools-desc" class="text-gray-300">Don't worry about being perfect. Learn Nmap, Burp Suite, and Kali Linux.</p>
                    </div>
                    <div class="roadmap-card bg-gray-800 border-2 border-gray-600 rounded-lg p-6 text-center hover:border-green-500 transition-all duration-300 transform hover:scale-105">
                        <div class="text-4xl mb-4">🧪</div>
                        <h3 class="text-xl font-bold mb-2 text-green-400">3. Labs</h3>
                        <p id="labs-desc" class="text-gray-300">Hands-on practice is super important. Try TryHackMe and HackTheBox.</p>
                    </div>
                    <div class="roadmap-card bg-gray-800 border-2 border-gray-600 rounded-lg p-6 text-center hover:border-green-500 transition-all duration-300 transform hover:scale-105">
                        <div class="text-4xl mb-4">🏆</div>
                        <h3 class="text-xl font-bold mb-2 text-green-400">4. Challenges</h3>
                        <p id="challenges-desc" class="text-gray-300">Take it easy, everyone struggles sometimes. Work towards OSCP or CEH.</p>
                    </div>
                </div>
            </section>
            
            <!-- Resource Library -->
            <section id="resources-section" class="mb-12">
                <h2 class="text-4xl font-bold mb-8 text-center">
                    <i class="fas fa-library mr-3"></i>Resource Library
                </h2>
                <div class="grid md:grid-cols-3 gap-6">
                    <!-- Practice Platforms -->
                    <div class="bg-gray-800 border-2 border-gray-600 rounded-lg p-6 hover:border-blue-500 transition-all duration-300">
                        <h3 class="text-xl font-bold mb-4 text-blue-400">
                            <i class="fas fa-gamepad mr-2"></i>Practice Platforms
                        </h3>
                        <div class="space-y-3">
                            <a href="#" class="resource-link block text-gray-300 hover:text-green-400 transition-colors" data-resource="tryhackme">
                                <i class="fas fa-external-link-alt mr-2"></i>TryHackMe
                            </a>
                            <a href="#" class="resource-link block text-gray-300 hover:text-green-400 transition-colors" data-resource="hackthebox">
                                <i class="fas fa-external-link-alt mr-2"></i>HackTheBox
                            </a>
                            <a href="#" class="resource-link block text-gray-300 hover:text-green-400 transition-colors" data-resource="overthewire">
                                <i class="fas fa-external-link-alt mr-2"></i>OverTheWire
                            </a>
                        </div>
                    </div>
                    
                    <!-- Tools & Software -->
                    <div class="bg-gray-800 border-2 border-gray-600 rounded-lg p-6 hover:border-red-500 transition-all duration-300">
                        <h3 class="text-xl font-bold mb-4 text-red-400">
                            <i class="fas fa-tools mr-2"></i>Essential Tools
                        </h3>
                        <div class="space-y-3">
                            <a href="#" class="resource-link block text-gray-300 hover:text-green-400 transition-colors" data-resource="kali">
                                <i class="fas fa-external-link-alt mr-2"></i>Kali Linux
                            </a>
                            <a href="#" class="resource-link block text-gray-300 hover:text-green-400 transition-colors" data-resource="burpsuite">
                                <i class="fas fa-external-link-alt mr-2"></i>Burp Suite
                            </a>
                            <a href="#" class="resource-link block text-gray-300 hover:text-green-400 transition-colors" data-resource="nmap">
                                <i class="fas fa-external-link-alt mr-2"></i>Nmap
                            </a>
                            <a href="#" class="resource-link block text-gray-300 hover:text-green-400 transition-colors" data-resource="metasploit">
                                <i class="fas fa-external-link-alt mr-2"></i>Metasploit
                            </a>
                        </div>
                    </div>
                    
                    <!-- Certifications -->
                    <div class="bg-gray-800 border-2 border-gray-600 rounded-lg p-6 hover:border-yellow-500 transition-all duration-300">
                        <h3 class="text-xl font-bold mb-4 text-yellow-400">
                            <i class="fas fa-certificate mr-2"></i>Certifications
                        </h3>
                        <div class="space-y-3">
                            <a href="#" class="resource-link block text-gray-300 hover:text-green-400 transition-colors" data-resource="oscp">
                                <i class="fas fa-external-link-alt mr-2"></i>OSCP
                            </a>
                            <a href="#" class="resource-link block text-gray-300 hover:text-green-400 transition-colors" data-resource="ceh">
                                <i class="fas fa-external-link-alt mr-2"></i>CEH
                            </a>
                            <a href="#" class="resource-link block text-gray-300 hover:text-green-400 transition-colors" data-resource="cissp">
                                <i class="fas fa-external-link-alt mr-2"></i>CISSP
                            </a>
                            <a href="#" class="resource-link block text-gray-300 hover:text-green-400 transition-colors" data-resource="security+">
                                <i class="fas fa-external-link-alt mr-2"></i>Security+
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Weekly Challenge -->
            <section id="challenge-section" class="mb-12">
                <h2 class="text-4xl font-bold mb-8 text-center">
                    <i class="fas fa-flag mr-3"></i>Weekly Challenge
                </h2>
                <div class="bg-gray-800 border-2 border-purple-500 rounded-lg p-8">
                    <div class="text-center mb-6">
                        <h3 class="text-2xl font-bold text-purple-400 mb-2">SQL Injection Basics</h3>
                        <p id="challenge-desc" class="text-gray-300">Don't stress if this seems hard at first. Try to find the hidden flag in this vulnerable login form!</p>
                    </div>
                    
                    <div class="max-w-md mx-auto bg-gray-900 p-6 rounded-lg">
                        <form id="challenge-form" class="space-y-4">
                            <div>
                                <label class="block text-sm font-bold mb-2 text-gray-300">Username:</label>
                                <input type="text" id="username" class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" placeholder="Enter username">
                            </div>
                            <div>
                                <label class="block text-sm font-bold mb-2 text-gray-300">Password:</label>
                                <input type="password" id="password" class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" placeholder="Enter password">
                            </div>
                            <button type="submit" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors">
                                Login
                            </button>
                        </form>
                        <div id="challenge-result" class="mt-4 text-center text-gray-400"></div>
                    </div>
                </div>
            </section>
            
            <!-- Community Hub -->
            <section id="community-section" class="mb-12">
                <h2 class="text-4xl font-bold mb-8 text-center">
                    <i class="fas fa-users mr-3"></i>Community Hub
                </h2>
                <div class="bg-gray-800 border-2 border-blue-500 rounded-lg p-8">
                    <div class="text-center mb-6">
                        <h3 class="text-2xl font-bold text-blue-400 mb-2">Join Our Discord Community</h3>
                        <p id="community-desc" class="text-gray-300 mb-4">Come hang out with other learners! Everyone's really welcoming and helpful.</p>
                    </div>
                    
                    <!-- Discord Widget Placeholder -->
                    <div class="bg-gray-900 rounded-lg p-6 text-center">
                        <div class="mb-4">
                            <i class="fab fa-discord text-6xl text-blue-400"></i>
                        </div>
                        <h4 class="text-xl font-bold text-blue-400 mb-2">CyberSec Learners</h4>
                        <p class="text-gray-400 mb-4">500+ members online</p>
                        <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-colors">
                            <i class="fab fa-discord mr-2"></i>Join Server
                        </button>
                    </div>
                </div>
            </section>
        </main>
        
        <!-- Admin Modal -->
        <div id="admin-modal" class="fixed inset-0 bg-black bg-opacity-80 z-40 flex items-center justify-center hidden">
            <div class="bg-gray-800 border-2 border-green-500 rounded-lg max-w-md w-full mx-4 p-6">
                <h3 class="text-2xl font-bold text-green-400 mb-4 text-center">
                    <i class="fas fa-user-shield mr-2"></i>Admin Access
                </h3>
                <form id="admin-form">
                    <div class="mb-4">
                        <label class="block text-gray-300 text-sm font-bold mb-2">Password:</label>
                        <input type="password" id="admin-password" class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" placeholder="Enter admin password">
                    </div>
                    <div class="flex justify-end space-x-4">
                        <button type="button" id="admin-cancel" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors">
                            Cancel
                        </button>
                        <button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
        <!-- Admin Dashboard -->
        <div id="admin-dashboard" class="fixed inset-0 bg-black bg-opacity-95 z-40 overflow-y-auto hidden">
            <div class="container mx-auto p-8">
                <div class="bg-gray-800 border-2 border-green-500 rounded-lg p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-3xl font-bold text-green-400">
                            <i class="fas fa-tachometer-alt mr-3"></i>Admin Dashboard
                        </h2>
                        <button id="admin-close" class="text-red-400 hover:text-red-300 text-2xl">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-6">
                        <!-- Activity Logs -->
                        <div class="bg-gray-900 rounded-lg p-4">
                            <h3 class="text-xl font-bold text-blue-400 mb-4">
                                <i class="fas fa-list mr-2"></i>Recent Activity
                            </h3>
                            <div id="activity-logs" class="space-y-2 max-h-64 overflow-y-auto">
                                <!-- Logs will be populated by JavaScript -->
                            </div>
                        </div>
                        
                        <!-- Section Visibility -->
                        <div class="bg-gray-900 rounded-lg p-4">
                            <h3 class="text-xl font-bold text-yellow-400 mb-4">
                                <i class="fas fa-eye mr-2"></i>Section Visibility
                            </h3>
                            <div class="space-y-3">
                                <label class="flex items-center">
                                    <input type="checkbox" class="mr-2" checked>
                                    <span class="text-gray-300">Roadmap Section</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" class="mr-2" checked>
                                    <span class="text-gray-300">Resources Section</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" class="mr-2" checked>
                                    <span class="text-gray-300">Challenge Section</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" class="mr-2" checked>
                                    <span class="text-gray-300">Community Section</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Scripts -->
        <script src="/static/logger.js"></script>
        <script src="/static/language-toggle.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

export default app
