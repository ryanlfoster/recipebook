angular.module('app').directive('rating', ['$timeout', 'Recipe', function ($timeout, Recipe) {

    function createStar(elm, recipeid, number) {
        $(elm).find(".starsArea" + number).each(function () {
            var $this = $(this);
            var parent = $this.parents(".stars");

            $this.hover(function () {
                parent.data("org", parent.attr("class"));
                parent.attr("class", "stars stars" + number);
            },function () {
                parent.attr("class", parent.data("org"));
            }).click(function () {
                parent.data("org", parent.attr("class"));
                parent.attr("class", parent.data("org"));
                setRating(recipeid, number);
            });
        });
    }

    function setRating(recipeid, number) {

        Recipe.get(recipeid, function(data) {
            if(data.recipe) {
                data.recipe.rating = number;
                Recipe.save(recipeid, data.recipe, null, function(){
                    console.log('errorUPDATE');
                });
            } else {
                console.log('errorSUCCESS');
            }
        }, function() {
            console.log('errorGET');
        });
    }

    return {
        scope: {
            'rating': '=',
            'recipeid': '='
        },
        templateUrl: 'templates/rating.html',
        replace: true,
        link: function (scope, elm, attr) {
            scope.rating = scope.rating || 0;

            if (scope.recipeid) {
                createStar(elm, scope.recipeid, 1);
                createStar(elm, scope.recipeid, 2);
                createStar(elm, scope.recipeid, 3);
                createStar(elm, scope.recipeid, 4);
                createStar(elm, scope.recipeid, 5);
            } else if(!scope.rating) {
                elm.hide();
            }
        }
    };
}]);