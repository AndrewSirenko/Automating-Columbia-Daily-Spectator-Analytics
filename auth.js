const dotenv = require('dotenv').config();
const { google } = require('googleapis');
const key = require('./auth.json');
const fs = require('fs');

// Sets Analytics API scope: read only (to view reports)
const ANALYTICS_SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];
//Sets Docs API scope:
const DOCS_SCOPES = ['https://www.googleapis.com/auth/drive'];
// Path to service account json
const SERVICE_ACCOUNT_FILE = '/Users/Andrew/Dev/spec/auth.json';

// Create a new JWT client using the key file downloaded from the Google Developer Console
const analyticsAuthJWT = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: ANALYTICS_SCOPES,
});

const docsAuthJWT = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: DOCS_SCOPES,
});

async function authorizeAnalytics() {
    // Authorization
    console.log('Authorization: Generating OAuth 2.0 Token...\n');
    const client = await analyticsAuthJWT.getClient();

    // Obtains new analytics client, making sure we are authorized
    const analytics = google.analyticsreporting({
        version: 'v4',
        auth: client,
    });

    return analytics;
}

async function authorizeDocs() {
    const client = await docsAuthJWT.getClient();

    // Obtains new analytics client, making sure we are authorized
    const docs = google.docs({
        version: 'v1',
        auth: client,
    });

    {
        docs.documents.get(
            {
                documentId: '13z0nQfjAa-DzD4Rq1WDOxoOTZ4GXXjB2oYWWQsPgPvY',
            },
            (err, res) => {
                if (err)
                    return console.log('The API returned an error: ' + err);
                console.log(`The title of the document is: ${res.data.title}`);
            }
        );
    }

    return docs;
}

authorizeDocs();

module.exports = {
    authorize: authorizeAnalytics,
    authorizeDocs,
};
