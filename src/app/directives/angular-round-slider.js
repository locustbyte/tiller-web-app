angular.module('ui.tiller-sliders')
    .directive('roundSlider', ['$timeout', function($timeout) {

        return {
            restrict: 'EA',
            replace: true,
            template: '<input value="{{ sliderData.value }}"/>',
            scope: {
                sliderData: '=sliderData',
                sliderModel: '&'
            },
            link: function($scope, $element) {
                var sliderInit = $scope.sliderModel() || {};
                var _value;

                sliderInit.change = function(newValue) {
                    if(newValue.value != undefined) {
                        $scope.sliderData.value = newValue.value;
                        _value = newValue;
                        $scope.$apply();
                    }
                };

                $($element).val($scope.sliderData.value).roundSlider(sliderInit);
            }
        };
    }]);

    /*.directive('tillerSlider', ['$timeout', function($timeout) {
        'use strict';

        return {
            restrict: 'EA',
            replace: true,
            template: '<div class="tiller-round-slider" style="width:{{sliderModel().radius * 2}}px">'
                    + '  <input class="slider-hidden-value" value="{{ sliderData.value }}"/>'
                    + '  <input class="slider-value" value="£100,000" maxlength="10"/>'
                    + '  <div class="slider-label">per month</div>'
                    + '</div>',
            scope: {
                sliderData: '=sliderData',
                sliderModel: '&'
            },
            link: function($scope, $element) {
                var sliderInit = $scope.sliderModel() || {};
                var _value;

                sliderInit.change = function(newValue) {
                    if(newValue.value != undefined) {
                        $scope.sliderData.value = newValue.value;
                        _value = newValue;
                        $scope.$apply();
                    }
                };

                $($element.find('.slider-hidden-value')).val($scope.sliderData.value).roundSlider(sliderInit);
            }
        };
    }]);*/
