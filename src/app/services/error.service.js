'use strict';

angular.module('errorService', [])
    /*
     * Holds the user data collected within the app
     */
    .service('errorService', ['$location', function ($location) {

        this.error = false;

        this.setError = function(error)
        {
            this.error = error;

            $location.path('/error');

        };

        this.getError = function()
        {
            return this.error;
        };

    }])
;