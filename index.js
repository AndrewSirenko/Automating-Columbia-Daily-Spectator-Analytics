const dotenv = require('dotenv').config();
const { google } = require('googleapis');

// Sets API scope: read only (to view reports)
const scopes = 'https://www.googleapis.com/auth/analytics.readonly';

// JSON web token. Passed to any API request we make
const jwt = new google.auth.JWT(
  process.env.CLIENT_EMAIL,
  null,
  process.env.PRIVATE_KEY,
  scopes
);

//Found in Analytics>Settings>ADMIN>View_Settings>View_ID
const view_id = process.env.VIEW_ID;

async function getData() {
  const response = await jwt.authorize();
  const result = await google.analytics('v3').data.ga.get({
    auth: jwt,
    ids: 'ga:' + view_id,
    'start-date': '30daysAgo',
    'end-date': 'today',
    metrics: 'ga:pageviews',
  });

  console.dir(result);
}

getData();
