'use strict';

const dotenv = require('dotenv').config();
const { google } = require('googleapis');
const key = require('./auth.json');
const fs = require('fs');
const requestBodies = require('./requestBodies');
const formatter = require('./formatter');
const outputFunctions = require('./outputFunctions');
const auth = require('./auth.js');
const { requestBodiesCDS } = require('./requestBodies');

// Requests data from Analytics API
async function generateWeeklyReport() {
    console.log('\nGenerating Weekly Report...\n');

    //Authorization from auth.js
    const analytics = await auth.authorize();

    // GETs data
    console.log('Acquiring and Cleaning Analytics Data...\n');

    var cds = {};

    // GETs data from Google Analytics API
    for (let i = 0; i < requestBodiesCDS.length; i++) {
        let request = requestBodiesCDS[i];

        let res = await analytics.reports.batchGet(request);
        let report = res.data.reports[0];

        request.outputFunction(report, cds);
    }

    console.log(cds);

    // TODO throw exception for non 2xx status code
    //https://developers.google.com/analytics/devguides/reporting/core/v3/coreDevguide#request
}

generateWeeklyReport();
