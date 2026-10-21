const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const EBAY_TOKEN = process.env.EBAY_TOKEN;
if (!EBAY_TOKEN) {
  console.error('ERROR: EBAY_TOKEN environment variable not set. Create an eBay app and set EBAY_TOKEN.');
  process.exit(1);
}

const presentaciones = require('./data-presentaciones.js');

function median(values) {
  if (!values.length) return null;
  values.sort((a,b) => a-b);
  const mid = Math.floor(values.length/2);
  if (values.length % 2 === 0) return (values[mid-1] + values[mid]) / 2;
  return values[mid];
}

async function fetchPriceForQuery(q) {
  const url = 'https://api.ebay.com/buy/browse/v1/item_summary/search?q=' + encodeURIComponent(q) + '&limit=20';
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${EBAY_TOKEN}`,
      'Content-Type': 'application/json',
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
    }
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`eBay API error ${res.status}: ${txt}`);
  }
  return res.json();
}

async function main() {
  const out = {};
  for (const p of presentaciones) {
    // require a productCode to perform lookup
    if (!p.productCode && !p.nombre) continue;
    const query = p.productCode || p.nombre;
    try {
      console.log('Searching eBay for', query);
      const data = await fetchPriceForQuery(query);
      const items = (data.itemSummaries || []).map(i => {
        const v = i.price && i.price.value ? Number(i.price.value) : null;
        return v;
      }).filter(v => typeof v === 'number' && !isNaN(v));
      const med = median(items);
      if (med !== null) {
        // format as currency with two decimals
        out[p.id] = { precioEstimado: `$${med.toFixed(2)}`, sourceCount: items.length, query };
        console.log(`  median ${out[p.id].precioEstimado} from ${items.length} results`);
      } else {
        out[p.id] = { precioEstimado: null, sourceCount: 0, query };
        console.log('  no price results');
      }
      // polite pause between requests
      await new Promise(r => setTimeout(r, 600));
    } catch (err) {
      console.error('Error for', query, err.message);
      out[p.id] = { precioEstimado: null, error: err.message };
    }
  }

  const file = path.join(__dirname, 'data-precios.json');
  fs.writeFileSync(file, JSON.stringify(out, null, 2), 'utf8');
  console.log('Wrote', file);
  console.log('To apply prices to your data, merge `precioEstimado` values from data-precios.json into `data-presentaciones.js` or load data-precios.json from the app at runtime.');
}

main().catch(err => { console.error(err); process.exit(1); });
