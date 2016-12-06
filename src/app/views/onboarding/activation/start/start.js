'use strict';

angular.module('tillerWebApp')
    .controller('activation.startCtrl', ['$scope', '$sessionStorage', 'onboardingProfileService', function ($scope, $sessionStorage, onboardingProfileService) {

        //$controller('activationCtrl', { $scope: $scope });

        $scope.user = $sessionStorage.user || {
                email: ""
            };

        if($scope.user.profile === undefined)
        {
            onboardingProfileService.getProfile().then(function(response){
                $scope.user.profile = response.data;
            });
        }

        $scope.stepExplanation = {
            title: "Thanks " + $scope.user.profile.firstName + ", Your portfolio is now set up",
            strapline: "Just three short steps to go...",
            steps: [
                {
                    stepIcon: "icon-34-big",
                    descriptionTitle: "",
                    description: "Validate your email address (with the email we sent you if you haven't done this yet)",
                    arrowToNextStep: "step-arrow-1"
                },
                {
                    stepIcon: "icon-33-big",
                    descriptionTitle: "",
                    description: "Tell us your bank details and answer some financial status questions",
                    arrowToNextStep: "step-arrow-2"
                },
                {
                    stepIcon: "icon-28-big",
                    descriptionTitle: "",
                    description: "Verify your identity"
                }
            ]

        };

        $scope.initialiseProfileData = function () {
            //we don't need to initialise data on the start screen'
        };

    }]);