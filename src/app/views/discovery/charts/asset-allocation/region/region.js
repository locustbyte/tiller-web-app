'use strict';

angular.module('tillerWebApp')

    .controller('discovery.charts.assetRegionCtrl', ['$scope', 'restService', 'chart.assetRegionService', '$rootScope', function ($scope, restService, chartAssetRegionService, $rootScope) {

        $scope.state = 'discovery.charts.assetAllocation.region';

        $rootScope.$on('view.change', function(e, state){

            $scope.state = state;

        });

        $rootScope.$on('profile.updated', function(e, profile){

            $scope.user = profile;

            $scope.reloadRegions();

        });

        $rootScope.$on('breakpoint.new', function(breakpoint){
            chartAssetRegionService.destroy();
            chartAssetRegionService.createChart($scope.element);
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
                    chartAssetRegionService.destroy();
                    chartAssetRegionService.createChart($scope.element);

                }

            });

        };

    }]);