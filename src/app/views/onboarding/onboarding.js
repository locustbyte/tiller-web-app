'use strict';

angular.module('tillerWebApp')

    .controller('onboardingCtrl', ['$scope', '$rootScope', '$state', '$sessionStorage', '$localStorage', 'validationService', 'onboardingUserService',
        function ($scope, $rootScope, $state, $sessionStorage, $localStorage, validationService, onboardingUserService) {
        //The basic user model. Used for capturing the initial email.
        $scope.user = $sessionStorage.user || {
            email: ""
        };

        //The user creation model. Built up to submit to the api to create a user.
        var initCreationModel = function () {
            $scope.userCreationModel = $sessionStorage.userCreationModel || {
                email: "",
                password: "",
                confirmPassword: "",
                sendConfirmEmailMessageOnCreate: true,
                basicProfile: {
                    title: "",
                    firstName: "",
                    middleName: "",
                    lastName: "",
                    phoneNumber: "",
                    isUSCitizen: null,
                    isLossSensitive: null,
                    isMarketingAllowed: false
                }
            };
        }
        initCreationModel(); // call by default on controller construction

        $scope.clearUserModel = function () {
            delete $sessionStorage.user;
            delete $sessionStorage.userCreationModel;
            delete $localStorage.authorizationData;
            $scope.userCreationModel = null;//clear
            initCreationModel();//re init
        };

        //todo: should come from API
        $scope.validationRules = [{
            "ruleType": "EMAIL",
            "propertyName": "EmailAddress",
            "validationExpression": "^[A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$",
            "validationExceptionMessage": "Invalid email address supplied."
        }];

        $scope.emailValidationModel = {
            rule: validationService.findRule($scope.validationRules, 'EmailAddress'),
            isEmailValid: true
        };
        $scope.validateEmail = function () {
            $scope.emailValidationModel.isEmailValid = validationService.validate($scope.emailValidationModel.rule, $scope.user.email);
        };


        $scope.resetPasswordValidationModel = function () {
            //todo: Password validation rule WILL be coming from the API
            $scope.passwordValidationModel = {
                rule: {},
                isPasswordValid: true, //as password currently has custom validation
                has10chars: '',
                has1number: '',
                hasSpecialChar: '',
                password: '',
                repeatPassword: '',
                upperCase: '',
                lowerCase: ''
            };
        };
        $scope.resetPasswordValidationModel();

        $scope.stepExplanation = {
            title: "Ready to get started?",
            strapline: "It couldn't be easier. There are three simple stages to getting started with Tiller.",
            steps: [
                {
                    stepIcon: "icon-37-big",
                    descriptionTitle: "Set up your profile",
                    description: "Give us some personal details and answer a few questions on your attitude to risk.",
                    arrowToNextStep: "step-arrow-1"
                },
                {
                    stepIcon: "icon-32-big",
                    descriptionTitle: "Create your portfolio",
                    description: "This makes sure Tiller recommends the investment mix that best meets your needs.",
                    arrowToNextStep: "step-arrow-2"
                },
                {
                    stepIcon: "icon-28-big",
                    descriptionTitle: "Activate your account",
                    description: "You'll need your bank details plus some documents to verify your identity via the app."
                }
            ]

        };

        $scope.saveProgress = function () {
            console.log("Saving onboarding progress.");
        };

        $scope.submitEmail = function () {
            if ($scope.emailValidationModel.isEmailValid === false || $scope.user.email == null || $scope.user.email === '')
                return;

            $scope.clearUserModel(); //clear session based user
            onboardingUserService.getUserByEmail($scope.user.email) //'dan.bambling@seqerm.com'
                .then(function success(response) {

                    $sessionStorage.user = response.data;

                    if ($sessionStorage.user.id === null) {
                        //unknown -> collect more details and ask blackball questions

                        //we'll be continuing to vreate a user so set up the userCreationModel
                        $sessionStorage.userCreationModel = $scope.userCreationModel;
                        $sessionStorage.userCreationModel.email = $scope.user.email;
                        $sessionStorage.user.email = $scope.user.email; //need to set this incase user goes back using back buttons
                        $state.transitionTo('onboarding.your-account-details');
                    }
                    else {
                        //known -> welcome back
                        //User already created so use the basic user model
                        $sessionStorage.user.email = $scope.user.email;
                        $state.transitionTo('onboarding.your-account-hello-again');
                    }                  

                }, function error(response) {

                });

        };

        $scope.submitPassword = function () {
            console.log("password submitted");
        };

        //todo: this will be coming as a validator from the api
        //Validation IS currently done on the API. a 400 is returned in the password isn't:
        // - >= 10 chars
        // - Has lower and uppercase chars
        // - Has a special character
        $scope.validatePassword = function () {

            if (!$scope.userCreationModel.password) {
                $scope.resetPasswordValidationModel();
                return;
            }

            if ($scope.userCreationModel.password.length > 9)
                $scope.passwordValidationModel.has10chars = 'valid';
            else
                $scope.passwordValidationModel.has10chars = '';

            var numberPresent = $scope.userCreationModel.password.match(/\d+/g);
            if (numberPresent != null) 
                $scope.passwordValidationModel.has1number = 'valid';          
            else
                $scope.passwordValidationModel.has1number = '';

            var specialCharPresent = $scope.userCreationModel.password.match(/^(?=.*[!@#$&*])/); // /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/
            if (specialCharPresent != null)
                $scope.passwordValidationModel.hasSpecialChar = 'valid';
            else
                $scope.passwordValidationModel.hasSpecialChar = '';

            var upperCaseCharPresent = $scope.userCreationModel.password.match(/[A-Z]/);
            if (upperCaseCharPresent != null)
                $scope.passwordValidationModel.upperCase = 'valid';
            else
                $scope.passwordValidationModel.upperCase = '';

            var lowerCaseCharPresent = $scope.userCreationModel.password.match(/[a-z]/);
            if (lowerCaseCharPresent != null)
                $scope.passwordValidationModel.lowerCase = 'valid';
            else
                $scope.passwordValidationModel.lowerCase = '';

            $scope.userCreationModel.confirmPassword = $scope.userCreationModel.password; //todo: are we really going to do this!?

        };
        $scope.validatePassword();

        //todo: into one 'onboarding' validation object...
        $scope.setIsAmerican = function () {
            $scope.userCreationModel.basicProfile.isUSCitizen = true;
            $scope.userCreationModel.basicProfile.isLossSensitive = null;
            $scope.evaluateAll();
        };
        $scope.setNotAmerican = function () {
            $scope.userCreationModel.basicProfile.isUSCitizen = false;
            $scope.evaluateAll();
        };

        $scope.setCanLose = function () {
            $scope.userCreationModel.basicProfile.isLossSensitive = false;
            $scope.evaluateAll();
        };
        $scope.setCannotLose = function () {
            $scope.userCreationModel.basicProfile.isLossSensitive = true;
            $scope.evaluateAll();
        };

        $scope.allValid = false;
        $scope.evaluateAll = function () {
            $scope.allValid = $scope.passwordValidationModel.isPasswordValid && $scope.userCreationModel.basicProfile.isLossSensitive === false && !$scope.userCreationModel.basicProfile.isUSCitizen;
        };
        $scope.evaluateAll();

        $scope.nameValid = false;
        $scope.validateName = function () {
            var profile = $scope.userCreationModel.basicProfile;
            if (profile.firstName && profile.firstName.length > 0 && profile.lastName && profile.lastName.length > 0)
                $scope.nameValid = true;
            else
                $scope.nameValid = false;
        };
        $scope.validateName();

        $scope.createUser = function () {
            onboardingUserService.createUser($sessionStorage.userCreationModel)
                .then(function success(response) {
                    var r = response;
            }, function error(response) {
                var r = response;
            });
        };

    }]);