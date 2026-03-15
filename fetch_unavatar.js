const https = require('https');
const fs = require('fs');

const domains = [
  { p: 'images/icici.png', d: 'icicilombard.com' },
  { p: 'images/starhealth.png', d: 'starhealth.in' },
  { p: 'images/care.png', d: 'careinsurance.com' },
  { p: 'images/bajaj.png', d: 'bajajallianz.com' },
  { p: 'images/paramount.png', d: 'paramounttpa.com' },
  { p: 'images/healthindia.png', d: 'healthindiatpa.com' },
  { p: 'images/universalsompo.png', d: 'universalsompo.com' },
  { p: 'images/acko.png', d: 'acko.com' },
  { p: 'images/fhpl.png', d: 'fhpl.net' },
  { p: 'images/volo.png', d: 'volohealth.in' },
  { p: 'images/galaxy.png', d: 'galaxyhealth.in' },
  { p: 'images/tataaig.png', d: 'tataaig.com' }
];

function dl(url, p) {
  return new Promise(res => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, r => {
      if (r.statusCode === 301 || r.statusCode === 302) {
        let loc = r.headers.location;
        if (loc.startsWith('/')) loc = 'https://unavatar.io' + loc;
        return dl(loc, p).then(res);
      }
      if (r.statusCode === 200) {
        const stream = fs.createWriteStream(p);
        r.pipe(stream);
        stream.on('finish', () => res(true));
      } else {
        res(false);
      }
    }).on('error', () => res(false));
  });
}

(async () => {
  for (let item of domains) {
    let s = await dl('https://unavatar.io/' + item.d + '?fallback=https://ui-avatars.com/api/'+item.d, item.p);
    console.log(item.d, s ? 'OK' : 'FAIL');
  }
})();
