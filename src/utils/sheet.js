const axios  = require('axios');
const seed   = require('./save-seed.js');
const fs = require("fs");
let cachePath = `${__dirname}/../cache/sheet.json`;
var slugify = require('slugify');

// Once a googel sheet is "published to the web" we can access its JSON
// via a URL of this form. We just need to pass in the ID of the sheet
// which we can find in the URL of the document.

module.exports = (sheetID, documentID, categoryTitle, compact) => {
  let cachePath = `${__dirname}/../data/cache/${documentID}_${sheetID}_${compact ? 'compact' : 'full'}.json`;

  return new Promise((resolve, reject) => {


    if (fs.existsSync(cachePath) && (process.env.ELEVENTY_ENV == 'development')) {
      console.log(`Hitting cache: ${ cachePath }`);
      resolve(fs.readFileSync(cachePath, 'utf8'));
    }

    else {
      console.log(`Fetching data: ${documentID}_${sheetID} (${compact ? 'compact' : 'full'})`);

      axios.get(`https://spreadsheets.google.com/feeds/list/${documentID}/${sheetID}/public/values?alt=json`)
        .then(response => {

          // massage the data from the Google Sheets API into
          // a shape that will more convenient for us in our SSG.
          var data = [];

          response.data.feed.entry.forEach(item => {
            if(item.gsx$name.$t.trim()) {

              let row = {
                "id": `${sheetID}_${item.id.$t.split("/").pop()}`,
                // "slug": slugify(item.gsx$name?.$t),
                "name": item.gsx$name?.$t,
                "latitude": item.gsx$latitude?.$t,
                "longitude": item.gsx$longitude?.$t
              };

              if (!compact) {
                row.category = categoryTitle;
                row.description = item.gsx$description?.$t;
                row.address = item.gsx$address?.$t;
                row.postcode = item.gsx$postcode?.$t;
                row.website = item.gsx$website?.$t;
                row.facebook = item.gsx$facebook?.$t;
                row.twitter =  item.gsx$twitter?.$t;
                row.instagram =  item.gsx$instagram?.$t;
                row.depop =  item.gsx$depop?.$t;
                row.ebay =  item.gsx$ebay?.$t;
                row.shop = item.gsx$onlineshop?.$t;
                row.shop2 = item.gsx$onlineshop2?.$t;
              }

              data.push(row);
            }
          });

          // stash the data locally for developing without
          // needing to hit the API each time.
          seed(JSON.stringify(data), cachePath);

          // resolve the promise and return the data
          resolve(JSON.stringify(data));

        })

        // uh-oh. Handle any errrors we might encounter
        .catch(error => {
          console.log('Error :', error);
          reject(error);
        });
      }
  })

}
