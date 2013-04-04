angular.module('app').directive('enter', ['$timeout', function ($timeout) {
    return {
        scope: {
            'enter': '&'
        },
        link: function (scope, elm, attr) {
            elm.bind("keydown keypress", function(e) {
                if(e.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(scope.enter);
                    });

                    e.preventDefault();
                }
            });
        }
    };
}]);