angular.module('app').controller('ImportRecipeCtrl', ['$rootScope', '$scope', '$window', '$timeout', '$http', 'Recipe', 'MealPlan', 'Utilities', function ($rootScope, $scope, $window, $timeout, $http, Recipe, MealPlan, Utilities) {
    $scope.busy = false;
    $scope.busycm = false;
    $scope.messages = [];

    var debug = {
        'recipes': false,
        'mealplans': false
    };

    $scope.import = function () {
        if ($scope.busy || $scope.busycm) {
            return;
        }

        if ($scope.importForm) {
            $scope.busy = true;
            $scope.busycm = true;

            if (!debug.recipes) {
                $http({method: 'GET', url: '/oldmarklogic/all.xqy'}).success(function (data, status, headers, config) {
                    var recipes = Utilities.stringtoXML(data).getElementsByTagName("recipe");

                    //iterate over the recipes
                    for (var i = 0; i < recipes.length; i++) {
                        var recipe = {};

                        //iterate over the recipe nodes
                        for (var j = 0; j < recipes[i].childNodes.length; j++) {
                            switch (recipes[i].childNodes[j].nodeName) {

                                case "id":
                                    recipe["id"] = recipes[i].childNodes[j].textContent;
                                    break;

                                case "name":
                                    recipe["name"] = recipes[i].childNodes[j].textContent;
                                    break;

                                case "instructions":
                                    recipe["instructions"] = Utilities.xmlToString(recipes[i].childNodes[j]).replace('<instructions>', '<div>').replace('</instructions>', '</div>');
                                    break;

                                case "categories":
                                    var categories = [];

                                    if (recipes[i].childNodes[j].childNodes) {
                                        for (var k = 0; k < recipes[i].childNodes[j].childNodes.length; k++) {
                                            categories.push({
                                                'category': recipes[i].childNodes[j].childNodes[k].textContent
                                            });
                                        }
                                    }

                                    recipe["categories"] = categories;

                                    break;

                                case "rating":
                                    recipe["rating"] = recipes[i].childNodes[j].textContent;
                                    break;

                                case "archived":
                                    recipe["archived"] = recipes[i].childNodes[j].textContent;
                                    break;

                                case "views":
                                    recipe["views"] = recipes[i].childNodes[j].textContent;
                                    break;

                                case "updated":
                                    recipe["updated"] = recipes[i].childNodes[j].textContent;
                                    break;

                                case "created":
                                    recipe["created"] = recipes[i].childNodes[j].textContent;
                                    break;

                                case "image":
                                    recipe["image"] = recipes[i].childNodes[j].textContent;
                                    break;

                            }
                        }

                        $scope.messages.push("Added <a href='/view.html?id=" + recipe.id + "'>" + recipe.name + "</a>");
                        Recipe.save(recipe);
                    }

                    $scope.busy = false;
                }).error(function (data, status, headers, config) {
                    $scope.busy = false;
                    $rootScope.$broadcast('error', 102);
                });
            } else {
                $scope.busy = false;
            }

            if (!debug.mealplans) {
                $http({method: 'GET', url: '/oldmarklogic/allcm.xqy'}).success(function (data, status, headers, config) {
                    var meals = Utilities.stringtoXML(data).getElementsByTagName("meal");

                    //iterate over the meals
                    var ids = [];
                    for (var i = 0; i < meals.length; i++) {
                        var id = meals[i].attributes.getNamedItem("id").textContent;
                        ids.push(id);
                    }

                    MealPlan.save(MealPlan.createMealPlansArr(ids), function(){
                        $scope.busycm = false;
                        $scope.messages.push("Added Custom Meals");
                    }, function() {
                        $scope.busycm = false;
                        $rootScope.$broadcast('error', 103);
                    });
                }).error(function (data, status, headers, config) {
                    $scope.busycm = false;
                    $rootScope.$broadcast('error', 104);
                });
            } else {
                $scope.busycm = false;
            }

        }
    };
}]);
