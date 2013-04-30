/**
 * Configure RequireJS and load all project files
 */
require.config({
    glob: 'app/js/',
    shim: {
        'lib/jquery-ui/jquery-ui-1.10.2.custom': [
            'lib/jquery/jquery-1.9.1',
        ],
        'lib/angular/angular-1.1.4/angular': [
            'lib/jquery/jquery-1.9.1',
            'lib/jquery-ui/jquery-ui-1.10.2.custom',
            'lib/ckeditor/ckeditor',
            'lib/uuid/uuid',
        ],
        'app': [
            'lib/angular/angular-1.1.4/angular'
        ]
    },
    paths: {
        'templates': '../templates',
        'ng': 'lib/ng',
        'text': 'lib/text',
        'glob': '../components/requirejs-glob/lib/glob'
    }
});

require(['app'], function(){
  //now that the app module is loaded
  require([
    'glob!controllers/**/*.js',
    'glob!services/**/*.js',
    'glob!filters/**/*.js',
    'glob!directives/**/*.js',
  ], function () {
      //now that all the module's files are loaded
      angular.bootstrap(document, ['app']);
  });
});