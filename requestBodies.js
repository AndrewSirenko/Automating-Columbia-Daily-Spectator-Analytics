/* File of requestBodies to be used
 * First shared fields
 * Then General Request bodies
 * Then top 10 articles request bodies
 * Then CDS only request bodies
 * Pagepath Filter Adder (for automating non CDS sections)
 */

const outputFunctions = require('./outputFunctions');
// For deep cloning... Because I couldn't find a native solution
const clonedeep = require('lodash.clonedeep');
const editMe = require('./editMe');
const VIEW_ID = editMe.VIEW_ID;

// Sections of Spec (not Overall CDS)
const sectionsArr = [
    'news',
    'opinion',
    'arts-and-entertainment',
    'sports',
    'spectrum',
    'the-eye',
];

// Contains the viewId and dateRanges
//   to be used in other request bodies with ... spread operator
const viewAndDates = {
    viewId: VIEW_ID,

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
};

// requestBody for pageviews, new users, percent new sessions, sessions,
// entrances, and avgtimePerPage
const defaultRequest = {
    requestBody: {
        reportRequests: [
            {
                ...viewAndDates,

                metrics: [
                    { expression: 'ga:pageviews' },
                    { expression: 'ga:newUsers' },
                    { expression: 'ga:sessions' },
                    { expression: 'ga:percentNewSessions' },
                    { expression: 'ga:entrances' },
                    { expression: 'ga:avgTimeOnPage' },
                ],
                dimensionFilterClauses: [
                    {
                        filters: [],
                    },
                ],
            },
        ],
    },
    outputFunction: outputFunctions.defaultRequestOutput,
};

// requestBody for CDS: default channel grouping
const defaultChannelGrouping = {
    requestBody: {
        reportRequests: [
            {
                ...viewAndDates,

                metrics: [
                    {
                        expression: 'ga:pageviews',
                    },
                ],
                dimensions: [{ name: 'ga:channelGrouping' }],
                orderBys: [
                    {
                        fieldName: 'ga:pageviews',
                        sortOrder: 'DESCENDING',
                    },
                ],
                dimensionFilterClauses: [
                    {
                        operator: 'AND',
                        filters: [
                            {
                                dimensionName: 'ga:channelGrouping',
                                not: false,
                                operator: 'IN_LIST',
                                expressions: [
                                    'Organic Search',
                                    'Social',
                                    'Direct',
                                ],
                                caseSensitive: false,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    outputFunction: outputFunctions.defaultChannelGroupingOutput,
};

// Request Body for top 10 articles
const top10Articles = {
    requestBody: {
        reportRequests: [
            {
                ...viewAndDates,

                metrics: [
                    {
                        expression: 'ga:pageviews',
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
    outputFunction: outputFunctions.top10ArticlesOutput,
};

// CDS ONLY: Request Body for % users from NYC
const percentUsersFromNYC = {
    requestBody: {
        reportRequests: [
            {
                ...viewAndDates,

                metrics: [
                    {
                        expression: 'ga:users',
                    },
                ],
                dimensionFilterClauses: [
                    {
                        operator: 'AND',
                        filters: [
                            {
                                dimensionName: 'ga:city',
                                not: false,
                                operator: 'IN_LIST',
                                expressions: ['New York'],
                                caseSensitive: false,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    outputFunction: outputFunctions.percentUsersFromNYCOutput,
};

// CDS ONLY: sessions from social network
const socialNetwork = {
    requestBody: {
        reportRequests: [
            {
                ...viewAndDates,

                metrics: [
                    {
                        expression: 'ga:users',
                    },
                ],
                dimensions: [{ name: 'ga:socialNetwork' }],
                dimensionFilterClauses: [
                    {
                        operator: 'AND',
                        filters: [
                            {
                                dimensionName: 'ga:socialNetwork',
                                not: false,
                                operator: 'IN_LIST',
                                expressions: [
                                    'Facebook',
                                    'Instagram',
                                    'LinkedIn',
                                    'Twitter',
                                ],
                                caseSensitive: false,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    outputFunction: outputFunctions.socialNetworkOutput,
};

// returns copy of request body with an added pagePathLevel1 Filter
// Inputs: String of form '/section/', requestBody Object reference
function addPagePathLevel1Filter(section, requestBody) {
    // Deep clones the requestBody Object
    let dcg = clonedeep({ ...requestBody });

    // Creates new filter specifying pagePath
    let pathFilter = {
        dimensionName: 'ga:pagePathLevel1',
        operator: 'EXACT',
        expressions: ['/' + section + '/'],
    };

    // Adds new filter to dcg
    dcg.requestBody.reportRequests[0].dimensionFilterClauses[0].filters.push(
        pathFilter
    );

    return dcg;
}

// Arr of requestBodies for CDS
const requestBodiesCDS = [
    defaultRequest,
    percentUsersFromNYC,
    socialNetwork,
    defaultChannelGrouping,
    top10Articles,
];

// Creates arr of requestBodies for given section
function requestBodiesSection(section) {
    let sectionRequests = [];

    // Copy request body object so we can pass new reference
    // Aka not change the old object accident
    let copyDR = defaultRequest;
    let copyDCG = defaultChannelGrouping;
    let copyTop10 = top10Articles;
    let copySocial = socialNetwork;
    // Adds pagePath filter to default request body
    sectionRequests.push(addPagePathLevel1Filter(section, copyDR));
    sectionRequests.push(addPagePathLevel1Filter(section, copyDCG));
    sectionRequests.push(addPagePathLevel1Filter(section, copyTop10));
    sectionRequests.push(addPagePathLevel1Filter(section, copySocial));

    return sectionRequests;
}

module.exports = {
    sectionsArr,
    requestBodiesCDS,
    requestBodiesSection,
};
