'use strict';

const dotenv = require('dotenv').config();
const { google } = require('googleapis');
const key = require('./auth.json');

// Sets API scope: read only (to view reports)
const SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];
// Path to service account json
const SERVICE_ACCOUNT_FILE = '/Users/Andrew/Dev/spec/auth.json';

// Create a new JWT client using the key file downloaded from the Google Developer Console
const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: SCOPES,
});

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
    const res = await analytics.reports.batchGet({
        requestBody: {
            reportRequests: [
                {
                    // Found in Analytics>Settings>ADMIN>View_Settings>View_ID
                    viewId: process.env.VIEW_ID,
                    // What time-frames are we analyzing (up to 2)
                    dateRanges: [
                        {
                            startDate: '7daysAgo',
                            endDate: '1daysAgo',
                        },
                        {
                            startDate: '14daysAgo',
                            endDate: '8daysAgo',
                        },
                    ],
                    // What metrics do we want
                    metrics: [
                        {
                            expression: 'ga:users',
                        },
                    ],
                },
            ],
        },
    });

    // Raw Output for testing
    // console.dir(res);

    // console.dir(res.data);
    // console.dir(res.data.reports);
    return res.data.reports[0];

    // TODO throw exception for non 2xx status code
    //https://developers.google.com/analytics/devguides/reporting/core/v3/coreDevguide#request
}

async function output() {
    let report = await getData();
    console.dir(report.columnHeader.metricHeader.metricHeaderEntries);
    console.dir(report.data.rows[0].metrics);
}

output();
