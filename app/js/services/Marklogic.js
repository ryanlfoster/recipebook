angular.module('app').factory('Marklogic', ['$http', function ($http) {

    function callMarklogic(sMethod, sFunction, params, data, successCallback, errorCallback) {
        if (sMethod != 'DELETE' && !params['format']) {
            params['format'] = 'json';
        }

        var httpOptions = {
            method: sMethod,
            url: '/marklogic/v1/' + sFunction,
            headers: {
                'Accept': 'application/json'
            },
            data: data,
            params: params,
            cache: false
        };

        $http(httpOptions).then(function (response) {
            if (angular.isFunction(successCallback)) {
                successCallback(response.data);
            }
        }, function (response) {
            if (angular.isFunction(errorCallback)) {
                errorCallback(response.data);
            }
        });
    }

    return {
        'callMarklogic': callMarklogic
    };
}]);