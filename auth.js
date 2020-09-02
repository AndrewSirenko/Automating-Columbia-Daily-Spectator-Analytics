const dotenv = require('dotenv').config();
const { google } = require('googleapis');
const key = require('./specAuth.json');
const fs = require('fs');

// Sets Analytics API scope: read only (to view reports)
const ANALYTICS_SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];
//Sets Docs API scope:
const DOCS_SCOPES = ['https://www.googleapis.com/auth/drive'];
const DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive'];
// Path to service account json
const SERVICE_ACCOUNT_FILE = process.env.GOOGLE_APP_CREDENTIALS_JSON;

// Create a new JWT client using the key file downloaded from the Google Developer Console
const authJWT = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: [ANALYTICS_SCOPES, DOCS_SCOPES, DRIVE_SCOPES],
});

const docsAuthJWT = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: DOCS_SCOPES,
});

async function authorizeAnalytics() {
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

async function authorizeDocs() {
    const client = await authJWT.getClient();

    // Obtains new analytics client, making sure we are authorized
    const docs = google.docs({
        version: 'v1',
        auth: client,
    });

    return docs;
}

async function authorizeDrive() {
    const client = await authJWT.getClient();

    // Obtains new analytics client, making sure we are authorized
    const drive = google.drive({
        version: 'v3',
        auth: client,
    });

    return drive;
}

module.exports = {
    authorize: authorizeAnalytics,
    authorizeDocs,
    authorizeDrive,
};
