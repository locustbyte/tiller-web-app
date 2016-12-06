'use strict';

angular.module('tillerWebApp')
    .controller('activation.empStatusCtrl', ['$scope', '$sessionStorage', '$controller', 'onboardingProfileService', function ($scope, $sessionStorage, $controller, onboardingProfileService) {

        $controller('activationCtrl', { $scope: $scope });

        $scope.employmentOptions = [];

        $scope.annualIncome = "";
        $scope.monthlyDisposableIncome = "";

        onboardingProfileService.initiateProfileCreation()
            .then(function success(response) {
                $scope.employmentOptions = response.data.employmentStatusTypes.map(function(obj) {
                    return { id: obj.employmentStatusTypeId, value: obj.employmentStatus };
                });
                $scope.updateSelectFromProfile();
            });

        $scope.selectEmploymentStatus = function(employmentStatus) {
            $scope.profile.employmentStatusTypeId = employmentStatus.id;
        };

        $scope.updateSelectFromProfile = function () {

            if (!$scope.profile)
                return;

            $scope.selectedEmploymentStatus = $.grep($scope.employmentOptions, function (a) {
                return a.id === $scope.profile.employmentStatusTypeId;
            })[0];

        };

        $scope.initialiseProfileData = function () {
            $scope.updateSelectFromProfile();
            $scope.annualIncome = $scope.profile.annualIncome == null ? "" : $scope.profile.annualIncome;
            $scope.monthlyDisposableIncome = $scope.profile.monthlyDisposableIncome == null ? "" : $scope.profile.monthlyDisposableIncome;
        };

        $scope.setIncome = function () {
            $scope.profile.annualIncome = $scope.annualIncome;
        }

        $scope.setDisposableIncome = function () {

            var test = parseFloat($scope.monthlyDisposableIncome, 10).toFixed(2);

            $scope.profile.monthlyDisposableIncome = $scope.monthlyDisposableIncome;
        };

        //todo: to directive
        var isMoney = function (evt) {
            var charCode = (evt.which) ? evt.which : event.keyCode
            if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46)
                return false;
            if (charCode == 46 && evt.target.value.indexOf('.') != -1) //only one decimal point
                return false;
            if (evt.target.value.indexOf('.') != -1 && evt.target.value.indexOf('.') < evt.target.value.length - 2) //only 2 decimal places
                return false;
            //if (charCode == 48 && evt.target.value.length == 0) //can't start with zero ..doesn't work as user might want to enter zero only
            //    return false;
            return true;
        };

        //todo: to directive
        $scope.validateMoney = function (e) {
            if (!isMoney(e))
                e.preventDefault();
        }

        $scope.allValid = function () {
            return $scope.profile != null &&
                $scope.monthlyDisposableIncome != "" && $scope.monthlyDisposableIncome &&
                $scope.annualIncome != "" && $scope.annualIncome &&
                $scope.profile.employmentStatusTypeId && $scope.profile.employmentStatusTypeId > 0
        };

    }]);