
'use strict';

angular.module('tillerWebApp')

    .controller('portfolioIncomeDurationCtrl', ['$scope', '$controller', 'sliderService', function ($scope, $controller, sliderService) {

        $controller('portfolioCtrl', { $scope: $scope });

        $scope.initialiseSliderData = function () {

            $scope.portfolio.initialIncomeDuration = $scope.portfolio.initialIncomeDuration ? $scope.portfolio.initialIncomeDuration : 10;

            sliderService.setSliderData('portfolioIncomeDuration', $scope.portfolio.initialIncomeDuration);
        };

        //Income duration slider set up
        $scope.portfolioIncomeDurationModel = {
            min: 3,
            max: 30,
            change: function (value) {
                $scope.portfolio.initialIncomeDuration = value;
            }
        };
        sliderService.setSliderModel('portfolioIncomeDuration', $scope.portfolioIncomeDurationModel);
        $scope.setNoIncomeDuration = function () {
            $scope.resetSlider("portfolioIncomeDuration");
        };

    }]);