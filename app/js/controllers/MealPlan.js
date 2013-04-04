angular.module('app').controller('MealPlan', ['$rootScope', '$scope', '$window', 'Recipe', 'MealPlan', 'Utilities', function ($rootScope, $scope, $window, Recipe, MealPlan, Utilities) {

    $scope.mealPlans = [];

    /**
     * @param event
     * @param id Id if recipe
     * @param index enforce a position in mealplans using this index
     */
    $scope.$on('addMealPlan', function (event, id, index) {
        Recipe.get(id, function (data) {
            if (data.recipe) {
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
                saveMealPlans.push({
                    mealplan: recipe.id
                });
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
        }, function (data) {
            var i = '';
        });
    };

    //load all mealplans on load
    $scope.getMealPlans();
}]);