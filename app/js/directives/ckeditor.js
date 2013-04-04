angular.module('app').directive('ckEditor', ['$rootScope', function ($rootScope) {
    return {
        require: '?ngModel',
        link: function (scope, elm, attr, ngModel) {
            var ck = CKEDITOR.replace(elm[0]);

            if (!ngModel) {
                return;
            }

            ck.on('pasteState', function () {
                scope.$apply(function () {
                    ngModel.$setViewValue(ck.getData());
                });
            });

            //Auto grow on load
            ck.on('setData', function () {
                CKEDITOR.on('instanceReady', function (ev) {
                    ev.editor.fire('contentDom');
                });
            });

            ngModel.$render = function () {
                ck.setData(ngModel.$viewValue);
            };

            ck.on('instanceReady', function(e) {
                $rootScope.$broadcast('ckeditorReady');
            });
        }
    };
}]);