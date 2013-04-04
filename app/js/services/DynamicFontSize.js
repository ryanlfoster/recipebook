angular.module('app').factory('DynamicFontSize', ['LocalStorage', function (LocalStorage) {
    var key = 'currentFontSize';

    return {
        /**
         * Set selector and all children to specified percentage.
         * Set it also in localStorage
         *
         * @param {String} selector
         * @param {int} percentage
         */
        set: function (selector, percentage) {
            $(selector + ' *').css('font-size', percentage + '%');
            LocalStorage.set(key, percentage);
        },
        /**
         * Return current font size in a percentage.
         *
         * Defaults to 100
         */
        get: function () {
            return LocalStorage.get(key) ? parseInt(LocalStorage.get(key), 10) || 100 : 100;
        }
    };
}]);