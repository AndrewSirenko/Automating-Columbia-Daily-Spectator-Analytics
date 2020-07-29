'use strict';

const dotenv = require('dotenv').config();
const { google } = require('googleapis');
const key = require('./auth.json');
const fs = require('fs');
const requestBodies = require('./requestBodies');
const formatter = require('./formatter');

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

    const res = await analytics.reports.batchGet(requestBodies.defaultRequest);

    return res.data.reports[0];

    // TODO throw exception for non 2xx status code
    //https://developers.google.com/analytics/devguides/reporting/core/v3/coreDevguide#request
}

// performs batchGet request on {requestBody} cleaning and outputting data as
//   decided in {outputFunction}
// {requestBody} found in requestBodies.js
// {outputFunction} found in outputFunctions.js
async function batchProcess(requestBody, outputFunction) {
    const res = await analytics.reports.batchGet(requestBody);

    cds = {};

    outputFunction(res.data.reports[0], cds);
    console.log(cds);
}

// Cleans and outputs Data
async function output() {
    // Destructures batchGet report
    let {
        columnHeader: {
            dimensions,
            metricHeader: { metricHeaderEntries },
        },
        data,
    } = await generateWeeklyReport();

    // Puts metric headers into an array
    var headers = [];
    for (var i = 0, header; (header = metricHeaderEntries[i]); i++) {
        headers.push(header.name);
    }

    // Puts result rows into an array
    var rows = [];
    for (var i = 0, row; (row = data.rows[i]); i++) {
        rows.push(row);
    }

    console.log('Dimensions: ' + dimensions);
    console.log('Metrics: ' + headers);
    console.log();

    var cds = {};

    for (i = 0; i < rows.length; i++) {
        // Dimension Label (Ex: Facebook)
        //let dimensionItem = rows[i].dimensions[0];

        // Values from current time frame (Ex: This week)
        let currValues = rows[i].metrics[0].values;

        // Values from last time frame (Ex: last week)
        let pastValues = rows[i].metrics[1].values;

        for (i = 0; i < headers.length; i++) {
            let header = headers[i];
            let currVal = currValues[i];
            let pastVal = pastValues[i];

            let format = formatter.dataToText(currVal, pastVal);
            //console.log(dimensionItem, currValues, pastValues);
            cds[header] = format;
            console.log(headers[i] + format);
        }
    }
    console.log(cds);
}

output();
