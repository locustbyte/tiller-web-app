'use strict';

angular.module('tillerWebApp')

    .controller('discovery.charts.pastPerformanceCtrl', ['$scope', 'helperService', 'restService', 'chart.pastPerformanceService', '$rootScope', 'userService', function ($scope, helperService, restService, chartPastPerformanceService, $rootScope, userService) {

        $scope.state = 'discovery.charts';
        $scope.expanded = false;
        $scope.chart = false;
        $scope.templateLoaded = false;

        $scope.finishedLoading = function()
        {
            $scope.templateLoaded = true;
        };

        $rootScope.$on('view.change', function(e, state){

            $scope.state = state;

            if($scope.state === 'discovery.charts.pastPerformance.expanded')
            {
                $scope.expanded = true;
                $scope.pastPerformanceViewChange = true;
            }
            else if($scope.state === 'discovery.charts.pastPerformance')
            {
                $scope.expanded = false;
                $scope.pastPerformanceViewChange = true;
            }
            else
            {
                $scope.expanded = false;
                $scope.pastPerformanceViewChange = false;
            }

            if(chartPastPerformanceService.chartIsBuilt() && $scope.templateLoaded)
            {

                if($scope.pastPerformanceViewChange && $scope.expanded === false)
                {
                    chartPastPerformanceService.destroyChart();
                    chartPastPerformanceService.setAspectRatio(0.6);
                    chartPastPerformanceService.setElement('pastPerformanceChart');
                    $scope.chart = chartPastPerformanceService.createChart();
                }
                else if($scope.pastPerformanceViewChange === true)
                {
                    chartPastPerformanceService.destroyChart();
                    chartPastPerformanceService.setAspectRatio(0.4);
                    chartPastPerformanceService.setElement('pastPerformanceChart');
                    $scope.chart = chartPastPerformanceService.createChart();
                }
            }

        });

        $scope.user = false;

        $rootScope.$on('profile.updated', function(e, profile){

            $scope.user = profile;

            $scope.updatePortfolioChart();

        });

        $rootScope.$on('breakpoint.new', function(breakpoint){
            chartPastPerformanceService.destroyChart();
            $scope.chart = chartPastPerformanceService.createChart();
        });

        $scope.initChart = function(response)
        {

            userService.getUserDataAsync().then(function(user){

                $scope.user = user;

                $scope.loadChart();

            });

        };

        $scope.initChart();

        $scope.getClass = function()
        {
            switch($scope.state) {

                case 'discovery.charts':

                    return 'animate-scale-down opacity opacity-0 z-index z-index-lowest';

                case 'discovery.charts.pastPerformance':

                    return 'animate-scale-up opacity opacity-1 z-index z-index-neutral';

                default:

                    return 'hidden';

            }

        };

        /**
         * Initialise the historic performance api data
         * @param response
         */
        $scope.loadChart = function (response) {

            chartPastPerformanceService.setYears(5);

            restService.getPastPerformance(5, $scope.state).then(function (response) {

                if($scope.templateLoaded && response !== false && !chartPastPerformanceService.chartIsBuilt())
                {

                    $scope.chartData = chartPastPerformanceService.setValues(response, $scope.user);

                    $scope.currentIndice = chartPastPerformanceService.getCurrentIndice();

                    if($scope.state === 'discovery.charts.pastPerformance.expanded')
                    {
                        chartPastPerformanceService.setAspectRatio(0.4);
                        $scope.expanded = true;
                    }
                    else
                    {
                        chartPastPerformanceService.setAspectRatio(0.6);
                        $scope.expanded = false;
                    }

                    chartPastPerformanceService.setElement('pastPerformanceChart');

                    $scope.chart = chartPastPerformanceService.createChart();

                }

            });
        };

        /**
         * Update the chart when updateProfile triggered
         * @param response
         */
        $scope.updatePortfolioChart = function (response) {

            var years = chartPastPerformanceService.getYears();

            restService.getPastPerformance(years, $scope.state).then(function (response) {

                if(response !== false && chartPastPerformanceService.chartIsBuilt())
                {

                    $scope.chartData = chartPastPerformanceService.setValues(response, $scope.user);

                    $scope.chart = chartPastPerformanceService.updatePortfolioChart();

                }

            });
        };

        $scope.updateChartIndice = function(indice)
        {
            $scope.currentIndice = indice;

            chartPastPerformanceService.updateChartIndice(indice);

        };

    }]);