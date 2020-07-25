/* File of requestBodies to be used
 * First shared fields
 * Then CDS requestBodies
 * Then other section Request bodies
 * Then top 10 articles request bodies
 */

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

// requestBody for pageviews, sessions, entrances, and avgtimePerPage

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

// TODO create object that creates jsons?

// returns copy of request body with an added pagePathLevel1 Filter
// Inputs: String of form '/section/', requestBody Object reference
function addPagePathLevel1Filter(section, requestBody) {
    // Copies the defaultChannelGrouping Object
    let dcg = { ...requestBody };

    // Creates new filter specifying pagePath
    let pathFilter = {
        dimensionName: 'ga:pagePathLevel1',
        operator: 'EXACT',
        expressions: [section],
    };

    // Adds new filter to dcg
    dcg.requestBody.reportRequests[0].dimensionFilterClauses[0].filters.push(
        pathFilter
    );

    return dcg;
}

// Test
console.log(
    addPagePathLevel1Filter('/news/', defaultChannelGrouping).requestBody
        .reportRequests[0].dimensionFilterClauses[0].filters
);
