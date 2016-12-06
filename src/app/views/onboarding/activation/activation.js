'use strict';

angular.module('tillerWebApp')

    .controller('activationCtrl', ['$scope', '$rootScope', '$state', '$sessionStorage', '$timeout', 'identityApiAdapter', 'onboardingProfileService', 'saveExitService',
        function ($scope, $rootScope, $state, $sessionStorage, $timeout, identityApiAdapter, onboardingProfileService, saveExitService) {

            //NOTE: All controller inheriting from this controller need to implement the function $scope.initialiseProfileData

            //Got to login before you can use this service
            if (identityApiAdapter.isLoggedIn() !== true) {
                $state.transitionTo('onboarding.your-account');
                return;
            }

            $scope.stepScope = $scope;

            $scope.updateProfile = function () {
                onboardingProfileService.updateProfile($sessionStorage.user.profile)
                    .then(function success(response) {

                    }, function error(response) {
                        //todo: transition to error state?
                    });
            };

            $scope.saveProgress = function () {
                $scope.updateProfile();
            };

            //Getting the portfolio will return a portfolio model potentialled merged with discovery if the user has been through that process
            if ($sessionStorage.user.profile == null) {
                onboardingProfileService.getProfile()
                    .then(function success(response) {
                        if (response.data != null) {
                            $sessionStorage.user.profile = response.data;
                            $scope.profile = response.data;
                            $scope.modelLoaded = true;
                            $scope.initialiseProfileData(); //called on child controller
                        } else {
                            console.log("Error: Tiller API should return data from getProfile: An empty model for new user or a partially complete model for a returning user");
                        }
                    }, function error(response) {

                    });
            } else {
                //If we haven't got the model we don't enable the next button
                $scope.modelLoaded = true;
                $scope.profile = $sessionStorage.user.profile;
                $timeout(function () {
                    $scope.initialiseProfileData();//called on child controller
                }, 0);
            }


        }]);