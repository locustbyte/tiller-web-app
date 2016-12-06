angular.module('ui.tiller-sliders')
    
    .directive('tlDoubleRoundSlider', ['validationService', function(validationService) {

        return {
            restrict: 'E',
            replace: false,
            templateUrl: 'components/tl-double-round-slider.html',
            scope: {
                customOptions: '=',
                sliderData: '=',
                sliderModel: '=',
                sliderChange: '=',
                validationModel: '=',
                sliderKey: '@'
            },
            link: function($scope, $element) {

                $scope.dragging = false;
                $scope.dragstart = false;
                $scope.dragend = false;
                $scope.hovering = false;

                $scope.options = {
                    buttons: true,
                    input: true,
                    radius: 140
                };

                var isTouchDevice = 'ontouchstart' in document.documentElement;

                var sliderOptions = {
                    radius: 140,
                    trackWidth: 5,
                    handleRadius: 10,
                    selectedHandleScaleFactor: 1.5,
                    padding: 30,
                    min: 0,
                    max: 10,
                    slider1Max: 5,
                    minSliderDifference: 1,
                    handleStyle: 'dot',
                    snapEaseFunction: 'quad'
                };

                if($scope.sliderModel) {
                    sliderOptions = angular.extend(sliderOptions, $scope.sliderModel);
                    // set validation model
                    // $scope.validationModel = {
                    //     rule: $scope.sliderModel.validationModel || null,
                    //     isValid: true
                    // }
                }

                if($($element).hasClass('slider-compact')) {
                    $scope.sliderType = 'compact';
                    sliderOptions.handleRadius = 20;
                    sliderOptions.selectedHandleScaleFactor = 1;
                }
                else if($($element).hasClass('slider-chart')) {
                    $scope.sliderType = 'chart';
                }
                else {
                    $scope.sliderType = 'normal';
                }

                var defaultOptions = angular.copy(sliderOptions);

                var validateInput = function(value) {
                    if($scope.validationModel) {
                        $scope.validationModel.isValid = validationService.validate($scope.validationModel.rule, value);
                    }
                    return true;
                };

                //method to call the sliderChange callback function if one is passed to the directive
                $scope.sliderChangeCallback = function(sliderKey, sliderData) {  
                    if(typeof $scope.sliderChange === 'function') {
                        $scope.sliderChange(sliderKey, sliderData);
                    }
                };

                //method to update the sliderData model and call the change callback
                var updateValue = function(sliderData) {
                    $scope.sliderData.value1 = sliderData[0].value;
                    $scope.sliderData.value2 = sliderData[1].value;
                    $scope.sliderModel.change($scope.sliderData);
                };

                //draw the various svg elements to create the slider
                var trackRadius = sliderOptions.radius - (sliderOptions.trackWidth/2);
                
                var sliderData = initSlider();

                $scope.$watch('sliderData', function(newValue) {
                    if(Array.isArray(sliderData) && (newValue.value1 != sliderData[0].value || newValue.value2 != sliderData[1].value))
                    {
                        //update the sliderData object
                        updateSliderData();

                        //update the slider handle locations/labels in d3
                        updateSliderHandles();
                    }
                });

                var drag = d3.behavior.drag()
                    .origin(function(d) { return d; })
                    .on('dragstart', dragstarted)
                    .on('drag', dragged)
                    .on('dragend', dragended);

                var width = ((sliderOptions.radius + sliderOptions.padding) * 2);
                var height = ((sliderOptions.radius + sliderOptions.padding) * 2);
                
                var svg = d3.select($($element).find('svg.round-slider')[0])
                    .attr('width', '100%')
                    .attr('height', '100%')
                    .attr('viewBox', [0, 0, width, height].join(' '))
                    .attr('preserveAspectRatio', 'xMidYMid meet')
                    .append('g')
                    .attr('transform', 'translate(' + (sliderOptions.radius + sliderOptions.padding) + ',' + (sliderOptions.radius + sliderOptions.padding) + ')');

                var container = svg.append('g');

                var sliderTrack = container.append('circle')
                    .attr('r', trackRadius)
                    .attr('class', 'slider-track')
                    .attr('stroke-width', sliderOptions.trackWidth);

                var sliderCentre = container.append('circle')
                    .attr('r', trackRadius - (sliderOptions.trackWidth * 2))
                    .attr('class', 'slider-centre')
                    .attr('fill', 'transparent')

                var sliderContainer = container.append('g').attr('class', 'slider-group');

                var drawRangeArc = d3.svg.arc()
                                     .innerRadius(sliderOptions.radius - sliderOptions.trackWidth)
                                     .outerRadius(sliderOptions.radius)
                                     .startAngle(0)
                                     .endAngle(function(d) { return d.handleAngle; });

                var sliderRange = sliderContainer.selectAll('.slider-range-track')
                                        .data(sliderData)
                                        .enter()
                                        .append('path')
                                        .attr('d', drawRangeArc)
                                        .attr('class', function(d) { return 'slider-range-track slider-range-track' + (d.sliderIndex+1);});

                var handleCircle = sliderContainer.append('g')
                                             .classed('handle', true).call(drag);

                //add handle
                handleCircle.selectAll('.handle-circle')
                             .data(sliderData)
                             .enter().append('circle')
                             .attr('class', function(d) { return 'handle-circle handle-circle' + (d.sliderIndex+1);})
                             .attr('r', sliderOptions.handleRadius)
                             .attr('cx', function(d) { return d.x;})
                             .attr('cy', function(d) { return d.y;})
                             .call(drag);

                //add touch hidden handle if running on touch enabled device
                if(isTouchDevice) {
                    var hiddenTouchHandle = handleCircle.selectAll('.touch-hidden-handle')
                                                        .data(sliderData)
                                                        .enter().append('circle')
                                                        .attr('class', function(d) { return 'touch-hidden-handle touch-hidden-handle' + (d.sliderIndex+1);})
                                                        .classed('touch-hidden-handle', true)
                                                        .attr('r', 15)
                                                        .attr('cx', function(d) { return d.x;})
                                                        .attr('cy', function(d) { return d.y;})
                                                        .attr('opacity', 0)
                                                        .call(drag);
                }


                //add handle dot
                var handleDot = handleCircle.append('circle')
                                            .data(sliderData)
                                            .attr('class', function(d) { return 'handle-dot handle-dot' + (d.sliderIndex+1);})
                                            .attr('r', sliderOptions.handleRadius - sliderOptions.trackWidth)
                                            .attr('cx', function(d) { return d.x;})
                                            .attr('cy', function(d) { return d.y;})
                                            .call(drag);

                if($scope.sliderType === 'compact') {
                        svg.selectAll('.handle-circle, .handle-dot').attr('r', 0);
                }

                //add handle label
                var handleLabel = handleCircle.selectAll('.handle-label')
                                              .data(sliderData)
                                              .enter().append('text')
                                              .attr('class', function(d) { return 'handle-label handle-label' + (d.sliderIndex+1);})
                                              .attr('x', function(d) { return d.x;})
                                              .attr('y', function(d) { return d.y + 2.5;})
                                              .text(function (d) { return d.value })
                                              .attr('font-family', 'sans-serif')
                                              .attr('font-size', '8px')
                                              .style('text-anchor', 'middle')
                                              .attr('fill', 'white')
                                              .call(drag);

                //add handle pulse circle
                var handlePulse = handleCircle.selectAll('.handle-pulse')
                                              .data(sliderData)
                                              .enter().append('circle')
                                              .attr('class', function(d) { return 'handle-pulse handle-pulse' + (d.sliderIndex+1);})
                                              .attr('r', sliderOptions.handleRadius * sliderOptions.selectedHandleScaleFactor)
                                              .attr('cx', function(d) { return d.x;})
                                              .attr('cy', function(d) { return d.y;})
                                              .attr('opacity', 0)
                                              .call(drag);

                //add central slider label
                var sliderLabel = container.selectAll('text')
                                           .data(sliderData)
                                           .enter()
                                           .append('text');

                var textLabels = sliderLabel.classed('slider-label', true)
                                            .attr('x', function(d) { return d.cx; })
                                            .attr('y', function(d) { return d.cy; })
                                            .text(function (d) { return d.value })
                                            .attr('font-family', 'sans-serif')
                                            .attr('font-size', '20px')
                                            .style('text-anchor', 'middle')
                                            .attr('fill', 'red');

                //function to update the location of the slider handles
                function updateSliderHandles() {

                    //update the slider handle
                    svg.selectAll('.handle-circle, .touch-hidden-handle, .handle-dot, .handle-pulse')
                        .attr('cx', function (d) { return d.x; })
                        .attr('cy', function (d) { return d.y; });

                    //update the slider label
                    svg.selectAll('.handle-label')
                        .attr('x', function (d) { return d.x })
                        .attr('y', function (d) { return d.y + 2.5 })
                        .text(function (d) { return d.value });

                    //update the range arc
                    var drawRangeArc = d3.svg.arc()
                        .innerRadius(sliderOptions.radius - ((defaultOptions.trackWidth - sliderOptions.trackWidth)/2) - sliderOptions.trackWidth)
                        .outerRadius(sliderOptions.radius - ((defaultOptions.trackWidth - sliderOptions.trackWidth)/2))
                        .startAngle(0)
                        .endAngle(function(d) { return d.handleAngle; });
                    svg.selectAll('.slider-range-track').attr('d', drawRangeArc);

                }

                var sliderAngleDelta, sliderValueDelta;
                
                //this method is called when the handle dragging starts
                function dragstarted(d) {

                    var sliderNumber = d.sliderIndex + 1;

                    //if(sliderNumber === 1) {
                    //    sliderAngleDelta = (2 * Math.PI) / (sliderOptions.max - sliderOptions.min) * parseInt(sliderValueDelta);
                    //}

                    $scope.$apply(function() {
                        $scope.dragging = true;
                    });

                    d3.event.sourceEvent.stopPropagation();

                    //resize the handle
                    svg.selectAll('.handle-circle' + sliderNumber + ', .handle-dot' + sliderNumber)
                        .classed('dragging', true);
                    svg.select('.handle-circle' + sliderNumber)
                        .transition()
                        .duration(100)
                        .ease('quad')
                        .attr('r', sliderOptions.handleRadius * sliderOptions.selectedHandleScaleFactor);
                    svg.select('.handle-dot' + sliderNumber)
                        .transition()
                        .duration(100)
                        .ease('quad')
                        .attr('r', (sliderOptions.handleRadius * sliderOptions.selectedHandleScaleFactor) - sliderOptions.trackWidth);
                    svg.select('.handle-pulse' + sliderNumber)
                        .attr('r', sliderOptions.handleRadius * sliderOptions.selectedHandleScaleFactor)
                        .attr('opacity', 0);
                }

                //this method is called when the handle is being dragged
                function dragged(d) { 
                    
                    var sliderNumber = d.sliderIndex + 1;

                    //calculate mouse distance and angle using pythagoras
                    var distancefromOrigin = Math.sqrt(Math.pow(d3.event.x, 2) + Math.pow(d3.event.y, 2));
                    var alpha = Math.acos(d3.event.x/distancefromOrigin);
                    
                    //update the handle location data
                    var newX = trackRadius * Math.cos(alpha);
                    var newY = d3.event.y < 0 ? -trackRadius * Math.sin(alpha) : trackRadius * Math.sin(alpha);

                    var newAngle = calculateRotation(newX, newY);
                    var newValue = calculateValueFromRotation(newAngle);
                    var firstQuarterValue = calculateValueFromRotation(degToRad(90));
                    var lastQuarterValue = calculateValueFromRotation(degToRad(270));

                    if(sliderNumber === 1) { //validate movement of slider 1

                        if(d.value <= firstQuarterValue && newValue >= lastQuarterValue) {
                            //lock the handle at the minimum value position
                            var slider1MinValueCoords = calculateHandleLocationFromAngle(calculateRotationFromValue(sliderOptions.min));
                            d.x = slider1MinValueCoords.x;
                            d.y = slider1MinValueCoords.y;
                        }
                        else if(newValue > sliderOptions.slider1Max) {
                            //lock the handle at the slider1 maximum value position
                            var slider1MaxValueCoords = calculateHandleLocationFromAngle(calculateRotationFromValue(sliderOptions.slider1Max));
                            d.x = slider1MaxValueCoords.x;
                            d.y = slider1MaxValueCoords.y;
                        }
                        else if((newValue + sliderValueDelta) > sliderOptions.max) {
                            //lock the handle at the maximum value allowed to prevent slider 2 from going above the slider max value
                            var slider1MaxValueCoords2 = calculateHandleLocationFromAngle(calculateRotationFromValue(sliderOptions.max - sliderValueDelta));
                            d.x = slider1MaxValueCoords2.x;
                            d.y = slider1MaxValueCoords2.y;
                        }
                        else {
                            //move the handle to the current mouse position
                            d.x = newX;
                            d.y = newY;
                        }
                    }
                    else if(sliderNumber === 2) { //validate movement of slider 2
                        
                        var minValueAboveSlider1 = sliderData[0].value + sliderOptions.minSliderDifference;

                        if(newValue > minValueAboveSlider1) {
                            //move the handle to the current mouse position
                            d.x = newX;
                            d.y = newY;
                        }
                        else if(d.value >= lastQuarterValue && newValue <= firstQuarterValue) {
                            //lock the handle at the maximum value position
                            var slider2MaxValueCoords = calculateHandleLocationFromAngle(calculateRotationFromValue(sliderOptions.max));
                            d.x = slider2MaxValueCoords.x;
                            d.y = slider2MaxValueCoords.y;
                        }
                        else {
                            //lock the handle at the minimum value position above slider 1
                            var slider2MinValueCoords = calculateHandleLocationFromAngle(calculateRotationFromValue(minValueAboveSlider1));
                            d.x = slider2MinValueCoords.x;
                            d.y = slider2MinValueCoords.y;
                        }
                    }
                     
                    
                    //update the sliderData data object with the angle and value
                    var sliderAngle = calculateRotation(d.x, d.y);
                    var value = calculateValueFromRotation(sliderAngle);
                    d.handleAngle = sliderAngle;
                    d.value = parseInt(value.toFixed(0));

                    //if the first slider is moved then also move the second slider at the same time
                    if(sliderNumber === 1) {
                        
                        var slider2Location = calculateHandleLocationFromAngle(sliderAngle + sliderAngleDelta);
                        var slider2Angle = calculateRotation(sliderData[1].x, sliderData[1].y);
                        var slider2Value = calculateValueFromRotation(slider2Angle);

                        //update the sliderData data object for slider 2
                        sliderData[1].x = slider2Location.x;
                        sliderData[1].y = slider2Location.y;
                        sliderData[1].handleAngle = slider2Angle;
                        sliderData[1].value = parseInt(slider2Value.toFixed(0));
                    }

                    //update the slider handle locations/labels
                    updateSliderHandles();
 
                    //update input element
                    $scope.$apply(function () {
                        updateValue(sliderData);
                    });
                }

                //this method is called when the handle dragging ends
                function dragended(d) {
  
                    var sliderNumber = d.sliderIndex + 1;

                    if(sliderNumber === 1) {
                        //if the slider 1 has been dragged, ensure slider 2 value is set correctly
                        sliderData[1].value = sliderData[0].value + sliderValueDelta;
                    }
                    else if(sliderNumber === 2) {
                        //if the slider 2 has been dragged, then update the delta between the sliders
                        sliderValueDelta = sliderData[1].value - sliderData[0].value;
                        sliderAngleDelta = (2 * Math.PI) / (sliderOptions.max - sliderOptions.min) * parseInt(sliderValueDelta);
                    }

                    $scope.$apply(function() {
                        $scope.dragging = false;
                        //call the sliderChanged callback
                        $scope.sliderChangeCallback($scope.sliderKey, $scope.sliderData);
                    });

                    
                    svg.selectAll('.handle-circle' + sliderNumber + ', .handle-dot' + sliderNumber)
                            .classed('dragging', false);

                    //reduce the handle size
                    if($scope.sliderType === 'compact') {
                        if(!$scope.hovering) {
                            svg.selectAll('.handle-circle' + sliderNumber + ', .handle-dot' + sliderNumber)
                                .transition()
                                .attr('r', 0);
                        }
                    }
                    else {
                        svg.selectAll('.handle-circle' + sliderNumber)
                            .transition()
                            .attr('r', sliderOptions.handleRadius);
                        svg.selectAll('.handle-dot' + sliderNumber)
                            .transition()
                            .attr('r', sliderOptions.handleRadius - sliderOptions.trackWidth);
                    }
                    
                    
                    //show pulse animation
                    svg.selectAll('.handle-pulse' + sliderNumber)
                        .attr('r', sliderOptions.handleRadius * sliderOptions.selectedHandleScaleFactor)
                        .attr('opacity', .5)
                        .transition()
                        .duration(300)
                        .ease('linear')
                        .attr('r', (sliderOptions.handleRadius * sliderOptions.selectedHandleScaleFactor) + 5)
                        .attr('opacity', 0);
                    
                    
                    //snap slider path arc to nearest whole value location
                    var currentSliderAngle = calculateRotation(d.x, d.y);
                    var value = calculateValueFromRotation(currentSliderAngle).toFixed(0);
                    
                    //snap handle and range to nearest value with transition
                    var snappedSliderAngle = calculateRotationFromValue(value);
                    
                    svg.select('.slider-range-track' + sliderNumber).transition()
                                .duration(250)
                                .ease(sliderOptions.snapEaseFunction)
                                .attrTween('d', sliderTween(snappedSliderAngle));

                    if(sliderNumber === 1) {
                        slider2SnappedSliderAngle = calculateRotationFromValue(parseInt(value) + sliderValueDelta);

                        svg.select('.slider-range-track2').transition()
                                .duration(250)
                                .ease(sliderOptions.snapEaseFunction)
                                .attrTween('d', sliderTween(slider2SnappedSliderAngle));

                    }
                    
                }

                //function to set the initial values of the slider
                function initSlider() {

                    if($scope.sliderData && !$scope.sliderData.hasOwnProperty('value1')) {
                        $scope.sliderData.value1 = sliderOptions.min;
                    }
                    if($scope.sliderData && !$scope.sliderData.hasOwnProperty('value2')) {
                        $scope.sliderData.value2 = sliderOptions.min;
                    }

                    //setup the slider values
                    sliderOptions.value = $scope.sliderData.value1;
                    var angle = calculateRotationFromValue(sliderOptions.value);
                    var handleLocation = calculateHandleLocationFromAngle(angle);

                    //setup the second slider values
                    sliderOptions.value2 = $scope.sliderData.value2;
                    var angle2 = calculateRotationFromValue(sliderOptions.value2);
                    var handleLocation2 = calculateHandleLocationFromAngle(angle2);

                    //set the delta between the two sliders
                    sliderValueDelta = $scope.sliderData.value2 - $scope.sliderData.value1;
                    sliderAngleDelta = (2 * Math.PI) / (sliderOptions.max - sliderOptions.min) * parseInt(sliderValueDelta);
                    
                    return [
                        {
                            x: handleLocation.x,
                            y: handleLocation.y,
                            value: sliderOptions.value,
                            handleAngle: angle,
                            sliderIndex: 0
                        },
                        {
                            x: handleLocation2.x,
                            y: handleLocation2.y,
                            value: sliderOptions.value2,
                            handleAngle: angle2,
                            sliderIndex: 1
                        }
                    ];
                }

                //function to update the sliderData object from the $scope.sliderData model
                function updateSliderData() {

                    //setup the slider values
                    var slider1Value = $scope.sliderData.value1;
                    var slider1Angle = calculateRotationFromValue(slider1Value);
                    var slider1Location = calculateHandleLocationFromAngle(slider1Angle);

                    //setup the second slider values
                    var slider2Value = $scope.sliderData.value2;
                    var slider2Angle = calculateRotationFromValue(slider2Value);
                    var slider2Location = calculateHandleLocationFromAngle(slider2Angle);

                    //update the data object (we need to do this one property at a time for d3!)
                    sliderData[0].sliderIndex = 0;
                    sliderData[0].x = slider1Location.x;
                    sliderData[0].y = slider1Location.y;
                    sliderData[0].value = slider1Value;
                    sliderData[0].handleAngle = slider1Angle;

                    sliderData[1].sliderIndex = 1;
                    sliderData[1].x = slider2Location.x;
                    sliderData[1].y = slider2Location.y;
                    sliderData[1].value = slider2Value;
                    sliderData[1].handleAngle = slider2Angle;

                    //update the range arc
                    var drawRangeArc = d3.svg.arc()
                                     .innerRadius(sliderOptions.radius - ((defaultOptions.trackWidth - sliderOptions.trackWidth)/2) - sliderOptions.trackWidth)
                                     .outerRadius(sliderOptions.radius - ((defaultOptions.trackWidth - sliderOptions.trackWidth)/2))
                                     .startAngle(0)
                                     .endAngle(function(d) { return d.handleAngle; });
                    svg.selectAll('.slider-range-track').attr('d', drawRangeArc);
                    
                }

                //function to convert degrees to radians
                function degToRad(deg){
                    return deg * (Math.PI/180);
                }

                //function to convert radians to degrees
                function RadToDeg(rad){
                    return rad * (180/Math.PI);
                }

                //calculate the slider value from a rotation angle
                function calculateValueFromRotation(angle) {
                    return sliderOptions.min + (angle/(2 * Math.PI) * (sliderOptions.max-sliderOptions.min));  
                }

                //calculate the rotation angle from a slider value
                function calculateRotationFromValue(value) {
                    return (value - sliderOptions.min) / (sliderOptions.max-sliderOptions.min) * (2 * Math.PI);  
                }

                //calculate the rotation angle of a point from the centre of the slider 
                function calculateRotation(x, y) {
                    return Math.PI + Math.atan2(x, y) * -1;
                }

                //calculate the location point on the slider track from an angle
                function calculateHandleLocationFromAngle(angle) {
                    return {
                        x: trackRadius * Math.cos(angle - (Math.PI/2)),
                        y: trackRadius * Math.sin(angle - (Math.PI/2))
                    };  
                }

                //method to tween the slider from one angle to another
                function sliderTween(newAngle) {
                
                    return function(d) {

                        var sliderNumber = d.sliderIndex + 1;
                        
                        var startAngle = d.handleAngle;
                        var interpolate = d3.interpolate(startAngle, newAngle);

                        return function(t) {

                            d.handleAngle = interpolate(t);
                            
                            //get the new handle x,y coordinates
                            var handleLocation = calculateHandleLocationFromAngle(d.handleAngle);
                            d.x = handleLocation.x;
                            d.y = handleLocation.y;

                            //update the slider handle locations/labels
                            updateSliderHandles();

                            //update the range arc
                            var drawRangeArc = d3.svg.arc()
                                     .innerRadius(sliderOptions.radius - ((defaultOptions.trackWidth - sliderOptions.trackWidth)/2) - sliderOptions.trackWidth)
                                     .outerRadius(sliderOptions.radius - ((defaultOptions.trackWidth - sliderOptions.trackWidth)/2))
                                     .startAngle(0)
                                     .endAngle(function(d) { return d.handleAngle; });
                            
                            return drawRangeArc(d);
                        };
                    };
                };


                function renderNormalSlider() {

                    $scope.sliderType = 'normal';

                    //update the track width and handle size
                    sliderOptions.trackWidth = defaultOptions.trackWidth;
                    sliderOptions.handleRadius = defaultOptions.handleRadius;
                    sliderOptions.selectedHandleScaleFactor = defaultOptions.selectedHandleScaleFactor;

                    //redraw slider track
                    sliderTrack.attr('stroke-width', sliderOptions.trackWidth);

                    //update the handle size
                    handleCircle.select('.handle-circle').attr('r', sliderOptions.handleRadius);
                    handleCircle.select('.handle-dot').attr('r', sliderOptions.handleRadius - sliderOptions.trackWidth).attr('opacity', 1);

                    //redraw the slider range track
                    var drawChartRangeArc = d3.svg.arc()
                                     .innerRadius(sliderOptions.radius - ((defaultOptions.trackWidth - sliderOptions.trackWidth)/2) - sliderOptions.trackWidth)
                                     .outerRadius(sliderOptions.radius - ((defaultOptions.trackWidth - sliderOptions.trackWidth)/2))
                                     .startAngle(0)
                                     .endAngle(function(d) { return d.handleAngle; });
                    sliderRange.attr('d', drawChartRangeArc);

                }

                function renderCompactSlider() {

                    $scope.sliderType = 'compact';

                    //update the track width and handle size
                    sliderOptions.trackWidth = defaultOptions.trackWidth;
                    sliderOptions.handleRadius = 20;
                    sliderOptions.selectedHandleScaleFactor = 1;

                    //redraw slider track
                    sliderTrack.attr('stroke-width', sliderOptions.trackWidth);

                    //update the handle size to zero
                    handleCircle.select('.handle-circle').attr('r', 0);
                    handleCircle.select('.handle-dot').attr('r', 0).attr('opacity', 1);

                    //redraw the slider range track
                    var drawChartRangeArc = d3.svg.arc()
                                     .innerRadius(sliderOptions.radius - ((defaultOptions.trackWidth - sliderOptions.trackWidth)/2) - sliderOptions.trackWidth)
                                     .outerRadius(sliderOptions.radius - ((defaultOptions.trackWidth - sliderOptions.trackWidth)/2))
                                     .startAngle(0)
                                     .endAngle(function(d) { return d.handleAngle; });
                    sliderRange.attr('d', drawChartRangeArc);

                }

                function renderChartSlider() {

                    $scope.sliderType = 'chart';

                    //update the track width and handle size
                    sliderOptions.trackWidth = 2;
                    sliderOptions.handleRadius = 7;
                    sliderOptions.selectedHandleScaleFactor = 1.2;

                    //redraw slider track
                    sliderTrack.attr('stroke-width', sliderOptions.trackWidth);

                    //update the handle size and remove the dot
                    handleCircle.selectAll('.handle-circle').attr('r', sliderOptions.handleRadius);
                    handleCircle.selectAll('.handle-dot').attr('opacity', 0);

                    //redraw the slider range track
                    var drawChartRangeArc = d3.svg.arc()
                                     .innerRadius(sliderOptions.radius - ((defaultOptions.trackWidth - sliderOptions.trackWidth)/2) - sliderOptions.trackWidth)
                                     .outerRadius(sliderOptions.radius - ((defaultOptions.trackWidth - sliderOptions.trackWidth)/2))
                                     .startAngle(0)
                                     .endAngle(function(d) { return d.handleAngle; });
                    sliderRange.attr('d', drawChartRangeArc);
                }


                $scope.onMouseEnter = function() {
                    $scope.hovering = true;

                    if($scope.sliderType === 'compact') {
                        svg.selectAll('.handle-circle')
                            .transition()
                            .attr('r', 20);
                        svg.selectAll('.handle-dot')
                            .transition()
                            .attr('r', 15);
                    }
                }

                $scope.onMouseLeave = function() {
                    $scope.hovering = false;

                    if($scope.sliderType === 'compact' && !$scope.dragging) {
                        svg.selectAll('.handle-circle, .handle-dot')
                            .transition()
                            .attr('r', 0);
                    }
                    
                }

                if($($element[0]).hasClass('slider-chart')) {
                    //switch to the chart slider style
                    renderChartSlider();
                }
                else if($($element[0]).hasClass('slider-compact')) {
                    //switch to the compact slider style
                    renderCompactSlider();
                }


                //watch for class changes (only works in modern browsers + IE11)
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.attributeName === "class") {
                            var classAttribute = $(mutation.target).prop(mutation.attributeName);
                            //class attribute changed
                            if (classAttribute.indexOf('slider-chart') !== -1) {
                                //switch to the chart slider style
                                renderChartSlider();
                            }
                            else if (classAttribute.indexOf('slider-compact') !== -1) {
                                //switch to the compact slider style
                                renderCompactSlider();
                            }
                            else {
                                //switch to the normal slider style
                                renderNormalSlider();
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
