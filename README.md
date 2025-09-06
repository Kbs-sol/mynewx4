# CyberSec Academy 🛡️

A comprehensive cybersecurity learning platform built with Hono and optimized for Cloudflare Pages. This interactive website teaches ethical hacking and cybersecurity principles with a strong emphasis on responsible use.

## 🚀 Live Demo

- **Production URL**: https://3000-i609xmsh94ticc7svkahh-6532622b.e2b.dev
- **GitHub Repository**: [To be deployed]

## ✨ Features

### 🎯 Core Features
- **📋 Responsibility Agreement**: Mandatory ethical use agreement before site access
- **🔄 Language Toggle**: Switch between Casual and Professional language modes
- **📚 Learning Roadmap**: Structured path from basics to advanced challenges
- **📖 Resource Library**: Curated links to platforms, tools, and certifications
- **🏆 Weekly Challenges**: Interactive cybersecurity challenges (SQL injection demo)
- **👥 Community Hub**: Discord integration for learner community
- **🔐 Admin Dashboard**: Password-protected admin panel with activity monitoring

### 🎨 Technical Features
- **📱 Responsive Design**: Mobile-first responsive layout
- **🎭 Cyberpunk Aesthetic**: Dark mode with Matrix-style animations
- **⚡ Real-time Logging**: All user actions logged to Google Sheets
- **🔒 Secure API**: Hono-based backend with CORS protection
- **🌐 Edge Deployment**: Optimized for Cloudflare Workers/Pages

## 🏗️ Architecture

### Data Models & Storage
- **Logging System**: All user interactions tracked with timestamps, actions, and metadata
- **User Preferences**: Language selection stored in localStorage
- **Admin Access**: Password-based authentication for dashboard access

### API Endpoints
- `POST /api/log` - Log user activities to Google Sheets
- `POST /api/admin/login` - Admin authentication (password: `kalki`)
- `GET /static/*` - Static file serving

### Frontend Features
- **Language Pairs**: 7+ text pairs that toggle between casual/professional tone
- **Smooth Animations**: CSS transitions and JavaScript-powered effects
- **Interactive Elements**: Challenge forms, admin dashboard, resource links
- **Progress Tracking**: SQL injection challenge with flag discovery

## 🚀 Quick Start (Non-Coders)

### 1. Prerequisites
- A computer with internet connection
- GitHub account (free)
- Cloudflare account (free)
- Google account (for Google Sheets logging)

### 2. Deploy to Cloudflare Pages

#### Step 2.1: Fork this Repository
1. Go to the GitHub repository
2. Click \"Fork\" button (top right)
3. Select your GitHub account

#### Step 2.2: Connect to Cloudflare Pages
1. Log into your Cloudflare Dashboard
2. Go to \"Pages\" in the sidebar
3. Click \"Connect to Git\"
4. Select your forked repository
5. Use these build settings:
   - **Framework preset**: None
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`

#### Step 2.3: Deploy
1. Click \"Save and Deploy\"
2. Wait 3-5 minutes for deployment
3. Your site will be live at `https://YOUR_PROJECT_NAME.pages.dev`

### 3. Set Up Google Sheets Logging

#### Step 3.1: Create Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Replace the default code with this:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById('1QjLOF5JR3V6MtM1KWYMB_VHQ_jUGL2pSK-OJus8Z9sA').getActiveSheet();
    
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date(data.timestamp),
      data.user || 'Anonymous',
      data.email || '',
      data.action || 'unknown',
      data.extra || '',
      data.userAgent || '',
      data.url || '',
      data.sessionId || ''
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

#### Step 3.2: Deploy Apps Script
1. Click \"Deploy\" > \"New deployment\"
2. Type: \"Web app\"
3. Execute as: \"Me\"
4. Who has access: \"Anyone\"
5. Click \"Deploy\"
6. Copy the Web app URL

#### Step 3.3: Update Logger Configuration
1. In your repository, edit `public/static/logger.js`
2. Find line with `this.scriptUrl =`
3. Replace `YOUR_SCRIPT_ID` with your Apps Script URL
4. Commit and push changes

#### Step 3.4: Prepare Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Open the sheet with ID `1QjLOF5JR3V6MtM1KWYMB_VHQ_jUGL2pSK-OJus8Z9sA`
3. If it doesn't exist, create a new sheet and use its ID
4. Add these headers in row 1: `Timestamp | User | Email | Action | Extra | UserAgent | URL | SessionId`

