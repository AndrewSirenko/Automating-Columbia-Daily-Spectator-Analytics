'use strict';

const dotenv = require('dotenv').config();
const { google } = require('googleapis');
const key = require('./auth.json');
const fs = require('fs');
const requestBodies = require('./requestBodies');
const formatter = require('./formatter');
const outputFunctions = require('./outputFunctions');

/* AUTH */

// Sets API scope: read only (to view reports)
const SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];
// Path to service account json
const SERVICE_ACCOUNT_FILE = '/Users/Andrew/Dev/spec/auth.json';

// Create a new JWT client using the key file downloaded from the Google Developer Console
const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: SCOPES,
});

/* Preparing batchGets */

// Requests data from Analytics API
async function generateWeeklyReport() {
    console.log('\nGenerating Weekly Report...\n');

    // Authorization
    console.log('Authorization: Generating OAuth 2.0 Token...\n');
    const client = await auth.getClient();

    // Obtains new analytics client, making sure we are authorized
    const analytics = google.analyticsreporting({
        version: 'v4',
        auth: client,
    });

    // GETs data
    console.log('Acquiring and Cleaning Analytics Data...\n');

    // GETs data from Google Analytics API
    const res = await analytics.reports.batchGet(requestBodies.defaultRequest);

    var cds = {};

    outputFunctions.defaultRequestOutput(res.data.reports[0], cds);

    console.log(cds);

    // TODO throw exception for non 2xx status code
    //https://developers.google.com/analytics/devguides/reporting/core/v3/coreDevguide#request
}

generateWeeklyReport();
