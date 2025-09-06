/**
 * Google Apps Script for CyberSec Academy Logging
 * 
 * Instructions:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Deploy as a web app with public access
 * 5. Copy the web app URL to logger.js
 */

/**
 * Handle POST requests from the CyberSec Academy website
 */
function doPost(e) {
  try {
    // Open the specific Google Sheet by ID
    const sheetId = '1QjLOF5JR3V6MtM1KWYMB_VHQ_jUGL2pSK-OJus8Z9sA';
    const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
    
    // Parse incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Log the data (useful for debugging)
    console.log('Received data:', data);
    
    // Append new row to the sheet
    sheet.appendRow([
      new Date(data.timestamp || new Date().toISOString()),
      data.user || 'Anonymous',
      data.email || '',
      data.action || 'unknown',
      data.extra || '',
      data.metadata || '',
      data.userAgent || '',
      data.url || '',
      data.sessionId || ''
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log error for debugging
    console.error('Error processing request:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false, 
        error: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (optional - for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      message: 'CyberSec Academy Logger is active',
      timestamp: new Date().toISOString(),
      parameters: e.parameters
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Initialize the Google Sheet with proper headers (run once)
 */
function initializeSheet() {
  try {
    const sheetId = '1QjLOF5JR3V6MtM1KWYMB_VHQ_jUGL2pSK-OJus8Z9sA';
    const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
    
    // Clear existing content (be careful!)
    // sheet.clear();
    
    // Set headers
    const headers = [
      'Timestamp',
      'User',
      'Email',
      'Action',
      'Extra Info',
      'Metadata',
      'User Agent',
      'URL',
      'Session ID'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('#ffffff');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
    
    console.log('Sheet initialized successfully');
    
  } catch (error) {
    console.error('Error initializing sheet:', error);
  }
}

/**
 * Get recent activity logs (optional - for admin dashboard)
 */
function getRecentLogs(limit = 50) {
  try {
    const sheetId = '1QjLOF5JR3V6MtM1KWYMB_VHQ_jUGL2pSK-OJus8Z9sA';
    const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
    
    const lastRow = sheet.getLastRow();
    const startRow = Math.max(2, lastRow - limit + 1); // Skip header row
    
    if (lastRow < 2) {
      return { success: true, data: [] };
    }
    
    const range = sheet.getRange(startRow, 1, lastRow - startRow + 1, 9);
    const values = range.getValues();
    
    const logs = values.map(row => ({
      timestamp: row[0],
      user: row[1],
      email: row[2],
      action: row[3],
      extra: row[4],
      metadata: row[5],
      userAgent: row[6],
      url: row[7],
      sessionId: row[8]
    }));
    
    return {
      success: true,
      data: logs.reverse(), // Most recent first
      count: logs.length
    };
    
  } catch (error) {
    console.error('Error getting logs:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Clean old logs (keep last N entries)
 */
function cleanOldLogs(keepLast = 1000) {
  try {
    const sheetId = '1QjLOF5JR3V6MtM1KWYMB_VHQ_jUGL2pSK-OJus8Z9sA';
    const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
    
    const lastRow = sheet.getLastRow();
    
    if (lastRow <= keepLast + 1) { // +1 for header
      console.log('No cleanup needed');
      return { success: true, message: 'No cleanup needed' };
    }
    
    const deleteRows = lastRow - keepLast - 1;
    sheet.deleteRows(2, deleteRows); // Start from row 2 (after header)
    
    console.log(`Cleaned ${deleteRows} old log entries`);
    
    return {
      success: true,
      message: `Cleaned ${deleteRows} old log entries`,
      remainingRows: keepLast
    };
    
  } catch (error) {
    console.error('Error cleaning logs:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}