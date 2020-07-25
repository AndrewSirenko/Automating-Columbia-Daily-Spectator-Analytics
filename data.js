var specSections = {
    cds: {
        name: 'CDS Overall',
        pageViews: String,
        percentUsersNY: String,
        pageViewsFromNewUsers: String,
        entrances: String,
        averageTimeOnPage: String,
        mostPageViewsCameFrom: String,
        organic: String,
        direct: String,
        social: String,
        facebook: String,
        twitter: String,
        linkedIn: String,
        instagram: String,
    },
    otherSections: [
        (news = {
            name: 'News',
            pageViews: String,
            entrances: String,
            averageTimeOnPage: String,
            mostPageViewsCameFrom: String,
            organic: String,
            direct: String,
            social: String,
        }),
        (opinion = {}),
        (ae = {}),
        (sports = {}),
        (spectrum = {}),
        (eye = {}),
        (shaft = {}),
    ],
};

console.log(specSections);
