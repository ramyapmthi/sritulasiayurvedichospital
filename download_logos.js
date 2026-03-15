const https = require('https');
const fs = require('fs');

const logos = [
    { url: 'http://icicilombard.com', name: 'images/icici.png' },
    { url: 'http://starhealth.in', name: 'images/starhealth.png' },
    { url: 'http://careinsurance.com', name: 'images/care.png' },
    { url: 'http://bajajallianz.com', name: 'images/bajaj.png' },
    { url: 'http://paramounttpa.com', name: 'images/paramount.png' },
    { url: 'http://healthindiatpa.com', name: 'images/healthindia.png' },
    { url: 'http://universalsompo.com', name: 'images/universalsompo.png' },
    { url: 'http://acko.com', name: 'images/acko.png' },
    { url: 'http://fhpl.net', name: 'images/fhpl.png' },
    { url: 'http://volohealth.in', name: 'images/volo.png' },
    { url: 'http://galaxyhealth.in', name: 'images/galaxy.png' },
    { url: 'http://tataaig.com', name: 'images/tataaig.png' }
];

logos.forEach(logo => {
    https.get(`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${logo.url}&size=128`, (res) => {
        res.pipe(fs.createWriteStream(logo.name));
    }).on('error', console.error);
});
