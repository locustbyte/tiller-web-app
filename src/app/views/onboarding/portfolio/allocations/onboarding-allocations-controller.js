
'use strict';

angular.module('tillerWebApp')

    .controller('onboardingAllocationsCtrl', ['$scope', '$controller', 'sliderService', function ($scope, $controller, sliderService) {

        $controller('portfolioCtrl', { $scope: $scope });

        //The idea here is that if the user has previously (in discovery) selected an allocation type then they get a
        //confirmation dialog on this screen if they change it to a different type.
        $scope.selectedAllocationModelType = null;
        var setSelectedAllocationModelType = function () {
            if ($scope.portfolio.allocationModelTypeId === 1)
                $scope.selectedAllocationModelType = "Tracker";
            else if ($scope.portfolio.allocationModelTypeId === 2)
                $scope.selectedAllocationModelType = "Active";
            else if ($scope.portfolio.allocationModelTypeId === 3)
                $scope.selectedAllocationModelType = "Active+";
        };
        setSelectedAllocationModelType();

        $scope.showModal = function ($event) {
            if ($scope.selectedAllocationModelType !== null)
                $scope.modalShown = true;
        };

        $scope.modalShown = false;

        $scope.review = function () {
            $scope.modalShown = false;
            $scope.portfolio.allocationModelTypeId = null;
            $scope.selectedAllocationModelType = null;
        };

        $scope.confirm = function () {
            $scope.modalShown = false;
            $scope.selectedAllocationModelType = null; // i.e. we're discounting any previous selection.
        };

    }]);