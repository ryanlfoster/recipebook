angular.module('app').directive('categoriesAutocomplete', ['$timeout', 'Recipe', function ($timeout, Recipe) {

    function split(val) {
        return val.split(/,\s*/);
    }

    function extractLast(term) {
        return split(term).pop();
    }

    return {
        link: function (scope, elm, attr) {

            scope.$on('recipeReady', function () {
                $(elm)// don't navigate away from the field on tab when selecting an item
                .bind("keydown", function (event) {
                    if (event.keyCode === $.ui.keyCode.TAB && $(this).data("ui-autocomplete").menu.active) {
                        event.preventDefault();
                    }
                }).autocomplete({
                    minLength: 0,
                    source: function (request, response) {

                        var params = {};

                        params.pageLength = 5;

                        Recipe.getCategories(extractLast(request.term), params, function (data) {
                            var results = [];

                            if (data && data['values-response'] && data['values-response']['distinct-value'] && data['values-response']['distinct-value'].length) {
                                angular.forEach(data['values-response']['distinct-value'], function (result, key) {

                                    if (result['_value']) {
                                        results.push(result['_value']);
                                    }
                                });
                            }

                            response($.ui.autocomplete.filter(results, extractLast(request.term)));
                        }, function () {
                            response([]);
                        });
                    },
                    focus: function () {
                        // prevent value inserted on focus
                        return false;
                    },
                    select: function (event, ui) {
                        var terms = split(this.value);
                        // remove the current input
                        terms.pop();
                        // add the selected item
                        terms.push(ui.item.value);
                        // add placeholder to get the comma-and-space at the end
                        terms.push("");
                        this.value = terms.join(", ");
                        scope.page.categories = angular.copy(this.value);

                        return false;
                    }
                });
            });
        }
    };
}]);