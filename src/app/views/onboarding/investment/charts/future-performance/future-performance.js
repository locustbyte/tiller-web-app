'use strict';

angular.module('tillerWebApp')

    .controller('onboardingInvestment.charts.futurePerformanceCtrl', ['$controller', '$scope', 'helperService', 'restService', 'chart.futurePerformanceService', '$rootScope', 'userService', 'PubSub', function ($controller, $scope, helperService, restService, chartFuturePerformanceService, $rootScope, userService, PubSub) {

        $controller('portfolioCtrl', { $scope: $scope });

        $scope.state = 'onboarding-investment.charts';

        $scope.chartData = {
            medians: {}
        };

        $rootScope.$on('view.change', function(e, state){

            $scope.state = state;

            if($scope.state === 'onboarding-investment.charts.futurePerformance.expanded')
            {
                $scope.expanded = true;
                chartFuturePerformanceService.destroyChart();
                chartFuturePerformanceService.setAspectRatio(0.4);
                $scope.chart = chartFuturePerformanceService.createChart($scope.chartElement, $scope.chartData);
            }
            else if($scope.expanded === true && $scope.state === 'onboarding-investment.charts.futurePerformance')
            {
                $scope.expanded = false;
                chartFuturePerformanceService.destroyChart();
                chartFuturePerformanceService.setAspectRatio(0.6);
                $scope.chart = chartFuturePerformanceService.createChart($scope.chartElement, $scope.chartData);
            }

        });

        /**
         * Subscribers for actions published by onboardingPortfolioService
         * @param data
         */
        $scope.onboardingPortfoliosListener = function(data) {

            $scope.updateUser();

            $scope.rebuildChart();

        };

        PubSub.subscribe('portfolio.updated', $scope.onboardingPortfoliosListener);

        $scope.responsiveCharts = function(breakpoint){
            chartFuturePerformanceService.destroyChart();
            $scope.chart = chartFuturePerformanceService.createChart($scope.chartElement, $scope.chartData);
        };

        var breakPointsOff = $rootScope.$on('breakpoint.new', $scope.responsiveCharts);

        $scope.$on("$destroy", function handler() {
            // destruction code here
            PubSub.unsubscribe('portfolio.updated');
            breakPointsOff();
        });

        /**
         * Initialise the allocation api data
         * @param response
         */
        $scope.loadChart = function (response) {

            restService.getFuturePerformance($scope.portfolio.portfolioTypeId).then(function (response) {


                $scope.chartData = chartFuturePerformanceService.setValues(response, $scope.user);

                if($scope.state === 'onboarding-investment.charts.futurePerformance.expanded')
                {
                    chartFuturePerformanceService.setAspectRatio(0.4);
                    $scope.expanded = true;
                }
                else
                {
                    chartFuturePerformanceService.setAspectRatio(0.6);
                    $scope.expanded = false;
                }

                $scope.chartElement = document.getElementById('futurePerformanceChart');

                if(response !== false && $scope.chartIsBuilt())
                {

                    chartFuturePerformanceService.destroyChart();

                }

                $scope.chart = chartFuturePerformanceService.createChart($scope.chartElement, $scope.chartData);
            });

        };

        $scope.initChart = function(response)
        {

            $scope.updateUser();

            $scope.loadChart();

        };

        /**
         * Set the target and years values to work with the futurePerformance service values
         */
        $scope.updateUser = function()
        {
            var years = 10,
                target = $scope.portfolio.initialTargetAmount;

            if($scope.portfolio.portfolioTypeId === 2)
            {
                years = ($scope.portfolio.initialYearsToIncomeGeneration + $scope.portfolio.initialIncomeDuration);
                target = false;
            }
            else if($scope.portfolio.portfolioTypeId === 1)
            {
                years = $scope.portfolio.initialYearsToInvest;
            }

            $scope.user = {
                target: target,
                totalYears: years
            };

            console.log($scope.portfolio, $scope.user);

        };

        $scope.initChart();

        $scope.getClass = function()
        {
            switch($scope.state) {

                case 'onboarding-investment.charts':

                    return 'animate-scale-down opacity opacity-0 z-index z-index-lowest';

                case 'onboarding-investment.charts.futurePerformance':

                    return 'animate-scale-up opacity opacity-1 z-index z-index-neutral';

                default:

                    return 'hidden';

            }

        };

        /**
         * Initialise the allocation api data
         * @param response
         */
        $scope.rebuildChart = function (response) {

            restService.getFuturePerformance($scope.portfolio.portfolioTypeId).then(function (response) {

                if(response !== false)
                {

                    $scope.chartData = chartFuturePerformanceService.setValues(response, $scope.user);

                    $scope.chart = chartFuturePerformanceService.rebuildChart();

                }

            });

        };

        $scope.listener = function(data) {
            $scope.chartData.medians = data.medians;
            $scope.chartData.title = data.title;
        };

        PubSub.subscribe('charts.futurePerformance.updated', $scope.listener);

        $scope.chartIsBuilt = function()
        {
            if($scope.chart !== undefined)
            {
                return true;
            }

            return false;
        };

    }]);