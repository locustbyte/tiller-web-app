'use strict';

angular.module('tillerWebApp')

    .controller('onboardingInvestment.profilingCtrl', ['$scope', '$rootScope', 'sliderService', function ($scope, $rootScope, sliderService) {

        $scope.state = 'onboarding-investment';
        sliderService.enableReRouting = true;

        $rootScope.$on('view.change', function(e, state){

            $scope.state = state;

        });

        $scope.getClass = function()
        {

            if($scope.state.indexOf('onboarding-investment.charts') !== -1) {

                return 'relative-grid-tether relative-grid-col-1';

            }

            return 'width width-full height height-full';

        };

        $scope.getSliderClass = function(sliderName) {

            if($scope.state.indexOf('onboarding-investment.charts') !== -1) {
                if($scope.state.indexOf('expanded') !== -1) {
                    return 'slider-compact';
                } 
                else if(sliderName === 'total-years' || sliderName === 'history') {
                    return 'slider-chart';
                }
                else {
                    return 'slider-compact';
                }
            } else {
                return 'slider-compact';
            }

        };

        $scope.getNxtPrvClass = function()
        {
            if($scope.state.indexOf('onboarding-investment.profiling') !== -1) {

                return 'display display-block';

            }

            return 'display display-none';
        };

        $scope.goToLumpSumSlider = function() {
            sliderService.navigateToSlider('lump-sum');
        };

        $scope.goToTopUpSlider = function() {
            sliderService.navigateToSlider('top-up');
        };

        $scope.goToTargetSlider = function() {
            sliderService.navigateToSlider('target');
        };

    }]);