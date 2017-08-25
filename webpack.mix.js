const { mix } = require('laravel-mix');

mix.js('./js/app.js', './js/compiled.js')
   .sourceMaps()
   .minif;