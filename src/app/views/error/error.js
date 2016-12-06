
'use strict';

angular.module('tillerWebApp')

    //Currently shared between growth and income
    .controller('errorCtrl', ['$scope', '$window', 'errorService', function ($scope, $window, errorService) {


        $scope.error = errorService.getError();

        $scope.goBack = function()
        {
            $window.history.back();
        }

    }]);