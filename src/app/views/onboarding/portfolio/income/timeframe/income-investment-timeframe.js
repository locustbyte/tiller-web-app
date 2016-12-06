
'use strict';

angular.module('tillerWebApp')

    .controller('portfolioIncomeTimeframeCtrl', ['$scope', '$rootScope', '$controller', 'sliderService', function ($scope, $rootScope, $controller, sliderService) {

        $controller('portfolioCtrl', { $scope: $scope });

        $scope.reset = false;

        $scope.initialiseSliderData = function () {

            $scope.portfolio.initialYearsToIncomeGeneration = $scope.portfolio.initialYearsToIncomeGeneration ? $scope.portfolio.initialYearsToIncomeGeneration : 10;

            sliderService.setSliderData('portfolioIncomeTimeFrame', $scope.portfolio.initialYearsToIncomeGeneration);
        };

        //Income time frame set up (i.e. years until income start)
        $scope.portfolioIncomeTimeFrameModel = {
            min: 1,
            max: 40,
            change: function (value) {
                $scope.portfolio.initialYearsToIncomeGeneration = value;
            }
        };
        sliderService.setSliderModel('portfolioIncomeTimeFrame', $scope.portfolioIncomeTimeFrameModel);

        $scope.setTimeFrame = function () {
            $scope.portfolio.initialYearsToIncomeGeneration = 10;
            $scope.resetSlider('portfolioIncomeTimeFrame');
        };

    }]);