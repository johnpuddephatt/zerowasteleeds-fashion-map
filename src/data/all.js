const sheet = require('../utils/sheet.js');
const categories = require('./categories.json');

module.exports = () => {

  let data = [];

  categories.forEach(category => {

    sheet(category.sheet_number,'1RJqnvVh14ef87DQMwjwZiOuEtuvjKDCUCmPoHKB2Wg4', true).then((result)=> {
      let parsedResult = JSON.parse(result);
      parsedResult.forEach(entry => {
        entry.category = category.slug;
        data.push(entry);
      });
    })
  });

  return data;
}
