'use strict';

angular.module('tillerWebApp')
    .controller('activation.aboutYourInvestmentCtrl', ['$scope', '$sessionStorage', '$controller', function ($scope, $sessionStorage, $controller) {

        $controller('activationCtrl', { $scope: $scope });

        $scope.financialSourceOptions = [
            {id: 1, value: 'Savings'},
            {id: 2, value: 'Excess salary'},
            {id: 3, value: 'Inheritance'},
            {id: 4, value: 'Existing investment'}
        ];

        $scope.financialSourceProportionOptions = [
            {id: 1, value: 'Less than 10%'},
            {id: 2, value: 'Between 10% and 35%'},
            {id: 3, value: 'Between 35% and 50%'},
            {id: 4, value: 'Between 50% and 75%'}
        ];

        $scope.selectFinancialSource = function(option) {
            $scope.profile.financialSourceId = option.id;
        };

        $scope.selectFinancialSourceProportion = function(option) {
            switch(option.id) {
                case 1:
                    $scope.profile.financialSourceProportion = 10;
                    break;
                case 2:
                    $scope.profile.financialSourceProportion = 35;
                    break;
                case 3:
                    $scope.profile.financialSourceProportion = 50;
                    break;
                case 4:
                    $scope.profile.financialSourceProportion = 75;
                    break;
            }
        };

        $scope.setPartOfRetirementPlanning = function(value) {
            $scope.profile.isPartPensionPlanning = value;
        }

        var getProportionPercentFromListOption = function(id) {
            switch (id) {
                case 2: return 35;
                case 3: return 50;
                case 4: return 75;
                default: return 10;
            }
        }

        $scope.screenIsValid = function() {
            if($scope.profile.financialSourceId > 0 && $scope.profile.financialSourceProportion > 0 && ($scope.profile.isPartPensionPlanning === true || $scope.profile.isPartPensionPlanning === false)) {
                return true;
            }
            else {
                return false;
            }
        }


        $scope.updateSelectFromProfile = function () {
            if ($scope.profile) {

                if($scope.profile.financialSourceId > 0) {
                    $scope.selectedFinancialSource = $.grep($scope.financialSourceOptions, function (a) {
                        return a.id === $scope.profile.financialSourceId;
                    })[0];
                }

                if($scope.profile.financialSourceProportion > 0) {
                    var selectedId;
                    switch($scope.profile.financialSourceProportion) {
                        case 35: selectedId = 2; break;
                        case 50: selectedId = 3; break;
                        case 75: selectedId = 4; break;
                        default: selectedId = 1; break;
                    }
                    $scope.selectedFinancialSourceProportion = $scope.financialSourceProportionOptions[selectedId-1];
                }
            }
        };

        $scope.initialiseProfileData = function () {
            $scope.updateSelectFromProfile();
        };



    }]);