'use strict';

angular.module('tillerWebApp')

    .controller('onboardingInvestment.charts.assetRegionCtrl', ['$scope', 'restService', 'chart.assetRegionService', '$rootScope', 'PubSub', function ($scope, restService, chartAssetRegionService, $rootScope, PubSub) {

        $scope.state = 'onboarding-investment.charts.assetAllocation.region';

        $rootScope.$on('view.change', function(e, state){

            $scope.state = state;

        });

        /**
         * Subscribers for actions published by onboardingPortfolioService
         * @param data
         */
        $scope.onboardingPortfoliosListener = function(data) {

            $scope.reloadRegions();

        };

        PubSub.subscribe('portfolio.updated', $scope.onboardingPortfoliosListener);

        $scope.responsiveCharts = function(breakpoint){
            chartAssetRegionService.destroy();
            chartAssetRegionService.createChart($scope.element);
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

        $scope.initRegion = function (response) {

            restService.getAllocations({take: 20}, $scope.state).then(function (response) {

                if (response.data.allocationsModels !== undefined) {

                    chartAssetRegionService.setRegionData(response.data);

                    $scope.element = document.getElementById('assetRegionChart');

                    chartAssetRegionService.createChart($scope.element);

                }

            });
        };

        $scope.initRegion();

        $scope.reloadRegions = function (response) {

            restService.getAllocations({take: 20}, $scope.state).then(function (response) {

                if (response.data.allocationsModels !== undefined) {

                    chartAssetRegionService.setRegionData(response.data);

                    chartAssetRegionService.updateRegions();

                }

            });

        };

    }]);