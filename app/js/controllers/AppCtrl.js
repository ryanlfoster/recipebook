angular.module('app').controller('AppCtrl', ['$rootScope', '$scope', '$window', 'DynamicFontSize', 'MealPlan', 'Utilities', function ($rootScope, $scope, $window, DynamicFontSize, MealPlan, Utilities) {

    $rootScope.view = function (id) {
        return '/view.html?id=' + id;
    };

    $rootScope.edit = function (id) {
        return '/edit.html?id=' + id;
    };

    $scope.loadContent = function () {
        DynamicFontSize.set('.content', DynamicFontSize.get());
    };

    $scope.addMealPlan = function (id) {
        MealPlan.get(function (data) {
            if (data && angular.isArray(data.mealplans)) {
                data.mealplans.push({
                    mealplan: id
                });

                data.mealplans = Utilities.cleanArray(data.mealplans, 'mealplan');

                MealPlan.save(data.mealplans, function (data) {
                    $rootScope.$broadcast('addMealPlan', id);
                }, function (data) {
                });

            }
        }, function (data) {
            //create emp
            if (data && data.indexOf('RESTAPI-NODOCUMENT') != -1) {
                MealPlan.save([], function (data) {
                    $scope.addMealPlan(id);
                }, function (data) {
                });
            }
        });
    };
}]);