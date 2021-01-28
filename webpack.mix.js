let mix = require('laravel-mix');

mix.disableSuccessNotifications();
mix.setPublicPath('.');
//mix.setPublicPath('_site');
//mix.setResourceRoot('_site');


const outputDir = 'dist';

mix.js('src/assets/scripts/main.js', outputDir+'/assets/scripts/')
    .sourceMaps()
    .vue()
    .sass('src/assets/styles/main.scss', outputDir+'/assets/styles/')
    .options({
      extractVueStyles: true
    });

if(process.env.NODE_ENV == 'production') {
  mix.version().extract();
}