'use strict';

angular.module('tillerWebApp')
    .controller('activation.bankDetailsCtrl', ['$scope', '$sessionStorage', '$controller', function ($scope, $sessionStorage, $controller) {

        $controller('activationCtrl', { $scope: $scope });

        $scope.patterns = {
            accountNumber: '[0-9]{8}',
            sortCode: '[0-9]{2}'
        };

        $scope.sortCodes = ['', '' , ''];

        $scope.setPaymentDetails = function()
        {
            $scope.profile.paymentDetails[0].accountName = '';
            $scope.profile.paymentDetails[0].nameOnAccount = '';
            $scope.profile.paymentDetails[0].bicAddress = '';
        };


        $scope.setSortCode = function () {
            if ($scope.profile.paymentDetails && $scope.profile.paymentDetails.length > 0 && $scope.profile.paymentDetails[0].sortCode !== undefined) {
                var sortCodeSegments = $scope.profile.paymentDetails[0].sortCode.split('-');

                for (i = 0; i < sortCodeSegments.length; i++) {
                    $scope.sortCodes[i] = sortCodeSegments[i];
                }
            } else {
                $scope.profile.paymentDetails = [{}];
                $scope.setPaymentDetails();
                $scope.updateSortCode();
            }
        };

        $scope.initialiseProfileData = function () {
            $scope.setSortCode();
        };

        $scope.updateSortCode = function()
        {
            $scope.profile.paymentDetails[0].sortCode = $scope.sortCodes[0] + '-' + $scope.sortCodes[1] + '-' + $scope.sortCodes[2];

            $scope.setPaymentDetails();
        };

        $scope.screenIsValid = function()
        {
            var isValid = true;

            angular.forEach($scope.profile.paymentDetails[0], function(value, key){

                switch(key) {

                    case 'sortCode':

                            isValid = /^(?!(?:0{6}|00-00-00))(?:\d{6}|\d\d-\d\d-\d\d)$/.test(value);

                        break;

                    case 'accountNumber':

                        if (value.length < 8 || isNaN(value)) {
                            isValid = false;
                        }

                        break;

                    case 'bankName':

                        if (value.length === 0) {
                            isValid = false;
                        }

                        break;
                }
            });


            return isValid;
        };

    }]);