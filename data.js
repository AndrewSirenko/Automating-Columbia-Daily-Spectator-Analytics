var specSections = {
    cds: {
        name: 'cds',
        pageViews: String,
        percentUsersNY: String,
        pageViewsFromNewUsers: String,
        entrances: String,
        averageTimeOnPage: String,
        mostPageViewsCameFrom: String,
        organic: String,
        direct: String,
        social: String,
        mostUsersCameFrom: String,
        facebook: String,
        twitter: String,
        linkedIn: String,
        instagram: String,
    },
    otherSections: [
        (news = {
            name: 'news',
            pageViews: String,
            entrances: String,
            averageTimeOnPage: String,
            mostPageViewsCameFrom: String,
            organic: String,
            direct: String,
            social: String,
        }),
        (opinion = {}),
        (ae = {
            name: 'arts-and-entertainment',
        }),
        (sports = {}),
        (spectrum = {}),
        (eye = {}),
        (shaft = {}),
    ],
};

console.log(specSections);
