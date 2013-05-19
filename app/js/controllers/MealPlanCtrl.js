angular.module('app').controller('MealPlanCtrl', ['$rootScope', '$scope', '$window', 'Recipe', 'MealPlan', 'Utilities', function ($rootScope, $scope, $window, Recipe, MealPlan, Utilities) {

    $scope.mealPlans = [];

    $scope.sortableOptions = {
        cursor: 'crosshair',
        forceHelperSize: true,
        forcePlaceholderSize: true,
        placeholder: 'ui-state-highlight',
        revert: true,
        handle: '.ui-icon.move',
        stop: function (event, ui) {
            var ids = [];

            for(var i = 0; i < $scope.mealPlans.length; i++) {
                ids[i] = $scope.mealPlans[i].id;
            }

            MealPlan.save(MealPlan.createMealPlansArr(ids), function() {

            }, function() {
                $rootScope.$broadcast('error', 105);
            });
        }
    };

    /**
     * @param event
     * @param id Id if recipe
     * @param index enforce a position in mealplans using this index
     */
    $scope.$on('addMealPlan', function (event, id, index) {
        Recipe.get(id, function (data) {
            if (data && data.recipe) {
                if(jQuery.isNumeric(index) && !$scope.mealPlans[index]) {
                    $scope.mealPlans[index] = data.recipe;
                } else {
                    $scope.mealPlans.push(data.recipe);
                }
            }
        });
    });

    $scope.removeMealPlan = function (id) {
        var newMealPlans = [];
        var saveMealPlans = [];
        angular.forEach($scope.mealPlans, function(recipe, key) {
            if(recipe.id != id) {
                newMealPlans.push(recipe);
                saveMealPlans.push(MealPlan.createMealPlanObj(recipe.id));
            }
        });

        $scope.mealPlans = newMealPlans;
        MealPlan.save(saveMealPlans);
    };

    $scope.getMealPlans = function () {
        MealPlan.get(function (data) {
            if (data && angular.isArray(data.mealplans)) {
                angular.forEach(data.mealplans, function (value, key) {
                    $rootScope.$broadcast('addMealPlan', value.mealplan, key);
                });
            }
        });
    };

    //load all mealplans on load
    $scope.getMealPlans();
}]);