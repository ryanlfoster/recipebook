/**
 * Configure RequireJS and load all project files
 */
require.config({
    glob: 'app/js/',
    shim: {
        'lib/jquery-ui/jquery-ui-1.10.2.custom': [
            'lib/jquery/jquery-1.9.1',
        ],
        'lib/angular/angular-1.1.3/angular': [
            'lib/jquery/jquery-1.9.1',
            'lib/jquery-ui/jquery-ui-1.10.2.custom',
            'lib/ckeditor/ckeditor',
            'lib/uuid/uuid'
        ],
        'lib/angular/sortable': [
            'lib/angular/angular-1.1.3/angular',
            'lib/jquery/jquery-1.9.1',
            'lib/jquery-ui/jquery-ui-1.10.2.custom'
        ],
        'lib/angular/angular-1.1.3/angular-resource': [
            'lib/angular/angular-1.1.3/angular'
        ],
        'app': [
            'lib/angular/angular-1.1.3/angular',
            'lib/angular/angular-1.1.3/angular-resource',
            'lib/angular/sortable'
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