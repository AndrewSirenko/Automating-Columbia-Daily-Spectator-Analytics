'use strict';

const { google } = require('googleapis');
const processData = require('./processData');

// GETs data from Analytics API and POSTs to Google Doc template
async function generateWeeklyReport() {
    console.log('\nGenerating Weekly Report...\n');
    // Generates, processes, cleans, and compiles CDS weekly report data
    processData.generateWeeklyReportData();
}

generateWeeklyReport();
