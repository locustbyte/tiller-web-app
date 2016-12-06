/*angular.module('ui.tiller-sliders')
    
    .directive('tillerDiscoverySliderOLD', ['validationService', '$timeout', '$rootScope', function(validationService, $timeout, $rootScope) {

        return {
            restrict: 'E',
            replace: false,
            templateUrl: 'components/tiller-discovery-slider.html',
            scope: {
                customOptions: '=',
                sliderData: '=',
                sliderModel: '=',
                sliderChange: '=',
                validationModel: '=',
                valueFormatter: '@',
                label: '@',
                zeroValueLabel: '@',
                sliderKey: '@',
                backButtonCallback: '=',
                backButtonTitle: '@'
            },
            link: function($scope, $element) {

                $scope.dragging = false;
                $scope.dragstart = false;
                $scope.dragend = false;

                
                //Set option defaults
                //@type {{buttons: boolean}}
                //
                $scope.options = {
                    buttons: true,
                    input: true,
                    radius: 140
                };

                if($scope.customOptions !== undefined)
                {
                    angular.extend($scope.options, $scope.customOptions);
                }

                var sliderOptions = {
                    min: 1,
                    max: 100,
                    step: 1,
                    value: null,
                    radius: $scope.options.radius,
                    width: 5,
                    handleSize: "+18",
                    startAngle: 90,
                    endAngle: "+360",
                    animation: true,
                    showTooltip: true,
                    editableTooltip: true,
                    readOnly: false,
                    disabled: false,
                    keyboardAction: true,
                    mouseScrollAction: false,
                    sliderType: "min-range",
                    circleShape: "full",
                    handleShape: "dot",
                    lineCap: "round"
                };

                if($scope.sliderModel) {
                    sliderOptions = angular.extend(sliderOptions, $scope.sliderModel);
                    // set validation model
                    // $scope.validationModel = {
                    //     rule: $scope.sliderModel.validationModel || null,
                    //     isValid: true
                    // }
                }

                var createScale = function(min, max, scaleBounds) {
                    var sliderScale = [];
                    total = Math.floor(min/scaleBounds[0].increment) * scaleBounds[0].increment
                    sliderScale.push(total);
                    do {
                        for(var i=0; i < scaleBounds.length; i++) {
                        if(total < scaleBounds[i].threshold || scaleBounds[i].threshold === null) {
                            total += scaleBounds[i].increment;
                            sliderScale.push(total);
                            break;
                        }
                        }
                    } while (total < max);
                    return sliderScale;
                };

                var getSliderValue = function(amount) {
                    if(sliderOptions.scaleBounds) {
                        for(var i=0; i<sliderScale.length; i++) {
                            if(sliderScale[i] >= amount) {
                                return i;
                            }
                        }
                    }
                    else {
                        return amount;
                    }
                };

                var sliderScale;

                if(sliderOptions.scaleBounds) {
                    sliderScale = createScale(sliderOptions.min, sliderOptions.max, sliderOptions.scaleBounds);
                    sliderOptions.min = 0;
                    sliderOptions.max = getSliderValue(sliderOptions.max);
                    $scope.sliderData.value = getSliderValue($scope.sliderData.value);
                };

                var getAmount = function(sliderValue) {
                    if(sliderOptions.scaleBounds) {
                        return sliderScale[sliderValue];
                    }
                    else {
                        return sliderValue;
                    }
                };

                var getMinValue = function() {
                    if(sliderOptions.scaleBounds) {
                        return sliderScale[0];
                    }
                    else {
                        return sliderOptions.min;
                    }
                };

                var getMaxValue = function() {
                    if(sliderOptions.scaleBounds) {
                        return sliderScale[sliderScale.length - 1];
                    }
                    else {
                        return sliderOptions.max;
                    }
                };

                var validateInput = function(value) {

                    if($scope.validationModel) {

                        $scope.validationModel.isValid = validationService.validate($scope.validationModel.rule, value);
                        //console.log($scope.validationModel.rule.propertyName + ' is valid?: ', $scope.validationModel.isValid)
                    }

                    return true;

                };

                $scope.setSliderValue = function() {
                    var value = $scope.sliderData.formattedValue.replace(/[^0-9]/g,"");

                    if(!value.length) {
                        value = getMinValue();
                    }
                    else {
                        value = parseInt(value);
                    }

                    if(value < getMinValue()) {
                        value = getMinValue();
                    }
                    else if (value > getMaxValue()) {
                        value = getMaxValue();
                    }

                    $scope.sliderData.formattedValue = formatMoney(value);
                    $scope.sliderData.value = getSliderValue(value);
                    $scope.sliderChange($scope.sliderKey, $scope.sliderData);
                };

                $scope.filterKeys = function(e) {
                    if(e.keyCode === 8 && $scope.sliderData.formattedValue.length <= 1) {
                        e.preventDefault();
                        return false;
                    }
                    if(e.keyCode === 13) {
                        e.target.blur();
                    }
                    if(e.keyCode != 13 && e.keyCode != 8 && e.keyCode != 9 && e.keyCode != 37 && e.keyCode != 39 && !(e.keyCode >= 48 && e.keyCode <= 57)) {
                        e.preventDefault();
                        return false;
                    }
                };

                if($scope.valueFormatter === 'currency') {
                    $scope.sliderData.formattedValue = formatMoney(getAmount($scope.sliderData.value));
                }
                else {
                    $scope.sliderData.formattedValue = $scope.sliderData.value;
                }

                var addHandleLabel = function() {
                    var $handle = $element.find('.rs-handle-dot');
                    var $handleLabel = $("<div class='handle-label'>" + $scope.sliderData.value + "</div>");
                    $handle.empty().append($handleLabel);
                    var style = $($element.find('.rs-first')).attr('style');
                    var angle = style.substring(style.indexOf('rotate(') + 7);
                    angle = angle.substring(0, angle.indexOf('deg)'));
                    $handleLabel.css('transform', 'rotate(' + (parseFloat(angle) * -1) + 'deg)');
                };

                var updateValue = function(sliderValue) {

                    //add handle label on slider-chart
                    //if($element.hasClass('slider-chart')) {
                    //    addHandleLabel();
                    //}

                    $scope.sliderData.value = sliderValue;
                    if($scope.valueFormatter === 'currency') {
                        $scope.sliderData.formattedValue = formatMoney(getAmount(sliderValue));
                    }
                    else {
                        $scope.sliderData.formattedValue = sliderValue;
                    }

                    $scope.sliderData.numericValue = getAmount(sliderValue);

                    validateInput(getAmount(sliderValue));

                    $scope.sliderModel.change(getAmount(sliderValue));

                    //$scope.$apply();
                };

                sliderOptions.change = function(e) {
                    updateValue(e.value);
                    $scope.sliderChange($scope.sliderKey, $scope.sliderData);
                };

                sliderOptions.drag = function(e) {
                    updateValue(e.value);
                };

                sliderOptions.start = function() {
                    $scope.dragging = true;
                    $scope.dragstart = true;
                    $scope.dragend = false;
                    $scope.$apply();
                    $timeout(function() {
                        $scope.dragstart = false;
                    },1000);
                    if($scope.sliderModel && $scope.sliderModel.start) {
                        $scope.sliderModel.start();
                    }
                };

                sliderOptions.stop = function() {
                    $scope.dragging = false;
                    $scope.dragend = true;
                    $scope.dragstart = false;
                    $scope.$apply();
                    $timeout(function() {
                        $scope.dragend = false;
                    },1000);
                    if($scope.sliderModel && $scope.sliderModel.stop) {
                        $scope.sliderModel.stop();
                    }
                };

                function formatMoney(value) {
                    return '£' + value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                }

                $scope.incSliderValue = function() {

                    // increment slider by 1 unit

                    var value = parseInt($scope.sliderData.value, 10) + 1;

                    updateValue(value);
                    $scope.sliderChange($scope.sliderKey, $scope.sliderData);

                };

                $scope.decSliderValue = function() {

                    // decrement slider by 1 unit

                    var value = parseInt($scope.sliderData.value, 10) - 1;

                    updateValue(value);
                    $scope.sliderChange($scope.sliderKey, $scope.sliderData);

                };

                // TODO
                //
                //    Need to check if this is the correct way of doing things in angular?
                //    Objective: When toggling the checkbox in parent directive which sets the slider value we also
                //    need to update the formatted value which is displayed in the text box
                
                $scope.$watch('sliderData.value', function() {

                    updateValue($scope.sliderData.value);

                });

                //initialize slider plugin
                $($element.find('.slider-hidden-value')).val($scope.sliderData.value).roundSlider(sliderOptions);

                //if($element.hasClass('slider-chart')) {
                //    addHandleLabel();
                //}
                
                //watch for class changes (only works in modern browsers + IE11)
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.attributeName === "class") {
                            var classAttribute = $(mutation.target).prop(mutation.attributeName);
                            //class attribute changed
                            if(classAttribute.indexOf('slider-chart') !== -1) {
                                addHandleLabel();
                            }
                        }
                    });
                });    
                observer.observe($element[0],  {
                    attributes: true
                });




            }
        };
    }]);
*/