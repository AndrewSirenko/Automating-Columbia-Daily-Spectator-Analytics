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
                    viewId: '7024503',

                    dateRanges: [
                        {
                            startDate: '7daysAgo',
                            endDate: '1daysAgo',
                        },
                    ],

                    metrics: [
                        {
                            expression: 'ga:pageviews',
                        },
                        {
                            expression: 'ga:sessions',
                        },
                        {
                            expression: 'ga:newUsers',
                        },
                    ],
                    orderBys: [
                        {
                            fieldName: 'ga:pageviews',
                            sortOrder: 'DESCENDING',
                        },
                    ],
                    dimensions: [{ name: 'ga:pagePath' }],
                    dimensionFilterClauses: [
                        {
                            operator: 'AND',
                            filters: [
                                {
                                    dimensionName: 'ga:pagePath',
                                    not: true,
                                    operator: 'IN_LIST',
                                    expressions: [
                                        '/',
                                        '/news/',
                                        '/opinion/',
                                        '/eye/',
                                        '/sports/',
                                        '/spectrum/',
                                    ],
                                    caseSensitive: false,
                                },
                            ],
                        },
                    ],
                    pageSize: 10,
                },
            ],
        },
    });

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
        console.log(rows[i].dimensions[0], rows[i].metrics[0].values);
    }
}

output();
