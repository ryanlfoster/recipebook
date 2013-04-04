angular.module('app').factory('MealPlan', ['Marklogic', function (Marklogic) {

    function getMealPlans(successCallback, errorCallback) {
        Marklogic.callMarklogic('GET', 'documents', {
            'uri': '/mealplans.json'
        }, {}, successCallback, errorCallback);
    }

    //replace Recipe
    function replaceMealPlans(mealplans, successCallback, errorCallback) {

        //Make sure a mealplans is wrapped
        mealplans = {
            mealplans: mealplans
        };

        Marklogic.callMarklogic('PUT', 'documents', {
            'uri': '/mealplans.json'
        }, mealplans, successCallback, errorCallback);
    }

    return {
        'get': getMealPlans,
        'save': replaceMealPlans
    };
}]);