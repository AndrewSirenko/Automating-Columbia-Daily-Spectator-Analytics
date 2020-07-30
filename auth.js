const dotenv = require('dotenv').config();
const { google } = require('googleapis');
const key = require('./auth.json');
const fs = require('fs');

// Sets API scope: read only (to view reports)
const SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];
// Path to service account json
const SERVICE_ACCOUNT_FILE = '/Users/Andrew/Dev/spec/auth.json';

// Create a new JWT client using the key file downloaded from the Google Developer Console
const authJWT = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: SCOPES,
});

async function authorize() {
    // Authorization
    console.log('Authorization: Generating OAuth 2.0 Token...\n');
    const client = await authJWT.getClient();

    // Obtains new analytics client, making sure we are authorized
    const analytics = google.analyticsreporting({
        version: 'v4',
        auth: client,
    });

    return analytics;
}

module.exports = {
    authorize,
};
