angular.module('app').factory('LocalStorage', [ function () {
    return {
        set: function (key, data) {
            localStorage.setItem(key, JSON.stringify(data));
        },
        get: function (key) {
            return JSON.parse(localStorage.getItem(key) || '{}');
        }
    };
}]);