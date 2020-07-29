// Takes pair of resulting metrics from batchGet
// (ex: current week vs past week)
// and formats it into CDS report and finds %change
function dataToText(currData, pastData) {
    let percentChange = Math.fround(
        ((currData - pastData) / pastData) * 100
    ).toFixed(2);

    if (percentChange > 0)
        return (
            ' up ' +
            percentChange +
            '% (' +
            currData +
            ' vs ' +
            pastData +
            ') ⬆'
        );
    else
        return (
            ' down ' +
            percentChange +
            '% (' +
            currData +
            ' vs ' +
            pastData +
            ') ⬇'
        );
}
// Test
// console.dir(dataToText(2, 3));
// console.dir(dataToText(3, 2));

module.exports = { dataToText };
