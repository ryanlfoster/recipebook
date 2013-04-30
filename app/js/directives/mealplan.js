angular.module('app').directive('mealplan', ['$timeout', 'Recipe', function ($timeout, Recipe) {

    return {
        templateUrl: 'templates/mealplan.html',
        replace: true,
        link: function (scope, elm, attr) {

            scope.recipe = scope.$eval(attr.recipe);

            if (scope.recipe) {

                //setup

            } else {
                elm.hide();
            }
        }
    };
}]);