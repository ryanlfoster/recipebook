angular.module('app').factory('Utilities', [ '$window', function ($window) {
    var QueryString = (function (a) {
        if (a == "") {
            return {};
        }
        var i;
        var b = {};
        for (i = 0; i < a.length; ++i) {
            var p = a[i].split('=');
            if (p.length != 2) {
                continue;
            }
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    }($window.location.search.substr(1).split('&')));

    /**
     * Randomize array element order in-place.
     * Using Fisher-Yates shuffle algorithm.
     */
    function shuffleArray(array) {
        var i;
        for (i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    /**
     * Remove duplicates and empty values in array
     */
    function cleanArray(array, duplicateKey) {

        if(!jQuery.isArray(array)) {
            return [];
        }

        if(!duplicateKey) {
            duplicateKey = 'category';
        }


        //Remove empty values
        var newArray = [];
        angular.forEach(array, function(value, key) {
            if (value[duplicateKey]){
                newArray.push(value);
            }
        });
        array = newArray;

        //Remove duplicates
        var newObject = {};
        angular.forEach(array, function(value, key) {
            //set category as key and save key (overwriting old key)
            newObject[value[duplicateKey]]=key;
        });

        newArray = [];
        angular.forEach(newObject, function(value, key) {
            newArray.push(array[value]); //value is key from previous step
        });
        array = newArray;

        return array;
    }

    return {
        queryParam: function (key) {
            return QueryString[key];
        },
        parseHTML: jQuery.parseHTML,
        randomizeArray: shuffleArray,
        cleanArray: cleanArray
    };
}]);