'use strict';

const dotenv = require('dotenv').config();
const { google } = require('googleapis');
const key = require('./auth.json');
const fs = require('fs');

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

//JSONs to pass into batchGet
const raw = fs.readFileSync('top10Articles.json');
const defaultChannelGroupingCDS = JSON.parse(raw);

// Reads and parses array of json files to be reported on
function parseJSONS(raw) {
    var res = [];

    for (const json in raw) {
        res.push(JSON.parse(fs.readFileSync(json)));
    }

    return res;
}

// Requests data from Analytics API
async function getData() {
    // Authorization
    const client = await auth.getClient();

    // Obtains new analytics client, making sure we are authorized
    const analytics = google.analyticsreporting({
        version: 'v4',
        auth: client,
    });

    // GETs data
    const res = await analytics.reports.batchGet(defaultChannelGroupingCDS);

    return res.data.reports[0];

    // TODO throw exception for non 2xx status code
    //https://developers.google.com/analytics/devguides/reporting/core/v3/coreDevguide#request
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
    } = await getData();

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

    console.log();
    console.log('Dimensions: ' + dimensions);
    console.log('Metrics: ' + headers);

    for (i = 0; i < rows.length; i++) {
        console.log(rows[i].dimensions, rows[i].metrics);
    }
}

output();
