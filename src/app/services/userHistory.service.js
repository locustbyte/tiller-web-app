'use strict';

angular.module('userHistoryService', [])
    /*
     * Holds the user data collected within the app
     */
    .service('userHistoryService', ['$localStorage', function ($localStorage) {

        this.get = function()
        {
            return $localStorage.userHistory;
        };

        this.set = function(userHistory)
        {
            $localStorage.userHistory = userHistory;
        };

        this.getDefaults = function()
        {
            return {
                investorLevels: {
                    tracker: false,
                    active: false,
                    activePlus: false
                }
            };
        };

    }])
;