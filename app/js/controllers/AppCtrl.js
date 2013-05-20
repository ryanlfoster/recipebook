angular.module('app').controller('AppCtrl', ['$rootScope', '$scope', '$window', 'DynamicFontSize', 'MealPlan', 'Utilities', function ($rootScope, $scope, $window, DynamicFontSize, MealPlan, Utilities) {

    $rootScope.error = {};
    $rootScope.DynamicFontSizeSelector = "#instructions";

    //Return string
    $rootScope.view = function (id) {
        return '/view.html?id=' + id;
    };

    //Return string
    $rootScope.edit = function (id) {
        return '/edit.html?id=' + id;
    };

    $scope.loadContent = function () {
        DynamicFontSize.set($rootScope.DynamicFontSizeSelector, DynamicFontSize.get());
    };

    $scope.addMealPlan = function (id) {
        MealPlan.get(function (data) {
            if (data && angular.isArray(data.mealplans)) {
                data.mealplans.push(MealPlan.createMealPlanObj(id));

                data.mealplans = Utilities.cleanArray(data.mealplans, 'mealplan');

                MealPlan.save(data.mealplans, function () {
                    $rootScope.$broadcast('addMealPlan', id);
                }, function () {
                    $rootScope.$broadcast('error', 100);
                });

            }
        }, function (data) {
            if (data && data.indexOf('RESTAPI-NODOCUMENT') != -1) {
                MealPlan.save([], function () {
                    $scope.addMealPlan(id);
                }, function () {
                    $rootScope.$broadcast('error', 101);
                });
            }
        });
    };

    $scope.$on('error', function (event, code) {
        $scope.error.code = code;
    });

    //go to path
    $rootScope.navigate = function(path, params) {
        $window.location.href = path +  (params ? '?' + jQuery.param(params) : '');
    }
}]);