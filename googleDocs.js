const auth = require('./auth.js');

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
//   returns file ID of (new) copy.
async function copyFile(originFileId, copyTitle) {
    const drive = await auth.authorizeDrive();

    var request = await drive.files.copy({
        fileId: originFileId,
        requestBody: {
            name: copyTitle,
        },
    });

    console.log(request.data);
}

copyFile('13z0nQfjAa-DzD4Rq1WDOxoOTZ4GXXjB2oYWWQsPgPvY', 'test');
