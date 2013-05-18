angular.module('app').controller('EditRecipeCtrl', ['$rootScope', '$scope', '$timeout', '$window', '$q', 'Recipe', 'Utilities', function ($rootScope, $scope, $timeout, $window, $q, Recipe, Utilities) {

    $scope.busy = false;
    $scope.loaded = false;
    $scope.page = {
        showErrors: false,
        saveFailure: false,
        loadFailure: false,
        categories: '' //for recipe/user
    };

    var recipeReady = $q.defer(); //when the recipe is loaded
    var ckeditorReady = $q.defer(); //when the ckeditor is ready

    var id = Utilities.queryParam('id');

    if (id) {
        Recipe.get(id, function (data) {
            if (data.recipe) {
                $scope.recipe = data.recipe;
                var categoryArr = [];

                //move categories to a comma separated list
                angular.forEach($scope.recipe.categories, function (result, key) {
                    categoryArr.push(result.category);
                });

                if (categoryArr.length) {
                    // add placeholder to get the comma-and-space at the end
                    categoryArr.push("");
                }
                $scope.page.categories = categoryArr.join(", ");

                recipeReady.resolve();
            } else {
                $scope.page.loadFailure = true;

            }
        }, function () {
            $scope.page.loadFailure = true;
        });
    } else {
        $scope.recipeReady = false;
    }

    $scope.$on('ckeditorReady', function () {
        ckeditorReady.resolve();
    });

    $q.all([recipeReady, ckeditorReady]).then(function () {
        if (!$scope.loaded && $scope.recipe && $scope.recipe.instructions) {
            $scope.loaded = true;
            CKEDITOR.instances.instructions.setData($scope.recipe.instructions);
        }
    }, function () {
        $scope.page.loadFailure = true;
    });

    $timeout(function() {
       if(!$scope.loaded && $scope.recipe && $scope.recipe.instructions) {
           $scope.loaded = true;
           CKEDITOR.instances.instructions.setData($scope.recipe.instructions);
       }
    }, 1000);

    $scope.save = function () {
        if ($scope.busy) {
            return;
        }

        if ($scope.recipeForm && $scope.recipeForm.$valid) {
            $scope.page.showErrors = false;
            $scope.busy = true;

            var recipe = $scope.recipe;

            recipe.categories = [];
            angular.forEach($scope.page.categories.split(/,\s*/), function (value, key) {
                recipe.categories.push({
                    'category': value
                });
            });

            //Make sure recipe has an id
            if (!recipe.id) {
                recipe.id = Recipe.uuid();
            }

            Recipe.save(recipe, function () {
                $scope.busy = false;
                $window.location.href = $rootScope.view(recipe.id) + '&save=true';
            }, function () {
                $scope.busy = false;
                $scope.page.saveFailure = true;
            });
        } else {
            $scope.page.showErrors = true;
        }
    };

}]);