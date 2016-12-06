'use strict';

angular.module('tillerWebApp')

    .controller('homeCtrl', ['$scope', 'restService', 'validationService', 'userService', '$location', '$rootScope', function ($scope, restService, validationService, userService, $location, $rootScope) {

        $scope.session = null;
        $scope.emailValidationModel = {
            rule: {},
            isEmailValid: false
        };

        /**
         * @rodo - refactor sliders so directive is a complete black box
         * Hack to evade issues with sliders after returning to home screen after initialising in discovery
         * @type {string}
         */
        $scope.state = 'home';

        $rootScope.$on('view.change', function (e, state) {

            if (state == 'home' && window.location.href.indexOf('/#') !== -1) {
                //console.log(window.location);
                var redirect = window.location.protocol + '//' + window.location.hostname;

                if (window.location.hostname === 'localhost') {
                    redirect = redirect + ':' + window.location.port;
                }

                //console.log(redirect);

                window.location.href = redirect;
            }
        });

        $scope.noEmailSetInProfile = true;

        $scope.sessionData = function (response) {

            userService.getUserDataAsync().then(function (user) {

                $scope.session = user;

                if ($scope.session.emailAddress !== '') {
                    $scope.noEmailSetInProfile = false;
                }

                $scope.emailValidationModel.rule = validationService.findRule($scope.session.validationRules, 'EmailAddress');

                $scope.validateEmail();

            });
        };

        $scope.userHasInput = false;

        $scope.userInput = function () {
            $scope.userHasInput = true;

            $scope.validateEmail();
        };

        $scope.sessionData();

        $scope.validateEmail = function () {

            $scope.emailValidationModel.isEmailValid = validationService.validate($scope.emailValidationModel.rule, $scope.session.emailAddress);

        };

        $scope.submit = function (response) {
            $scope.validateEmail();

            if ($scope.isValidEmail()) {

                restService.initialiseSessionWithEmail($scope.session.emailAddress).then(function (response) {

                    if (response.emailAddress === '') {
                        restService.updateProfileWithEmail($scope.session.emailAddress);
                    }

                    $scope.completeSessionCreation(response);

                });
            }

        };

        $scope.isValidEmail = function () {
            return ($scope.session.emailAddress !== undefined && $scope.emailValidationModel.isEmailValid);
        };

        $scope.completeSessionCreation = function (response) {

            userService.setUserData(response);

            $scope.startProfiling();
        };

        $scope.startProfiling = function () {
            $location.path('/discovery/profiling/lump-sum');
        };

    }]);