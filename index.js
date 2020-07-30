'use strict';

const dotenv = require('dotenv').config();
const { google } = require('googleapis');
const key = require('./auth.json');
const fs = require('fs');
const requestBodies = require('./requestBodies');
const formatter = require('./formatter');
const outputFunctions = require('./outputFunctions');
const auth = require('./auth.js');
const {
    requestBodiesCDS,
    requestBodiesSection,
    sectionsArr,
} = require('./requestBodies');

// Requests data from Analytics API
async function generateWeeklyReport() {
    console.log('\nGenerating Weekly Report...\n');

    //Authorization from auth.js
    const analytics = await auth.authorize();

    // GETs data
    console.log('Acquiring and Cleaning Analytics Data...\n');

    // GETs data for all of CDS
    var data = {
        cds: {},
        news: {},
        opinion: {},
        'arts-and-entertainment': {},
        sports: {},
        spectrum: {},
        'the-eye': {},
    };

    console.log('Processing CDS Overall:');
    for (let i = 0; i < requestBodiesCDS.length; i++) {
        let request = requestBodies.requestBodiesCDS[i];

        let res = await analytics.reports.batchGet(request);
        let report = res.data.reports[0];

        request.outputFunction(report, data.cds);
    }

    for (let i = 0; i < sectionsArr.length; i++) {
        let currSection = sectionsArr[i];
        console.log('Processing ' + currSection + ': ');
        let sectionBody = requestBodies.requestBodiesSection(currSection);

        // GETs data from Google Analytics API
        for (let j = 0; j < sectionBody.length; j++) {
            let request = sectionBody[j];

            let res = await analytics.reports.batchGet(request);
            let report = res.data.reports[0];

            request.outputFunction(report, data[currSection]);
        }
    }

    console.log(data);

    // TODO throw exception for non 2xx status code
    //https://developers.google.com/analytics/devguides/reporting/core/v3/coreDevguide#request
}

generateWeeklyReport();
