const auth = require('./auth.js');
const { docs } = require('googleapis/build/src/apis/docs');

// FolderId of folder which stores weekly reports
const folderId = '1z8V9bFSBL94TlG-qY6yb_DUHqbwycSwK';

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
            addParents: folderId,
        },
    });

    return request.data.id;
}
//  Copies template document and merges data into newly-minted copy then
//  returns its file ID.

// TODO
async function mergeTemplate(templateId, source, service) {
    const docs = await auth.authorizeDocs();

    // copy template and set context data struct for merging template values
    let copyId = await copyFile(templateId, 'testName');

    //context = merge.iteritems() if hasattr({}, 'iteritems') else merge.items()

    // "search & replace" API requests for merge substitutions
    // Reference: https://developers.google.com/docs/api/reference/rest/v1/documents/request#ReplaceAllTextRequest
    let requests = [
        {
            replaceAllText: {
                containsText: {
                    //text: '{{%s}}' % key.upper(),
                    text: '{{cds.ga:pageviews}}',
                    matchCase: false,
                },
                //replaceText: value,
                replaceText: 'TESTING',
            },
        },
    ]; // TODO for key, value in context]

    // Send requests to Docs API to do actual merge
    // Reference: https://developers.google.com/docs/api/reference/rest/v1/documents/batchUpdate
    let res = await docs.documents.batchUpdate({
        documentId: copyId,
        resource: { requests },
    });

    console.log(res.data.replies);

    return copyId;
}

const tempId = '13z0nQfjAa-DzD4Rq1WDOxoOTZ4GXXjB2oYWWQsPgPvY';
mergeTemplate(tempId);
