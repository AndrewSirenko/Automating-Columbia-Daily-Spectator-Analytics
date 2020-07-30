const auth = require('./auth.js');

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

    console.log(request.data);
}

copyFile('13z0nQfjAa-DzD4Rq1WDOxoOTZ4GXXjB2oYWWQsPgPvY', 'test3');
