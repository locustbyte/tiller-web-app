
'use strict';

angular.module('tillerWebApp')

    .controller('portfolioGrowthDurationCtrl', ['$scope', '$controller', 'sliderService', function ($scope, $controller, sliderService) {

        $controller('portfolioCtrl', { $scope: $scope });

        $scope.initialiseSliderData = function () {
            sliderService.setSliderData('portfolioGrowthDuration', $scope.portfolio.initialYearsToInvest || 10);
        };

        //Growth duration slider set up
        $scope.portfolioGrowthDurationModel = {
            min: 1,
            max: 40,
            change: function (value) {
                $scope.portfolio.initialYearsToInvest = value;
            }
        };
        sliderService.setSliderModel('portfolioGrowthDuration', $scope.portfolioGrowthDurationModel);
        $scope.setNoGrowthDuration = function () {
            $scope.portfolio.initialYearsToInvest = 0;
            $scope.resetSlider("portfolioGrowthDuration");
        };

    }]);