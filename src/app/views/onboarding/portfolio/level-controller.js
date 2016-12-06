
'use strict';

angular.module('tillerWebApp')

    //Currently shared between growth and income
    .controller('portfolioLevelCtrl', ['$scope', '$controller', 'sliderService', function ($scope, $controller, sliderService) {

        $controller('portfolioCtrl', { $scope: $scope });

        $scope.initialiseSliderData = function () {
            sliderService.setSliderData('portfolioLumpSum', $scope.portfolio.initialAmount || 500);
        };

        //Lump Sum slider set up
        $scope.portfoliolumpSumModel = {
            min: 5000,
            max: 10000000,
            scaleBounds: [
                { "increment": 500, "threshold": 5000 },
                { "increment": 1000, "threshold": 20000 },
                { "increment": 5000, "threshold": 50000 },
                { "increment": 10000, "threshold": 250000 },
                { "increment": 25000, "threshold": 500000 },
                { "increment": 100000, "threshold": 1000000 },
                { "increment": 500000, "threshold": null }
            ],
            change: function (value) {
                $scope.portfolio.initialAmount = value;
            }
        };
        sliderService.setSliderModel('portfolioLumpSum', $scope.portfoliolumpSumModel);

    }]);