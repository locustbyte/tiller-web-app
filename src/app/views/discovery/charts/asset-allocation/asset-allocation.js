'use strict';

angular.module('tillerWebApp')

    .controller('discovery.charts.assetAllocationCtrl', ['$scope', '$timeout', 'restService', '$localStorage', 'chart.assetAllocationService', '$rootScope', 'chart.responsiveService', 'userService', function ($scope, $timeout, restService, $localStorage, chartAssetAllocationService, $rootScope, chartResponsiveService, userService) {

        $scope.state = 'discovery.charts';

        $rootScope.$on('view.change', function(e, state){

            $scope.state = state;

        });

        /**
         * Reload the asset allocation chart daat when the user profile is updated
         */
        $rootScope.$on('profile.updated', function(e, profile){

            $scope.user = profile;

            $scope.reloadAllocations();

        });

        /**
         * Destroy and rebuild the chart on resize to new breakpoint
         */
        $rootScope.$on('breakpoint.new', function(data){
            chartAssetAllocationService.destroy();
            chartAssetAllocationService.createChart($scope.element, $scope.data);
        });

        $scope.sessionData = function (response) {

            userService.getUserDataAsync().then(function(user){

                $scope.user = user;

                $scope.allocationParams = {
                    "take": 100
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