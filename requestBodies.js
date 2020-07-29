/* File of requestBodies to be used
 * First shared fields
 * Then General Request bodies
 * Then top 10 articles request bodies
 * Then CDS only request bodies
 * Pagepath Filter Adder (for automating non CDS sections)
 */

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
    viewId: '7024503',

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
};

// returns copy of request body with an added pagePathLevel1 Filter
// Inputs: String of form '/section/', requestBody Object reference
function addPagePathLevel1Filter(section, requestBody) {
    // Copies the defaultChannelGrouping Object
    let dcg = { ...requestBody };

    // Creates new filter specifying pagePath
    let pathFilter = {
        dimensionName: 'ga:pagePathLevel1',
        operator: 'EXACT',
        expressions: ['/' + section],
    };

    // Adds new filter to dcg
    dcg.requestBody.reportRequests[0].dimensionFilterClauses[0].filters.push(
        pathFilter
    );

    return dcg;
}

Test;
console.log(
    addPagePathLevel1Filter('news', defaultRequest).requestBody
        .reportRequests[0].dimensionFilterClauses[0].filters[0]
);

module.exports = {
    sectionsArr,
    defaultRequest,
    defaultChannelGrouping,
    top10Articles,
    percentUsersFromNYC,
    socialNetwork,
    addPagePathLevel1Filter,
};
