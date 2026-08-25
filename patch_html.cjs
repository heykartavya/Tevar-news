const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const ogTags = `
    <meta name="description" content="तेवर न्यूज़ - जालौन, उरई, और बुंदेलखंड की सबसे ताज़ा और सच्ची खबरें।">
    <meta property="og:title" content="तेवर न्यूज़ (Tevar News)" />
    <meta property="og:description" content="जालौन, उरई, और बुंदेलखंड की सबसे ताज़ा और सच्ची खबरें सीधे आपके फोन पर।" />
    <meta property="og:image" content="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" />
    <meta property="og:url" content="https://tevarnews.in" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="तेवर न्यूज़ (Tevar News)" />
    <meta name="twitter:description" content="जालौन, उरई, और बुंदेलखंड की सबसे ताज़ा और सच्ची खबरें सीधे आपके फोन पर।" />
    <meta name="twitter:image" content="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" />
`;

html = html.replace('<title>Tevar News</title>', '<title>Tevar News</title>' + ogTags);

fs.writeFileSync('index.html', html);
