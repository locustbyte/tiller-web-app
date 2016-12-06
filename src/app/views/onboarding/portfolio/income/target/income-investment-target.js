
'use strict';

angular.module('tillerWebApp')

    .controller('portfolioIncomeTargetCtrl', ['$scope', '$controller', 'sliderService', function ($scope, $controller, sliderService) {

        $controller('portfolioCtrl', { $scope: $scope });

        $scope.initialiseSliderData = function () {
            sliderService.setSliderData('portfolioIncomeTarget', $scope.portfolio.initialIncomeAmount || 10000);
        };

        //Income target slider set up
        $scope.portfolioIncomeTargetModel = {
            min: 0,
            max: 50000,
            scaleBounds: [
                { "increment": 1000, "threshold": 20000 },
                { "increment": 5000, "threshold": 100000 },
                { "increment": 10000, "threshold": 300000 },
                { "increment": 50000, "threshold": null }
            ],
            change: function (value) {
                $scope.portfolio.initialIncomeAmount = value;
            }
        };
        sliderService.setSliderModel('portfolioIncomeTarget', $scope.portfolioIncomeTargetModel);
        $scope.setNoIncomeTarget = function () {
            $scope.portfolio.initialIncomeAmount = 0;
            $scope.resetSlider("portfolioIncomeTarget");
        };
    }]);