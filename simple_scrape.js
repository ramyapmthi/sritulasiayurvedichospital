const https = require('https');
const fs = require('fs');

async function scrape(query, name) {
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(query) + '&tbm=isch&safe=active';
    return new Promise(resolve => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36' } }, res => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                const match = data.match(/<img[^>]+src="([^">]+)"/g);
                if (match && match.length > 1) {
                    for(let i=0; i<match.length; i++) {
                        let m2 = match[i].match(/src="([^">]+)"/);
                        if(m2 && m2[1].startsWith('http')) {
                            resolve(m2[1]); return;
                        }
                    }
                }
                resolve(null);
            });
        }).on('error', () => resolve(null));
    });
}
const queries = [
  { name: 'icici', q: 'ICICI Lombard logo white background' },
  { name: 'starhealth', q: 'Star Health Insurance logo' },
  { name: 'care', q: 'Care Health Insurance logo' },
  { name: 'bajaj', q: 'Bajaj Allianz General Insurance logo' },
  { name: 'paramount', q: 'Paramount Health Services TPA logo' },
  { name: 'healthindia', q: 'Health India TPA logo' },
  { name: 'universalsompo', q: 'Universal Sompo General Insurance logo' },
  { name: 'acko', q: 'Acko Insurance logo transparent' },
  { name: 'fhpl', q: 'FHPL Health TPA logo' },
  { name: 'volo', q: 'VOLO Health Insurance TPA logo' },
  { name: 'galaxy', q: 'Galaxy Health Insurance logo' },
  { name: 'tataaig', q: 'Tata AIG General Insurance logo' }
];
async function download(url, path) {
    return new Promise(res => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, r => {
            const w = fs.createWriteStream(path);
            r.pipe(w);
            w.on('finish', () => res(true));
        }).on('error', () => res(false));
    });
}
async function run() {
    for (let item of queries) {
        let u = await scrape(item.q, item.name);
        if (u) {
            await download(u, 'images/' + item.name + '.png');
            console.log('Got', item.name);
        } else {
            console.log('Failed', item.name);
        }
    }
}
run();
