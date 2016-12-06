'use strict';

angular.module('tillerWebApp')
    .controller('helloAgainCtrl', ['$scope', '$rootScope', '$state', '$sessionStorage', 'identityApiAdapter', function ($scope, $rootScope, $state, $sessionStorage, identityApiAdapter) {

        $scope.knownUserModel = {
            email: $sessionStorage.user.email,
            password: null,
            nextStep: {
                name: "Portfolio name",
                state: "onboarding-portfolio.name" //todo: will be assertained from API progress
            }
        };

        $scope.knownUserSubmit = function () {
            identityApiAdapter.login({
                userName: $scope.knownUserModel.email,
                password: $scope.knownUserModel.password
            })
            .then(function success(response) {
                $state.transitionTo('onboarding.welcome-back');
            }, function error(response) {
                var r = response;
                //todo: unknown password
            });

        };   

    }]);