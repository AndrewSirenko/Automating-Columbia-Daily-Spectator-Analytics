const auth = require('./auth.js');
const { docs } = require('googleapis/build/src/apis/docs');

// FolderId of folder which stores weekly reports
const FOLDER_ID = '1z8V9bFSBL94TlG-qY6yb_DUHqbwycSwK';
// Doc ID of template document
const TEMPLATE_DOC_ID = '13z0nQfjAa-DzD4Rq1WDOxoOTZ4GXXjB2oYWWQsPgPvY';

async function generateWeeklyReportDoc(filename, data) {
    console.log('\nGenerating document...\n');

    // copy template and set context data struct for merging template values
    let copyId = await copyFile(TEMPLATE_DOC_ID, filename);

    // Add Date to header
    merge(copyId, { DATE: filename.substring(0, 15) });

    // Turns data into array of [section, corresponding dataObject]
    dataArray = Object.entries(data);

    // For each section, mergeTemplate all of its strings
    dataArray.forEach(([sectionName, value]) => {
        // Must include . after section name for template to work
        merge(copyId, value, '' + sectionName + '.');
    });
} //TODO throw exceptions if failed

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
async function merge(docId, dataObject, sectionName = '') {
    const docs = await auth.authorizeDocs();

    // De-structures and prepares dataObject for loop
    const dataObjectArray = Object.entries(dataObject);

    // "search & replace" API requests for merge substitutions
    let requests = [];

    // Loop assigning replaceAllText request to each key-value pair
    dataObjectArray.forEach(([key, value]) => {
        //  Reference: https://developers.google.com/docs/api/reference/rest/v1/documents/request#ReplaceAllTextRequest
        requests.push({
            replaceAllText: {
                containsText: {
                    text: `{{${sectionName}${key}}}`,
                    matchCase: false,
                },

                replaceText: `${value}`,
            },
        });
    });

    // Send requests to Docs API to do actual merge
    // Reference: https://developers.google.com/docs/api/reference/rest/v1/documents/batchUpdate
    let res = await docs.documents.batchUpdate({
        documentId: docId,
        resource: { requests },
    });

    console.log(res.data.replies);

    return docId;
}

module.exports = {
    mergeTemplate: merge,
    generateWeeklyReportDoc,
    copyFile,
};
