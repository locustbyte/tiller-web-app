
'use strict';

angular.module('tillerWebApp')

    .controller('activation.verifyCtrl', ['$scope', '$sessionStorage', '$controller', 'validationService', function ($scope, $sessionStorage, $controller, validationService) {

        $controller('activationCtrl', { $scope: $scope });

        $scope.buttonWrapperClasses = {
            email: 'col-sm-5',
            phone: 'col-sm-5'
        };

        $scope.button = {
            email: {
                class: 'btn-lg text-left',
                formGroup: 'hidden'
            },
            phone: {
                class: 'btn-lg text-left',
                formGroup: 'hidden'
            }
        };

        $scope.toggleButtonClass = function(button)
        {

            angular.forEach($scope.buttonWrapperClasses, function(buttonClass, key){

                if(key == button)
                {
                    $scope.buttonWrapperClasses[key] = 'col-sm-8';
                    $scope.button[key].class = 'hidden';
                    $scope.button[key].formGroup = '';
                }
                else
                {
                    $scope.buttonWrapperClasses[key] = 'col-sm-2';
                    $scope.button[key].class = 'btn-mdlg btn-circle btn-text-hide-span';

                    if(key === 'phone')
                    {
                        $scope.button[key].class = $scope.button[key].class + ' pull-right';
                    }

                    $scope.button[key].formGroup = 'hidden';
                }

            });
        };

        //todo: should come from API
        $scope.validationRules = [{
            "ruleType": "EMAIL",
            "propertyName": "EmailAddress",
            "validationExpression": "^[A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$",
            "validationExceptionMessage": "Invalid email address supplied."
        },
        {
            "ruleType": "PHONENUMBER",
            "propertyName": "PhoneNumber",
            "validationExpression": "^[0-9]{9,11}$",
            "validationExceptionMessage": "Invalid phone number supplied."
        }];

        $scope.emailValidationModel = {
            rule: validationService.findRule($scope.validationRules, 'EmailAddress'),
            isEmailValid: true
        };
        $scope.validateEmail = function () {
            $scope.emailValidationModel.isEmailValid = validationService.validate($scope.emailValidationModel.rule, $scope.userDetails.emailAddress);
        };

        $scope.phoneNumberValidationModel = {
            rule: validationService.findRule($scope.validationRules, 'PhoneNumber'),
            isPhoneNumberValid: true
        };
        $scope.validatePhoneNumber = function () {
            $scope.phoneNumberValidationModel.isPhoneNumberValid = validationService.validate($scope.phoneNumberValidationModel.rule, $scope.userDetails.phoneNumber);
        };

        $scope.submitEmail = function() {
            //ToDo: send details by email
        };

        $scope.submitPhone = function() {
            //ToDo: send details by text
        };

        $scope.initialiseProfileData = function () {

            //pre-populate user details in form
            $scope.userDetails = {
                emailAddress: $sessionStorage.user.email,
                phoneNumber: $scope.profile.phoneNumber
            };

        };

    }]);