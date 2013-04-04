angular.module('app').directive('searchAutocomplete', ['$rootScope', '$timeout', '$window','Recipe', function ($rootScope, $timeout, $window, Recipe) {

    function split(val) {
        return val.split(/,\s*/);
    }

    function extractLast(term) {
        return split(term).pop();
    }

    return {
        link: function (scope, elm, attr) {
            $(elm)// don't navigate away from the field on tab when selecting an item
            .bind("keydown", function (event) {
                if (event.keyCode === $.ui.keyCode.TAB && $(this).data("ui-autocomplete").menu.active) {
                    event.preventDefault();
                }
            }).autocomplete({
                minLength: 0,
                source: function (request, response) {

                    var params = scope.$parent.getSearchParams();

                    params.pageLength = 5;

                    Recipe.search(request.term, params, function(data) {
                        var results = [];

                        if(data && data.results && data.results.length) {
                            angular.forEach(data.results, function (result, key) {

                                if (result.content && result.content.recipe) {
                                    results.push({
                                        'value' : result.content.recipe.id,
                                        'label' : result.content.recipe.name
                                    });
                                }
                            });
                        }

                        response($.ui.autocomplete.filter(results, extractLast( request.term )));
                    }, function(data) {
                        response([]);
                    });
                },
                focus: function () {
                    // prevent value inserted on focus
                    return false;
                },
                select: function (event, ui) {
                    $window.location.href = $rootScope.view(ui.item.value);
                    return false;
                }
            });
        }
    };
}]);