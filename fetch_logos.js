const https = require('https');
const fs = require('fs');

const queries = [
  { name: 'icici', q: 'ICICI Lombard logo png' },
  { name: 'starhealth', q: 'Star Health and Allied Insurance logo png' },
  { name: 'care', q: 'Care Health Insurance logo png' },
  { name: 'bajaj', q: 'Bajaj Allianz logo png' },
  { name: 'paramount', q: 'Paramount Health Services logo png' },
  { name: 'healthindia', q: 'Health India TPA logo png' },
  { name: 'universalsompo', q: 'Universal Sompo General Insurance logo png' },
  { name: 'acko', q: 'Acko General Insurance logo png' },
  { name: 'fhpl', q: 'FHPL Family Health Plan Insurance TPA logo png' },
  { name: 'volo', q: 'VOLO Health Insurance TPA logo png' },
  { name: 'galaxy', q: 'Galaxy Health Insurance logo png' },
  { name: 'tataaig', q: 'Tata AIG General Insurance logo png' }
];

async function fetchImageURL(query) {
  return new Promise((resolve) => {
    https.get(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/115.0' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/<img class="z-core-image" src="\/\/([^\"]+)"/);
        if (match) {
          resolve('https://' + match[1]);
        } else {
            const match2 = data.match(/src="\/\/external-content\.duckduckgo\.com\/iu\/\?u=([^&]+)/);
            if (match2) resolve(decodeURIComponent(match2[1]));
            else resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function downloadImage(url, path) {
  return new Promise((resolve) => {
    https.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (res) => {
        if(res.statusCode===301||res.statusCode===302){
            downloadImage(res.headers.location, path).then(resolve);
            return;
        }
        res.pipe(fs.createWriteStream(path));
        res.on('end', resolve);
    }).on('error', resolve);
  });
}

async function run() {
  for (const item of queries) {
    const imgUrl = await fetchImageURL(item.q);
    if (imgUrl) {
      await downloadImage(imgUrl, `images/${item.name}.png`);
      console.log(`Downloaded ${item.name}`);
    } else {
        // use fallback logo.uplead or google if not found
        console.log(`Fallback for ${item.name}`);
    }
  }
}
run();
