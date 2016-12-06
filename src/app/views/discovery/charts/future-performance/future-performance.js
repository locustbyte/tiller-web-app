'use strict';

angular.module('tillerWebApp')

    .controller('discovery.charts.futurePerformanceCtrl', ['$scope', 'helperService', 'restService', 'chart.futurePerformanceService', '$rootScope', 'userService', 'PubSub', function ($scope, helperService, restService, chartFuturePerformanceService, $rootScope, userService, PubSub) {

        $scope.state = 'discovery.charts';

        $scope.chartData = {
            medians: {}
        };

        $rootScope.$on('view.change', function(e, state){

            $scope.state = state;

            if($scope.state === 'discovery.charts.futurePerformance.expanded')
            {
                $scope.expanded = true;
                chartFuturePerformanceService.destroyChart();
                chartFuturePerformanceService.setAspectRatio(0.4);
                $scope.chart = chartFuturePerformanceService.createChart($scope.chartElement, $scope.chartData);
            }
            else if($scope.expanded === true)
            {
                $scope.expanded = false;
                chartFuturePerformanceService.destroyChart();
                chartFuturePerformanceService.setAspectRatio(0.6);
                $scope.chart = chartFuturePerformanceService.createChart($scope.chartElement, $scope.chartData);
            }

        });

        $rootScope.$on('profile.updated', function(e, profile){

            $scope.user = profile;
            $scope.rebuildChart();

        });

        $rootScope.$on('breakpoint.new', function(breakpoint){
            chartFuturePerformanceService.destroyChart();
            $scope.chart = chartFuturePerformanceService.createChart($scope.chartElement, $scope.chartData);
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

                case 'discovery.charts.futurePerformance':

                    return 'animate-scale-up opacity opacity-1 z-index z-index-neutral';

                default:

                    return 'hidden';

            }

        };

        /**
         * Initialise the allocation api data
         * @param response
         */
        $scope.loadChart = function (response) {

            restService.getFuturePerformance($scope.state).then(function (response) {

                if(response !== false && !$scope.chartIsBuilt())
                {

                    $scope.chartData = chartFuturePerformanceService.setValues(response, $scope.user);

                    if($scope.state === 'discovery.charts.futurePerformance.expanded')
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

                    $scope.chart = chartFuturePerformanceService.createChart($scope.chartElement, $scope.chartData);

                }

            });

        };

        /**
         * Initialise the allocation api data
         * @param response
         */
        $scope.rebuildChart = function (response) {

            restService.getFuturePerformance($scope.state).then(function (response) {

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