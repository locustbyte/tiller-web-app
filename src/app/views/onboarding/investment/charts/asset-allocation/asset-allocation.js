'use strict';

angular.module('tillerWebApp')

    .controller('onboardingInvestment.charts.assetAllocationCtrl', ['$scope', '$timeout', 'restService', '$localStorage', 'chart.assetAllocationService', '$rootScope', 'chart.responsiveService', 'userService', 'PubSub', function ($scope, $timeout, restService, $localStorage, chartAssetAllocationService, $rootScope, chartResponsiveService, userService, PubSub) {

        $scope.state = 'onboarding-investment.charts';

        $rootScope.$on('view.change', function(e, state){

            $scope.state = state;

        });

        /**
         * Subscribers for actions published by onboardingPortfolioService
         * @param data
         */
        $scope.onboardingPortfoliosListener = function(data) {

            $scope.reloadAllocations();

        };

        PubSub.subscribe('portfolio.updated', $scope.onboardingPortfoliosListener);

        $scope.responsiveCharts = function(breakpoint){
            chartAssetAllocationService.destroy();
            chartAssetAllocationService.createChart($scope.element, $scope.data);
        };

        /**
         * Destroy and rebuild the chart on resize to new breakpoint
         */
        var breakPointsOff = $rootScope.$on('breakpoint.new', $scope.responsiveCharts);

        $scope.$on("$destroy", function handler() {
            // destruction code here
            PubSub.unsubscribe('portfolio.updated');
            breakPointsOff();
        });

        $scope.sessionData = function (response) {

            userService.getUserDataAsync().then(function(user){

                $scope.user = user;

                $scope.allocationParams = {
                    "take": 100,
                    "portfolioId": 0
                };

                $scope.initAllocations();

            });
        };

        $scope.sessionData();

        /**
         * Initialise the allocation api data
         * @param response
         */
        $scope.initAllocations = function (response) {

            restService.getAllocations($scope.allocationParams, $scope.state).then(function (response) {

                if(response.data.allocationsModels !== undefined)
                {
                    $scope.data = chartAssetAllocationService.setAllocations(response);

                    $scope.createChart();
                }

            });
        };

        /**
         * Create the asset allocation chart
         */
        $scope.createChart = function()
        {

            if($scope.element === undefined)
            {
                $scope.element = document.getElementById('assetAllocationChart');

                chartAssetAllocationService.createChart($scope.element, $scope.data);
            }
        };

        /**
         * Get new data and fire it at the chart
         * @param response
         */
        $scope.reloadAllocations = function (response) {

            if($scope.chartIsBuilt())
            {
                restService.getAllocations($scope.allocationParams, $scope.state).then(function (response) {

                    if (response.data.allocationsModels !== undefined) {

                        chartAssetAllocationService.zoomOut();

                        $scope.data = chartAssetAllocationService.setAllocations(response);

                        chartAssetAllocationService.rebuildChart($scope.data);
                    }
                });
            }

        };

        $scope.chartIsBuilt = function()
        {
            if($scope.data !== undefined && $scope.element !== undefined)
            {
                return true;
            }

            return false;
        };

    }]);