angular.module('app').directive('fontSizeReset', ['DynamicFontSize', function (DynamicFontSize) {
    return {
        link: function (scope, elm, attr) {
            elm.on('click', function(e) {
                DynamicFontSize.set(attr.fontSizeReset, 100);
            });
        }
    };
}]);
angular.module('app').directive('fontSizeGrow', ['DynamicFontSize', function (DynamicFontSize) {
    return {
        link: function (scope, elm, attr) {
            elm.on('click', function(e) {
                DynamicFontSize.set(attr.fontSizeGrow, (DynamicFontSize.get() + 5));
            });
        }
    };
}]);

angular.module('app').directive('fontSizeShrink', ['DynamicFontSize', function (DynamicFontSize) {
    return {
        link: function (scope, elm, attr) {
            elm.on('click', function(e) {
                DynamicFontSize.set(attr.fontSizeShrink, (DynamicFontSize.get() - 5));
            });
        }
    };
}]);