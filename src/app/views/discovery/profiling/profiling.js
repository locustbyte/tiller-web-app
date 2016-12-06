'use strict';

angular.module('tillerWebApp')

    .controller('discovery.profilingCtrl', ['$scope', '$rootScope', 'sliderService', function ($scope, $rootScope, sliderService) {

        $scope.state = 'discovery';
        sliderService.enableReRouting = true;

        $rootScope.$on('view.change', function(e, state){

            $scope.state = state;

        });

        $scope.getClass = function()
        {

            if($scope.state.indexOf('discovery.charts') !== -1) {

                return 'relative-grid-tether relative-grid-col-1';

            }

            return 'width width-full height height-full';

        };

        $scope.getSliderClass = function(sliderName) {

            if($scope.state.indexOf('discovery.profiling') != -1) {
                if($scope.state.indexOf('discovery.profiling.lumpSum') != -1) {
                    switch(sliderName) {
                        case 'lump-sum': return 'show-slider-controls';
                        default: return 'slider-minimised';
                    }
                }
                if($scope.state.indexOf('discovery.profiling.topUp') != -1) {
                    switch(sliderName) {
                        case 'lump-sum': return 'slider-historic';
                        case 'top-up': return 'show-slider-controls';
                        default: return 'slider-minimised';
                    }
                }
                if($scope.state.indexOf('discovery.profiling.target') != -1) {
                    switch(sliderName) {
                        case 'lump-sum': case 'top-up': return 'slider-historic';
                        case 'target': return 'show-slider-controls';
                        default: return 'slider-minimised';
                    }
                }
                if($scope.state.indexOf('discovery.profiling.totalYears') != -1) {
                    switch(sliderName) {
                        case 'lump-sum': case 'top-up': case 'target': return 'slider-historic';
                        case 'total-years': return 'show-slider-controls';
                        default: return 'slider-minimised';
                    }
                }

            } else if($scope.state.indexOf('discovery.charts') !== -1) {
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
            if($scope.state.indexOf('discovery.profiling') !== -1) {

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