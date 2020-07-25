Ask isa
-Why track pageviews from new users instead of sessions?
-Should we tag our emails with the email tag, and track pageviews from emails?
- Collect campaign detail from custom URLs: https://support.google.com/analytics/answer/1033863?hl=en



TODO
- Create batchget template using sports
- Set up array for each section
- Make method that takes input section
- Make seperate CD overall template
- Post Data to Google Docs
    https://developers.google.com/docs/api/how-tos/merge



Dimensions and Metrics Explorer:
Tells you what dimensions and metrics you can use
https://ga-dev-tools.appspot.com/dimensions-metrics-explorer/

Query Explorer:
Let's you quickly see results of a would be batchGet
https://ga-dev-tools.appspot.com/query-explorer/

ga:pagePath for pathing 
https://ga-dev-tools.appspot.com/dimensions-metrics-explorer/#ga:pagepath

Delta ordering for dates: 
https://developers.google.com/analytics/devguides/reporting/core/v4/basics#delta_ordering

Filters
https://developers.google.com/analytics/devguides/reporting/core/v3/reference#filters

"dimensionFilterClauses": [
    {
     "filters": [
      {
       "operator": "EXACT",
       "dimensionName": "ga:pagePath",
       "expressions": [
        "/your-path"
       ]
      }
     ]
    }
   ],