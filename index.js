'use strict';

const { google } = require('googleapis');
const processData = require('./processData');
const googleDocs = require('./googleDocs');

// GETs data from Analytics API and POSTs to Google Doc template
async function generateWeeklyReport() {
    const filename = processData.generateFilename();

    console.log(`\nGenerating ${filename}...\n`);
    // Generates, processes, cleans, and compiles CDS weekly report data
    const data = await processData.generateWeeklyReportData();

    // Creates weekly report in 'Weekly Reports' folder
    googleDocs.generateWeeklyReportDoc(filename, data);
}

generateWeeklyReport();
