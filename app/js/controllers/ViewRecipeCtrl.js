angular.module('app').controller('ViewRecipeCtrl', ['$scope', '$window', 'Recipe', 'Utilities', function ($scope, $window, Recipe, Utilities) {

    $scope.page = {
        loadFailure: false,
        saveMessage: false
    };

    var id = Utilities.queryParam('id');
    var save = Utilities.queryParam('save');

    if(id) {
        Recipe.get(id, function(data) {
            if(data.recipe.instructions) {
                jQuery('#instructions').append(jQuery.parseHTML(data.recipe.instructions));
            }
            $scope.recipe = data.recipe;
        }, function () {
            $scope.page.loadFailure = true;
        });
    }

    if(save === 'true') {
        $scope.page.saveMessage = true;
    }

}]);