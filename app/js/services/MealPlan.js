angular.module('app').factory('MealPlan', ['Marklogic', 'Utilities', function (Marklogic, Utilities) {

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

    function createMealPlansArr(ids) {
        var mealplans = [];

        if (jQuery.isArray(ids)) {
            for (var i = 0; i < ids.length; i++) {
                mealplans.push(createMealPlanObj(ids[i]));
            }
        }

        mealplans = Utilities.cleanArray(mealplans, 'mealplan');

        return mealplans;
    }

    function createMealPlanObj(id) {
        return {
            mealplan: id
        };
    }

    return {
        'get': getMealPlans,
        'save': replaceMealPlans,
        'createMealPlansArr': createMealPlansArr,
        'createMealPlanObj': createMealPlanObj
    };
}]);