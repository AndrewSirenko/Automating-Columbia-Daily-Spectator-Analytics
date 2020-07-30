/* Generates Columbia Daily Spectator Weekly Report Data
 *   through Google Analytics API v4
 */

const { google } = require('googleapis');
const key = require('./auth.json');
const fs = require('fs');
const requestBodies = require('./requestBodies');

const outputFunctions = require('./outputFunctions');
const auth = require('./auth.js');
const {
    requestBodiesCDS,
    requestBodiesSection,
    sectionsArr,
} = require('./requestBodies');

// Generates, processes, cleans, and compiles CDS weekly report data
// 1. Authorizes Google Analytics API v4 (See auth.js)
// 2. Processes CDS Overall data
// 3. Processes each section as specified in requestBodies.sectionArr
// 4. Compiles data into data JSON object

async function generateWeeklyReportData() {
    //Authorization from auth.js
    const analytics = await auth.authorize();

    console.log('Acquiring and Cleaning Analytics Data...\n');

    // JSON object storing processed data
    var data = {
        cds: {},
        news: {},
        opinion: {},
        'arts-and-entertainment': {},
        sports: {},
        spectrum: {},
        'the-eye': {},
    };

    // Processes CDS Overall and stores in data.cds
    console.log('Processing CDS Overall:');

    // Loops through each requestBody template in requestBodies.requestBodiesCDS
    for (let i = 0; i < requestBodiesCDS.length; i++) {
        // JSON request template as specified by Analytics API
        let request = requestBodies.requestBodiesCDS[i];

        // Queries api with
        let APIQueryResult = await analytics.reports.batchGet(request);
        let report = APIQueryResult.data.reports[0];

        // Formats report data into data.cds
        request.outputFunction(report, data.cds);
    }

    // Same general process as above but for each section of website
    // Loops through each section in requestBodies.sectionsARr
    for (let i = 0; i < sectionsArr.length; i++) {
        let currSection = sectionsArr[i];
        console.log('Processing ' + currSection + ': ');
        let sectionBody = requestBodies.requestBodiesSection(currSection);

        // GETs data from Google Analytics API
        for (let j = 0; j < sectionBody.length; j++) {
            let request = sectionBody[j];

            let APIQueryResult = await analytics.reports.batchGet(request);
            let report = APIQueryResult.data.reports[0];

            request.outputFunction(report, data[currSection]);
        }
    }

    console.log(data);
    return data;

    // TODO throw exception for non 2xx status code
    //https://developers.google.com/analytics/devguides/reporting/core/v3/coreDevguide#request
}

module.exports = {
    generateWeeklyReportData
}