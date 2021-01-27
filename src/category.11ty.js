const sheet = require('./utils/sheet.js');
const categories = require("./data/categories.json");

class Page {
  data() {
    return {
      pagination: {
        data: 'categories',
        size: 1,
        alias: 'category'
      },
      permalink: data => `/api/category/${data.category.slug}.json`
    };
  }
  render(data) {
    console.log('category.11ty.js');
    return sheet(data.category.sheet_number,data.site.sheet, false);
  }
}

module.exports = Page;