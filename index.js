'use strict';

const dotenv = require('dotenv').config();
const { google } = require('googleapis');
const key = require('./auth.json');
const fs = require('fs');
const requestBodies = require('./requestBodies');
const formatter = require('./formatter');
const outputFunctions = require('./outputFunctions');
const auth = require('./auth.js');

/* Preparing batchGets */

// Requests data from Analytics API
async function generateWeeklyReport() {
    console.log('\nGenerating Weekly Report...\n');

    //Authorization from auth.js
    const analytics = await auth.authorize();

    // GETs data
    console.log('Acquiring and Cleaning Analytics Data...\n');

    // GETs data from Google Analytics API
    const report = await (
        await analytics.reports.batchGet(requestBodies.socialNetwork)
    ).data.reports[0];

    var cds = {};

    outputFunctions.socialNetworkOutput(report, cds);

    console.log(cds);

    // TODO throw exception for non 2xx status code
    //https://developers.google.com/analytics/devguides/reporting/core/v3/coreDevguide#request
}

generateWeeklyReport();
