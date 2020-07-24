
{
requestBody: {
    reportRequests: [
        {
            // Found in Analytics>Settings>ADMIN>View_Settings>View_ID
            viewId: process.env.VIEW_ID,
            // What time-frames are we analyzing (up to 2)
            dateRanges: [
                {
                    startDate: '7daysAgo',
                    endDate: '1daysAgo',
                },

            ],
            // What metrics do we want
            metrics: [
                {
                    expression: 'ga:pageviews',
                },
                {
                    expression: 'ga:sessions',
                },
                {
                    expression: 'ga:entrances',
                },
                {
                    expression: 'ga:avgTimeOnPage',
                },
            ],
            orderBys: [
                {
                    fieldName: 'ga:pageviews', sortOrder: 'DESCENDING'
                }
            ],
            dimensions: [
                {name: 'ga:pagePath'}
            ],
            dimensionFilterClauses: [
                {
                  filters: [
                    {
                        dimensionName: 'ga:pagePath',
                        not: true,
                        operator: "IN_LIST",
                        expressions: [
                          "/","/news/","/opinion/","/eye/"
                        ],
                        caseSensitive: false
                      
                    },
                  ],
                },
              ],
              pageSize: 10
        },
    ],
  }
}