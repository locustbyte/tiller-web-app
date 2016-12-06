
'use strict';

angular.module('tillerWebApp')

    .controller('portfolioGrowthTargetCtrl', ['$scope', '$controller', 'sliderService', function ($scope, $controller, sliderService) {

        $controller('portfolioCtrl', { $scope: $scope });

        $scope.initialiseSliderData = function () {
            sliderService.setSliderData('portfolioGrowthTarget', $scope.portfolio.initialTargetAmount || 10000);
        };

        //Growth target slider set up
        $scope.portfolioGrowthTargetModel = {
            min: 0,
            max: 50000000,
            scaleBounds: [
                { "increment": 1000, "threshold": 20000 },
                { "increment": 5000, "threshold": 100000 },
                { "increment": 10000, "threshold": 300000 },
                { "increment": 50000, "threshold": 2000000 },
                { "increment": 100000, "threshold": 10000000 },
                { "increment": 1000000, "threshold": null }
            ],
            change: function (value) {
                $scope.portfolio.initialTargetAmount = value;
            }
        };
        sliderService.setSliderModel('portfolioGrowthTarget', $scope.portfolioGrowthTargetModel);
        $scope.setNoGrowthTarget = function () {
            $scope.portfolio.initialTargetAmount = 0;
            $scope.resetSlider("portfolioGrowthTarget");
        };

    }]);