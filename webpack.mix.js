let mix = require('laravel-mix');

mix.disableSuccessNotifications();
mix.setPublicPath('.');
//mix.setPublicPath('_site');
//mix.setResourceRoot('_site');

const outputDir = 'dist';

mix.js('src/assets/scripts/main.js', outputDir+'/assets/scripts/')
    // .sourceMaps()
    .vue()
    .sass('src/assets/styles/main.scss', outputDir+'/assets/styles/')
    .options({
      extractVueStyles: true
    });
    // .postCss('src/assets/styles/app.scss', outputDir+'/assets/styles', [
    //     require('postcss-import')(),
    //     require('postcss-preset-env')({
    //         stage: 2,
    //         features: {
    //             'nesting-rules': true
    //         },
    //         preserve: false
    //     }),
    // ])
    // .copy('source/_assets/img/', outputDir+'/img')
    // .copy('source/favicon.ico', outputDir+'/favicon.ico')

if (mix.inProduction()) {
    mix.version().extract();
}