### 4. Change Admin Password

#### Option A: Environment Variable (Recommended)
1. In Cloudflare Pages dashboard
2. Go to Settings > Environment variables
3. Add: `ADMIN_PASSWORD` = `your_new_password`
4. Redeploy your site

#### Option B: Code Change
1. Edit `src/index.tsx`
2. Find line: `if (password === 'kalki')`  
3. Change `'kalki'` to your desired password
4. Commit and push changes

## 💻 Developer Setup

### Local Development
```bash
# Clone repository
git clone <your-repo-url>
cd cybersec-academy

# Install dependencies
npm install

# Build the project
npm run build

# Start development server
npm run dev:sandbox

# The site will be available at http://localhost:3000
```

### Project Structure
```
cybersec-academy/
├── src/
│   └── index.tsx           # Main Hono application
├── public/static/
│   ├── app.js             # Main application logic
│   ├── language-toggle.js # Language switching system
│   ├── logger.js          # Google Sheets integration
│   └── styles.css         # Custom cyberpunk styling
├── ecosystem.config.cjs   # PM2 configuration
├── wrangler.jsonc         # Cloudflare configuration
└── package.json          # Dependencies and scripts
```

### Available Scripts
```bash
npm run dev              # Local Vite development
npm run dev:sandbox      # Wrangler Pages development
npm run build           # Build for production
npm run deploy          # Deploy to Cloudflare Pages
npm run test            # Test local server
npm run clean-port      # Kill processes on port 3000
```

## 🔧 Customization

### Adding New Language Pairs
Edit `public/static/language-toggle.js`:
```javascript
// Add new language pair
window.languageToggle.addLanguagePair(
    'element-id',
    'casual text',
    'professional text'
);
```

### Adding New Resource Links
Edit `public/static/app.js` in the `resourceUrls` object:
```javascript
const resourceUrls = {
    'new-resource': 'https://example.com',
    // ... existing resources
};
```

### Modifying Challenge
The SQL injection challenge is in `handleChallenge()` function in `app.js`. Modify the patterns or add new challenges.

### Styling Changes
- Main styling: `public/static/styles.css`
- Colors and animations can be customized
- Uses Tailwind CSS for utility classes

## 📊 Analytics & Monitoring

### Admin Dashboard Access
1. Click the shield icon (🛡️) in navigation
2. Enter password: `kalki` (or your custom password)
3. View activity logs and manage sections

### Google Sheets Data
All user interactions are logged with:
- Timestamp
- User identity (Anonymous or logged-in name)
- Action type (page_load, button_click, etc.)
- Additional context and metadata
- Browser and session information

## 🚀 Deployment Status
- **Platform**: Cloudflare Pages
- **Status**: ✅ Active 
- **Tech Stack**: Hono + TypeScript + TailwindCSS + Vanilla JavaScript
- **Last Updated**: September 6, 2025

## 🔒 Security Features
- **Ethical Agreement**: Mandatory before site access
- **Input Validation**: All forms sanitized
- **CORS Protection**: API endpoints secured
- **Admin Authentication**: Password-protected dashboard
- **Activity Monitoring**: All actions logged for security review

## 🎯 Learning Path

### 1. Basics (📚)
- Networking fundamentals
- Linux command line
- Web technologies

### 2. Tools (🛠️)
- Kali Linux setup
- Nmap network scanning
- Burp Suite web testing
- Metasploit framework

### 3. Practice Labs (🧪)
- TryHackMe challenges
- HackTheBox machines
- OverTheWire wargames

### 4. Certifications (🏆)
- OSCP (Offensive Security)
- CEH (Ethical Hacker)
- CISSP (Information Security)
- Security+ (CompTIA)

## 🛠️ Troubleshooting

### Common Issues

**Q: Google Sheets logging not working**
A: Check Apps Script deployment URL and sheet permissions

**Q: Admin login failing**
A: Verify password and check browser console for errors

**Q: Language toggle not working**
A: Check JavaScript console and ensure all files loaded

**Q: Responsive design issues**
A: Clear browser cache and check CSS loading

### Support
- Check browser console for JavaScript errors
- Verify all static files are loading correctly
- Test API endpoints with browser network tab
- Review PM2 logs for server issues

## 📝 License

This project is created for educational purposes. Please use responsibly and ethically.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**⚠️ Important**: This platform is designed for educational purposes only. All knowledge gained must be used ethically and legally. Unauthorized hacking is illegal and unethical.