'use strict';

const { google } = require('googleapis');
const processData = require('./processData');

// GETs data from Analytics API and POSTs to Google Doc template
async function generateWeeklyReport() {
    console.log('\nGenerating Weekly Report...\n');
    processData.generateWeeklyReportData();
}

generateWeeklyReport();
