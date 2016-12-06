'use strict';

angular.module('userService', [])
    /*
     * Holds the user data collected within the app
     */
    .service('userService', ['$rootScope', 'restService', 'authService', function ($rootScope, restService, authService) {

        var _userData;

        var setUserData = function (data) {
            if (data.topUp === undefined) {
                data.topUp = 0;
            }

            if (data.target === undefined) {
                data.target = 0;
            }

            _userData = {
                "sessionToken": data.sessionToken,
                "emailAddress": data.emailAddress,
                "isMarketingAllowed": true,
                "isNewProfile": true,
                "totalYears": data.totalYears,
                "upFrontSum": data.upFrontSum,
                "topUp": data.topUp,
                "target": data.target,
                "riskLevel": data.riskLevel,
                "investorLevel": data.investorLevel,
                "validationRules": []
            }
        };

        this.setUserData = setUserData;

        this.getUserDataAsync = function () {

            if (_userData === undefined) {

                return restService.initialiseSession().then(function (response) {

                    setUserData(response);

                    return response;

                });

            } else {

                return Promise.resolve(_userData);

            }

        };

        this.getUserDataSync = function () {

            return _userData;

        };

        this.updateProfile = function()
        {
            //console.log('updating profile in user service...');

            var profile = {
                "sessionToken": _userData.sessionToken,
                "emailAddress": _userData.emailAddress,
                "isMarketingAllowed": true,
                "isNewProfile": true,
                "totalYears": $rootScope.sliders.totalYears.data.numericValue,
                "upFrontSum": $rootScope.sliders.lumpSum.data.numericValue,
                "topUp": $rootScope.sliders.topUp.data.numericValue,
                "target": $rootScope.sliders.target.data.numericValue,
                "investorLevel": _userData.investorLevel,
                "riskLevel": $rootScope.sliders.risk.data.numericValue,
                "validationRules": []
            };

            setUserData(profile);

            $rootScope.$broadcast('profile.updating', profile);

            restService.updateProfile(profile).then(function(response){

                $rootScope.$broadcast('profile.updated', profile);

            });
        };

    }]);