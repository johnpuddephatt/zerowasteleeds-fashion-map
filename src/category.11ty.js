const sheet = require("./utils/sheet.js");
const categories = require("./data/categories.json");

class Page {
  data() {
    return {
      pagination: {
        data: "categories",
        size: 1,
        alias: "category",
      },
      permalink: (data) => `/api/category/${data.category.slug}.json`,
    };
  }
  render(data) {
    return sheet(
      data.category.sheet_number,
      data.site.sheet,
      data.category.title,
      [
        "Name",
        "Latitude",
        "Longitude",
        "Type",
        "Description",
        "Address",
        "Postcode",
        "Website",
        "Facebook",
        "Twitter",
        "Instagram",
        "Depop",
        "eBay",
        "Online shop",
        "Shop2",
      ]
    );
  }
}

module.exports = Page;
