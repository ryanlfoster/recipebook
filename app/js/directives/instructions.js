angular.module('app').directive('instructions', ['Utilities', function (Utilities) {
    return {
        scope: {
            instructions: '='
        },
        link: function (scope, elm, attr) {
            elm.replaceWith(Utilities.parseHTML(scope.instructions));
        }
    };
}]);