angular.module('app').filter('max', function () {
    return function (input, size) {
        var length = size || 360;
        var out = "";
        if (input) {
            out = input.substr(0, length);
        }
        return out;
    };
});