angular.module('app').directive('mealplan', ['$timeout', 'Recipe', function ($timeout, Recipe) {

    return {
        scope: {
            'recipe': '='
        },
        templateUrl: 'templates/mealplan.html',
        replace: true,
        link: function (scope, elm, attr) {

            if (scope.recipe) {

                //setup

            } else {
                elm.hide();
            }
        }
    };
}]);