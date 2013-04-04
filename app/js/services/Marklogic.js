angular.module('app').factory('Marklogic', ['$http', function ($http) {

    function callMarklogic(sMethod, sFunction, params, data, successCallback, errorCallback) {
        if (!params['format']) {
            params['format'] = 'json';
        }

        var httpOptions = {
            method: sMethod,
            url: '/marklogic/v1/' + sFunction,
            headers: {
                'Accept': 'application/json'
            },
            data: data,
            params: params
        };

        $http(httpOptions).success(function (data, status, headers, config) {
            if (angular.isFunction(successCallback)) {
                successCallback(data);
            }
        }).error(function (data, status, headers, config) {
            if (angular.isFunction(errorCallback)) {
                errorCallback(data);
            }
        });
    }

    return {
        'callMarklogic': callMarklogic
    };
}]);