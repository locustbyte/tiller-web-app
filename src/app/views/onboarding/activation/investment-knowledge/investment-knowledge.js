'use strict';

angular.module('tillerWebApp')
    .controller('activation.investmentKnowledgeCtrl', ['$scope', '$sessionStorage', '$controller', 'onboardingProfileService', function ($scope, $sessionStorage, $controller, onboardingProfileService) {

        $controller('activationCtrl', { $scope: $scope });

		$scope.setUnderstandETFs = function (val) {
		    $scope.profile.isMarketAware = val;
		};

		$scope.setUnderstandDiff = function (val) {
		    $scope.profile.isAssetClassAware = val;
		};

		$scope.initialiseProfileData = function () {
		    //implemented but not necessary. Todo: don't force inheriting controllers to implement.
		};

		$scope.allValid = function () {
		    return $scope.profile != null &&
                $scope.profile.isMarketAware != null &&
                $scope.profile.isAssetClassAware != null;
		}

    }]);