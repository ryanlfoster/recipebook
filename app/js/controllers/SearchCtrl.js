angular.module('app').controller('SearchCtrl', ['$rootScope', '$scope', '$window', 'Recipe', 'MealPlan', 'Utilities', function ($rootScope, $scope, $window, Recipe, MealPlan, Utilities) {

    //errors
    var init = true;
    $scope.page = {
        loadFailure: false,
        noResults: false,
        busy: false
    };

    //search
    var defaultParams = {
        archived: false, //boolean
        sortorder: 'random', //random|updated|created|score
        direction: 'descending', //ascending|descending
        rating: null, //null|1|2|3|4|5
        categories: {} //object of category:true|false items
    };

    $scope.searchModel = angular.copy(defaultParams);
    $scope.searchResults = [];
    $scope.searchFacets = {};
    $scope.searchTotal = 0;

    $scope.search = function (q, params) {
        $scope.page.busy = true;

        if (!q) {
            q = '';
        }

        if (!params) {
            params = {};
        }

        var p = {};

        angular.extend(p, defaultParams, params);

        Recipe.search(q, p, function (data) {
            if (data) {
                //get total
                if (jQuery.isNumeric(data.total)) {
                    $scope.searchTotal = data.total;
                } else {
                    $scope.searchTotal = 'No';
                }

                //get facets
                if (data.facets) {
                    $scope.searchFacets = data.facets;
                }

                //get results
                if (data.results) {
                    $scope.searchResults = [];

                    angular.forEach(data.results, function (result, key) {

                        if (result.content && result.content.recipe) {
                            $scope.searchResults.push(result.content.recipe);
                        }
                    });

                    if (p.sortorder == 'random') {
                        $scope.searchResults = Utilities.randomizeArray($scope.searchResults);
                    }

                    if ($scope.searchResults.length == 0) {
                        if (init) {
                            init = false;
                            $scope.page.loadFailure = true;
                        } else {
                            $scope.page.loadFailure = false;
                            $scope.page.noResults = true;
                        }
                    } else {
                        init = false;
                        $scope.page.noResults = false;
                    }

                } else {
                    if (init) {
                        init = false;
                        $scope.page.loadFailure = true;
                    } else {
                        $scope.page.noResults = true;
                    }

                }
                $scope.page.busy = false;
            }
        }, function () {
            if (init) {
                init = false;
                $scope.page.loadFailure = true;
            }
            $scope.page.busy = false;
        });
    };

    $scope.clearSearchOption = function (model, name) {
        model[name] = null;
        $scope.performSearch();
    };

    $scope.clearSearchQuery = function () {
        $('#query').val('');
        $scope.searchForm.query.$setViewValue('');
        $scope.performSearch();
    };

    $scope.getSearchParams = function () {
        var params = {
            sortorder: $scope.searchModel.sortorder,
            direction: $scope.searchModel.direction
        };

        if ($scope.searchModel.archived === true) {
            params.archived = $scope.searchModel.archived;
        } else if (params.archived) {
            params.archived = false;
        }

        if (jQuery.isNumeric($scope.searchModel.rating)) {
            params.rating = $scope.searchModel.rating;
        } else if (params.rating) {
            delete params.rating;
        }

        if (angular.isObject($scope.searchModel.categories)) {
            params.categories = $scope.searchModel.categories;
        } else if (params.categories) {
            delete params.categories;
        }

        return params;
    };

    $scope.performSearch = function () {
        $scope.search($scope.searchForm.query.$viewValue, $scope.getSearchParams());
    };

    //load all recipes on load
    $scope.search();
}]);