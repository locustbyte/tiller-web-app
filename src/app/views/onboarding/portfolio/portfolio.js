'use strict';

angular.module('tillerWebApp')

    .controller('portfolioCtrl', ['$scope', '$rootScope', '$state', '$sessionStorage', '$timeout', 'onboardingPortfolioService', 'identityApiAdapter', 'sliderService', 'PubSub', 'restService', 'saveExitService',
        function ($scope, $rootScope, $state, $sessionStorage, $timeout, onboardingPortfolioService, identityApiAdapter, sliderService, PubSub, restService, saveExitService) {

        //Got to login before you can use this service
        if (identityApiAdapter.isLoggedIn() !== true) {
            $state.transitionTo('onboarding.your-account');
            return;
        }

        $scope.initialiseSliderData = function () { }; //effectively virtual as overriden by sub controllers

        $scope.resetSlider = function (sliderKey) {
            sliderService.resetSlider(sliderKey);
        };

        sliderService.enableReRouting = false;

        //todo: is there a nicer way to pass scope to a directive with an isolated scope? (so that bindings can still happen after transclusion)
        $scope.stepScope = $scope;

        $scope.setGoal = function () {
            $scope.portfolio.portfolioTypeId == 1 ? $scope.portfolioTypeDestination = 'onboarding-portfolio.growth-investment-level' : 'onboarding-portfolio.income-investment-level';
        };

        $scope.getGoal = function () {
            var goal = '';
            $scope.portfolio.portfolioTypeId == 1 ? goal = 'onboarding-portfolio.growth-investment-level' : goal = 'onboarding-portfolio.income-investment-level';
            return goal;
        };

        $scope.navToPortfolioTypeEntryPoint = function () {
            $timeout(function () {
                $state.transitionTo($scope.getGoal());
            }, 0);
        };

        $scope.updatePortfolio = function () {
            onboardingPortfolioService.updatePortfolio($sessionStorage.user.portfolio) //Not necessary to pass this but will make code more testable
                .then(function success(response) {

                }, function error(response) {
                    //todo: transition to error state?
                });
        };

        $scope.saveProgress = function () {
            $scope.updatePortfolio();
        };

        //Getting the portfolio will return a portfolio model potentialled merged with discovery if the user has been through that process
        if ($sessionStorage.user.portfolio == null) {
            onboardingPortfolioService.getPortfolios()
                .then(function success(response) {
                    if (response.data != null && response.data.length > 0) {
                        $sessionStorage.user.portfolio = response.data[0]; // for investor release convention is to use first element in array
                        $scope.portfolio = response.data[0];
                        $scope.initialiseSliderData();
                        $scope.setGoal();
                        $scope.modelLoaded = true;
                    } else {
                        console.log("Error: Tiller API should return data from getPortfolios: An empty model for new user; A model merged with discovery if they've been through the discovery process; A model with partial onboarding data if they started onboarding and exited part way through.")
                    }
                }, function error(response) {

                });
        } else {
            //If we haven't got the model we don't enable the next button
            $scope.modelLoaded = true;
            $scope.portfolio = $sessionStorage.user.portfolio;
            $scope.initialiseSliderData();
            $scope.setGoal();
        }

        /**
         * Subscribers for actions published by onboardingPortfolioService
         * @param data
         */
        //$scope.onboardingPortfoliosListener = function (data) {
        //    $scope.portfolio.portfolioTypeLabel = onboardingPortfolioService.getPortfolioTypeLabel($scope.portfolio.portfolioTypeId);
        //    $scope.portfolio.wrapper = onboardingPortfolioService.getWrapper($scope.portfolio.wrapperId);
        //    $scope.portfolio.riskTarget = onboardingPortfolioService.getRisk($scope.portfolio.targetRiskRatingId);
        //    $scope.portfolio.allocationModel = onboardingPortfolioService.getAllocationModel($scope.portfolio.allocationModelId);
        //};

        //PubSub.subscribe('onboarding.portfolioModels.loaded', $scope.onboardingPortfoliosListener);

        //progressService.initProgressBar($scope);

    }]);