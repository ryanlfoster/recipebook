angular.module('app').controller('ViewRecipeCtrl', ['$rootScope', '$scope', '$window', '$timeout', 'DynamicFontSize', 'Recipe', 'Utilities', function ($rootScope, $scope, $window, $timeout, DynamicFontSize, Recipe, Utilities) {

    $scope.page = {
        loadFailure: false,
        saveMessage: false
    };

    var id = Utilities.queryParam('id');
    var save = Utilities.queryParam('save');

    if(id) {
        Recipe.get(id, function(data) {
            $scope.recipe = data.recipe;

            $timeout(function() {
                DynamicFontSize.set($rootScope.DynamicFontSizeSelector, DynamicFontSize.get());
            }, 500);

        }, function () {
            $scope.page.loadFailure = true;
        });
    }

    if(save === 'true') {
        $scope.page.saveMessage = true;
    }

}]);