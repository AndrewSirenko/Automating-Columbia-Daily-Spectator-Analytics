const auth = require('./auth.js');
const { docs } = require('googleapis/build/src/apis/docs');

// FolderId of folder which stores weekly reports
const FOLDER_ID = '1z8V9bFSBL94TlG-qY6yb_DUHqbwycSwK';
// Doc ID of template document
const TEMPLATE_DOC_ID = '13z0nQfjAa-DzD4Rq1WDOxoOTZ4GXXjB2oYWWQsPgPvY';

async function generateWeeklyReportDoc() {
    //Authorization from auth.js
    const docs = await auth.authorizeDocs();

    //Test
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
}

// Copies letter template document using Drive API then
//   adds copy to Weekly Reports folder: https://drive.google.com/drive/folders/1z8V9bFSBL94TlG-qY6yb_DUHqbwycSwK?usp=sharing
//   returns file ID of (new) copy.
async function copyFile(originFileId, copyTitle) {
    const drive = await auth.authorizeDrive();

    var request = await drive.files.copy({
        fileId: originFileId,
        requestBody: {
            name: copyTitle,
            addParents: FOLDER_ID,
        },
    });

    return request.data.id;
}

//  Copies template document and merges JSON dataObject into newly-minted copy then
//  returns its file ID.
//  dataObject must be object of the form { textToBeReplaced : replacementText }
async function mergeTemplate(templateId, dataObject, fileName) {
    const docs = await auth.authorizeDocs();

    // copy template and set context data struct for merging template values
    let copyId = await copyFile(templateId, fileName);

    // De-structures and prepares dataObject for loop
    const dataObjectArray = Object.entries(dataObject);

    // "search & replace" API requests for merge substitutions
    let requests = [];

    // Loop assigning replaceAllText request to each key-value pair
    dataObjectArray.forEach(([key, value]) => {
        console.log(key);
        //  Reference: https://developers.google.com/docs/api/reference/rest/v1/documents/request#ReplaceAllTextRequest
        requests.push({
            replaceAllText: {
                containsText: {
                    text: `{{cds.${key}}}`,
                    matchCase: false,
                },

                replaceText: `${value}`,
            },
        });
    });

    // Send requests to Docs API to do actual merge
    // Reference: https://developers.google.com/docs/api/reference/rest/v1/documents/batchUpdate
    let res = await docs.documents.batchUpdate({
        documentId: copyId,
        resource: { requests },
    });

    console.log(res.data.replies);

    return copyId;
}

const testObj = {
    'ga:pageviews': ' up 0.26% (34056 vs 33968) ⬆',
    'ga:newUsers': ' down -0.33% (18181 vs 18241) ⬇',
    'ga:sessions': ' up 1.28% (23883 vs 23580) ⬆',
    'ga:percentNewSessions':
        ' down -1.59% (76.12527739396224 vs 77.35793044953351) ⬇',
    'ga:entrances': ' up 1.28% (23877 vs 23575) ⬆',
    'ga:avgTimeOnPage': ' up 2.58% (133.61243737105806 vs 130.251419224478) ⬆',
    'ga:users': ' up 8.64% (3054 vs 2811) ⬆',
    mostUsersCameFrom: 'Facebook',
    Facebook: ' up 183.91% (1147 vs 404) ⬆',
    Instagram: ' up 375.00% (114 vs 24) ⬆',
    LinkedIn: ' up 33.33% (32 vs 24) ⬆',
    Twitter: ' down -27.88% (119 vs 165) ⬇',
    mostPageViewsCameFrom: 'Organic Search',
    'Organic Search': ' down -1.89% (25450 vs 25940) ⬇',
    Direct: ' down -9.10% (5015 vs 5517) ⬇',
    Social: ' up 109.48% (2166 vs 1034) ⬆',
    top10Articles:
        '\n' +
        'Page Views: Article Link\n' +
        '------------------------\n' +
        '2302: /2000/09/15/are-you-sub-or-dom/\n' +
        '1050: /news/2020/07/28/columbia-asked-students-to-pledge-to-ensure-a-campus-safe-from-covid-19-not-everyone-is-on-board/\n' +
        '887: /news/2020/07/28/incoming-out-of-state-students-express-financial-and-logistical-concerns-over-new-york-quarantine-advisory/\n' +
        '631: /spectrum/2020/07/07/main-takeaways-on-barnard-fall-2020-guidelines/\n' +
        '347: /news/2020/07/12/students-have-been-just-as-good-as-the-police-at-enforcing-the-legacy-of-enslavement-that-would-finance-and-expand-columbias-prestige/\n' +
        '305: /opinion/2020/07/28/our-education-is-founded-on-white-supremacy-a-conscious-re-education-is-necessary/\n' +
        '273: /opinion/2019/03/27/discourse-and-debate-is-performative-activism-inherently-bad/\n' +
        '164: /opinion/2019/01/31/racism-reexamined/\n' +
        '160: /required-reading/2017/04/03/decoding-the-tricky-barnard-columbia-relationship/\n' +
        '154: /arts-and-entertainment/2020/07/29/gentrifying-goodwill-can-columbia-students-thrift-shop-ethically/',
};

mergeTemplate(TEMPLATE_DOC_ID, testObj, 'testPleaseWork');
