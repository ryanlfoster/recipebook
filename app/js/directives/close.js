angular.module('app').directive('close', ['$timeout', function ($timeout) {
    function remove(elm, selector) {
        elm.closest(selector).fadeOut(300, function () {
            $(this).remove();
        });
    }

    return {
        scope: {},
        link: function (scope, elm, attr) {
            var selector = attr.close || '.alert-box';

            elm.on('click', function (e) {
                remove(elm, selector);
            });
        }
    };
}]);