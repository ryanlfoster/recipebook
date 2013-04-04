angular.module('app').factory('Recipe', ['$q', 'Marklogic', 'Utilities', function ($q, Marklogic, Utilities) {

    function initSearch(options) {
        var deferred = $q.defer();

        //Create Additional Query
        var additionalQuery = "";

        additionalQuery += "<cts:and-query xmlns:cts='http://marklogic.com/cts'>";
        additionalQuery += "<cts:directory-query xmlns:cts='http://marklogic.com/cts'><cts:uri>/recipes/</cts:uri></cts:directory-query>";

        if (options.archived) {
            additionalQuery += "<cts:element-range-query operator='=' xmlns:cts='http://marklogic.com/cts'><cts:element xmlns:json='http://marklogic.com/xdmp/json/basic'>json:archived</cts:element><cts:value xsi:type='xs:string' xmlns:xs='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'>true</cts:value></cts:element-range-query>";
        } else {
            additionalQuery += "<cts:not-query xmlns:cts='http://marklogic.com/cts'><cts:element-range-query operator='='><cts:element xmlns:json='http://marklogic.com/xdmp/json/basic'>json:archived</cts:element><cts:value xsi:type='xs:string' xmlns:xs='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'>true</cts:value></cts:element-range-query></cts:not-query>";
        }

        additionalQuery += "</cts:and-query>";

        var marklogicSearchOptions = {
            "additional-query": [additionalQuery],
            "constraint": [
                {
                    "name": 'rating',
                    "range": {
                        "type": "xs:int",
                        "json-key": "rating",
                        "facet": true
                    }
                },
                {
                    "name": 'category',
                    "range": {
                        "type": "xs:string",
                        "json-key": "category",
                        "facet": true
                    }
                }
            ],
            "page-length": 999999,
            "return-facets": true,
            "return-results": true,
            "term": {
                "empty": {
                    "apply": "all-results"
                }
            },
            "transform-results": {
                "apply": "raw"
            }
        };

        if (options.sortorder && options.direction) {
            if (options.direction !== 'ascending' && options.direction !== 'descending') {
                options.direction = 'descending';
            }

            switch (options.sortorder) {
                case 'random':
                    //randomized later
                    break;
                case 'created':
                    marklogicSearchOptions['sort-order'] = {
                        'json-key': 'created',
                        'direction': options.direction
                    };
                    break;
                case 'updated':
                    marklogicSearchOptions['sort-order'] = {
                        'json-key': 'updated',
                        'direction': options.direction
                    };
                    break;
                case 'score':
                    marklogicSearchOptions['sort-order'] = {
                        'score': null,
                        'direction': options.direction
                    };
                    break;
            }
        }

        if (jQuery.isNumeric(options.pageLength)) {
            marklogicSearchOptions['page-length'] = options.pageLength;
        }

        Marklogic.callMarklogic('PUT', 'config/query/default', {}, {
            "options": marklogicSearchOptions
        }, function () {
            deferred.resolve();
        }, function () {
            deferred.resolve();
        });

        return deferred.promise;
    }

    function search(query, params, successCallback, errorCallback) {
        if (!query) {
            query = '';
        } else {
            query = '*' + query + '*';
        }

        if (params.rating) {
            query += ' rating:' + params.rating;
        }

        if (angular.isObject(params.categories)) {
            angular.forEach(params.categories, function (value, key) {
                if (value) {
                    query += ' category:"' + key + '"';
                }
            });
        }

        initSearch(params).then(function () {
            Marklogic.callMarklogic('GET', 'search', {
                'q': query
            }, {}, successCallback, errorCallback);
        });
    }

    function initCategories(options) {
        var deferred = $q.defer();

        Marklogic.callMarklogic('PUT', 'config/query/categories', {}, {
            "options": {
                "sort-order": [
                    {
                        "direction": "ascending",
                        "json-key": "category",
                        "score": null
                    }
                ],
                "values": [
                    {
                        "name": "category",
                        "range": {
                            "type": "xs:string",
                            "json-key": "category"
                        }
                    }
                ]
            }
        }, function () {
            deferred.resolve();
        }, function () {
            deferred.resolve();
        });

        return deferred.promise;
    }

    function getCategories(query, params, successCallback, errorCallback) {
        if (!query) {
            query = '';
        } else {
            query = '*' + query + '*';
        }


        initCategories(params).then(function () {
            Marklogic.callMarklogic('GET', 'values/category', {
                'q': query,
                'options': 'categories'
            }, {}, successCallback, errorCallback);
        });
    }

    function getRecipe(id, successCallback, errorCallback) {
        Marklogic.callMarklogic('GET', 'documents', {
            'uri': '/recipes/' + id + '.json'
        }, {}, successCallback, errorCallback);
    }

    //save Recipe
    function saveRecipe(recipe, successCallback, errorCallback) {

        //Make sure created is set
        if (!recipe.created) {
            try {
                recipe.created = new Date().toISOString();
            } catch (e1) {
                console.log('Error:created');
            }
        }

        //Update updated
        try {
            recipe.updated = new Date().toISOString();
        } catch (e2) {
            console.log('Error:updated');
        }

        //Make sure instructions is set
        if (!recipe.instructions) {
            recipe.instructions = "";
        }

        //get list of images
        recipe.images = jQuery(recipe.instructions).find('img[src]').map(function () {
            return $(this).attr("src");
        }).get();

        //insert uploaded image first
        if (recipe.image) {
            if (!recipe.images) {
                recipe.images = [];
            }

            recipe.images.unshift(recipe.image);
        }

        //get text to show in search result
        recipe.text = jQuery(recipe.instructions).text();


        //Remove duplicates and empty values from categories
        recipe.categories = Utilities.cleanArray(recipe.categories, 'category');

        //make sure recipe has number of times viewed
        if (!recipe.view) {
            recipe.view = 1;
        }

        //make sure recipe has an id
        if (!recipe.id) {
            recipe.id = getUUID();
        }

        //Make sure recipe is wrapped
        recipe = {
            recipe: recipe
        };

        Marklogic.callMarklogic('PUT', 'documents', {
            'uri': '/recipes/' + recipe.recipe.id + '.json'
        }, recipe, successCallback, errorCallback);
    }

    function deleteRecipe(id, successCallback, errorCallback) {
        Marklogic.callMarklogic('DELETE', 'documents', {
            'uri': '/recipes/' + id + '.json'
        }, {}, successCallback, errorCallback);
    }

    function getUUID() {
        return uuid.v4().replace(/-/g, '');
    }

    return {
        'search': search,
        'get': getRecipe,
        'save': saveRecipe,
        'delete': deleteRecipe,
        'uuid': getUUID,
        'getCategories': getCategories
    };
}]);