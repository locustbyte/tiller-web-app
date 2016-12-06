'use strict';

angular.module('onboardingProfileService', [])
    .service('onboardingProfileService', ['$http', '$q', '$rootScope', '$state', '$sessionStorage', 'identityApiAdapter', 'envService', 'PubSub', 'errorService', function ($http, $q, $rootScope, $state, $sessionStorage, identityApiAdapter, envService, PubSub, errorService) {

        var serviceBase = envService.read("apiUrl"),
            profile = this;


        /*


        */

        //GET /api/profile/initiateprofilecreation
        profile.initiateProfileCreation = function () {
            return $http.get(serviceBase + 'profile/initiateprofilecreation').then(function (response) {

                if(response.status === 200)
                {
                    return response;
                }
                else
                {

                    response.source = serviceBase + 'profile/initiateprofilecreation';
                    errorService.setError(response);

                }

            }, function(response) {

                response.source = serviceBase + 'profile/initiateprofilecreation';
                errorService.setError(response);

            });
        };

        profile.getProfile = function () {
            return $http.get(serviceBase + 'profile/profile').then(function (response) {

                if(response.status === 200)
                {
                    return response;
                }
                else
                {

                    response.source = serviceBase + 'profile/profile';
                    errorService.setError(response);

                }

            }, function(response) {

                response.source = serviceBase + 'profile/profile';
                errorService.setError(response);

            });
        };

        //PUT /api/profile/updateclientprofile
        profile.updateProfile = function (profileUpdateModel) {
            return $http.put(serviceBase + 'profile/updateclientprofile?profileId=' + profileUpdateModel.profileId, profileUpdateModel).then(function (response) {

                if(response.status === 200)
                {
                    return response;
                }
                else
                {

                    response.source = serviceBase + 'profile/updateclientprofile?profileId=' + profileUpdateModel.profileId;
                    errorService.setError(response);

                }

            }, function(response) {

                response.source = serviceBase + 'profile/updateclientprofile?profileId=' + profileUpdateModel.profileId;
                errorService.setError(response);

            });
        };


    }]);