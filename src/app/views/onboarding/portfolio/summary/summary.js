
'use strict';

angular.module('tillerWebApp')

    //Currently shared between growth and income
    .controller('portfolioSummaryCtrl', ['$scope', '$controller', 'onboardingPortfolioService', 'PubSub', 'restService', 'allocationsService', '$sessionStorage', 'helperService', 'onboardingProfileService', '$state',
        function ($scope, $controller, onboardingPortfolioService, PubSub, restService, allocationsService, $sessionStorage, helperService, onboardingProfileService, $state) {

        $controller('portfolioCtrl', { $scope: $scope });

        $scope.user = $sessionStorage.user || {
            email: ""
        };

        if($scope.user.profile === undefined)
        {
            onboardingProfileService.getProfile().then(function(response){
                $scope.user.profile = response.data;
            });
        }

        $scope.state = 'onboarding-investment';

        /**
         * Set and format the relevant data from the portfolio model
         */
        $scope.setValues = function()
        {

            //get the portfolio models as defined by the api
            onboardingPortfolioService.getPortfolioModels()
                .then(function success(response) {

                    $scope.portfolio.portfolioTypeLabel = onboardingPortfolioService.getPortfolioTypeLabel($scope.portfolio.portfolioTypeId);

                    $scope.portfolio.wrapper = onboardingPortfolioService.getWrapper($scope.portfolio.wrapperId);

                    $scope.portfolio.allocationModel = onboardingPortfolioService.getAllocationModel($scope.portfolio.allocationModelTypeId);

                });


            $scope.initialAmount = helperService.formatMoney($scope.portfolio.initialAmount);

            $scope.initialTopUp = helperService.formatMoney($scope.portfolio.initialTopUp);

            $scope.initialTargetAmount = helperService.formatMoney($scope.portfolio.initialTargetAmount);
        };

        $scope.setValues();

        /**
         * Subscribers for actions published by onboardingPortfolioService
         * @param data
         */
        $scope.onboardingPortfoliosListener = function(data) {

            if(typeof $scope.portfolio.allocationModel === 'object')
            $scope.setValues();

        };

        PubSub.subscribe('onboarding.portfolioModels.loaded', $scope.onboardingPortfoliosListener);

        /**
         * Initialise the allocation api data
         * @param response
         */
        $scope.initAllocations = function (response) {

            restService.getAllocations({take: 100}, $scope.state).then(function (response) {

                if(response.data.allocationsModels !== undefined)
                {
                    allocationsService.setAssetAllocations(response.data);

                    $scope.assetAllocations = allocationsService.getAssetAllocations();
                }

            });
        };

        $scope.initAllocations();

        $scope.terms = false;

        $scope.toggleTerms = function()
        {
            $scope.terms = !$scope.terms;
        };

        $scope.completePortfolio = function()
        {
            if($scope.terms)
            {
                $state.go('onboarding-activation.start');
            }
        };

    }]);