
'use strict';

angular.module('tillerWebApp')

    //Currently shared between growth and income
    .controller('portfolioTopUpCtrl', ['$scope', '$controller', 'sliderService', function ($scope, $controller, sliderService) {

        $controller('portfolioCtrl', { $scope: $scope });

        $scope.initialiseSliderData = function () {
            sliderService.setSliderData('portfolioTopUp', $scope.portfolio.initialTopUp || 0);
        };

        //Top up slider set up
        $scope.portfolioTopUpModel = {
            min: 0,
            max: 100000,
            scaleBounds: [
                { "increment": 50, "threshold": 2000 },
                { "increment": 100, "threshold": 5000 },
                { "increment": 500, "threshold": 10000 },
                { "increment": 1000, "threshold": 30000 },
                { "increment": 5000, "threshold": null }
            ],
            change: function (value) {
                $scope.portfolio.initialTopUp = value;
            }
        };
        sliderService.setSliderModel('portfolioTopUp', $scope.portfolioTopUpModel);
        $scope.setNoTopUp = function () {
            $scope.portfolio.initialTopUp = 0;
            $scope.resetSlider("portfolioTopUp");
        }

    }]);