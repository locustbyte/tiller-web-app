angular.module('ui.tiller-sliders')
    
    .directive('tillerDiscoverySlider', ['validationService', 'sliderService', 'PubSub', 'helperService', function(validationService, sliderService, PubSub, helperService) {

        return {
            restrict: 'E',
            replace: false,
            templateUrl: 'components/tl-round-slider.html',
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
                    value: 6,
                    handleStyle: 'dot',
                    snapEaseFunction: 'quad'
                };

                if($scope.sliderModel) {
                    sliderOptions = angular.extend(sliderOptions, $scope.sliderModel);
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
                }

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
                    }
                    return true;
                };

                /**
                 * Subscribe to publishers from sliderService
                 */

                $scope.sliderResetListener = function(key) {

                    if(key === $scope.sliderKey)
                    {
                        var value = getMinValue();

                        if(key === 'totalYears')
                        {
                            value = 10;
                        }

                        updateValue(value);
                        $scope.setSliderValue();
                    }

                };

                PubSub.subscribe('slider.reset', $scope.sliderResetListener);

                $scope.$watch('sliderData.numericValue', function(value){
                    if($scope.valueFormatter === 'currency') {
                        $scope.sliderData.formattedValue = helperService.formatMoney(value);
                    }
                    else {
                        $scope.sliderData.formattedValue = value;
                    }
                });

                //set the slider value when the textbox is updated
                $scope.setSliderValue = function() {

                    var value = $scope.sliderData.formattedValue.toString().replace(/[^0-9]/g,"");

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

                    if($scope.valueFormatter === 'currency') {
                        $scope.sliderData.formattedValue = helperService.formatMoney(value);
                    }
                    else {
                        $scope.sliderData.formattedValue = value;
                    }

                    $scope.sliderData.value = getSliderValue(value);
                    $scope.sliderData.numericValue = value;
                    updateSliderRotation($scope.sliderData.value);
                    $scope.sliderChangeCallback($scope.sliderKey, $scope.sliderData);
                };

                /**
                 * @todo - Needs to be tidied up and refactored - potentially moved to the helperService
                 * @param e
                 * @returns {boolean}
                 */
                $scope.filterKeys = function(e) {
                    if(e.keyCode === 13) {
                        e.target.blur();
                    }
                    if(e.keyCode != 13 && e.keyCode != 8 && e.keyCode != 9 && e.keyCode != 46 && e.keyCode != 37 && e.keyCode != 39 && !(e.keyCode >= 48 && e.keyCode <= 57) && !(e.keyCode >= 96 && e.keyCode <= 105)) {
                        e.preventDefault();
                        return false;
                    }
                };

                //method to call the sliderChange callback function if one is passed to the directive
                $scope.sliderChangeCallback = function(sliderKey, sliderData) {
                    if(typeof $scope.sliderChange === 'function') {
                        $scope.sliderChange(sliderKey, sliderData);
                    }
                };

                if($scope.valueFormatter === 'currency') {
                    $scope.sliderData.formattedValue = helperService.formatMoney(getAmount($scope.sliderData.value));
                }
                else {
                    $scope.sliderData.formattedValue = $scope.sliderData.value;
                }

                //console.log('initValue', $scope.sliderData);

                var updateValue = function(sliderValue) {

                    $scope.sliderData.value = sliderValue;

                    //console.log('updateValue', $scope.sliderData);

                    if($scope.valueFormatter === 'currency')
                    {
                        $scope.sliderData.formattedValue = helperService.formatMoney(getAmount(sliderValue));
                    }
                    else
                    {
                        $scope.sliderData.formattedValue = sliderValue;
                    }

                    //console.log('updateValue', $scope.sliderData);

                    $scope.sliderData.numericValue = getAmount(sliderValue);

                    validateInput(getAmount(sliderValue));

                    $scope.sliderModel.change(getAmount(sliderValue));
                    //console.log(getMinValue(), sliderValue);

                    sliderService.setResetValue($scope.sliderKey, getMinValue(), sliderValue);
                };

                $scope.incSliderValue = function($event) {

                    //console.log($scope.sliderData.value);

                    //need to do this to stop multiple click events firing
                    $event.stopPropagation();

                    if($scope.sliderData.value < sliderOptions.max) {

                        // increment slider by 1 unit
                        var value = parseInt($scope.sliderData.value, 10) + 1;

                        updateValue(value);
                        updateSliderRotation(value);
                        $scope.sliderChangeCallback($scope.sliderKey, $scope.sliderData);
                    }

                };

                $scope.decSliderValue = function($event) {

                    //need to do this to stop multiple click events firing
                    $event.stopPropagation();

                    if($scope.sliderData.value > sliderOptions.min) {

                        // decrement slider by 1 unit
                        var value = parseInt($scope.sliderData.value, 10) - 1;

                        updateValue(value);
                        updateSliderRotation(value);
                        $scope.sliderChangeCallback($scope.sliderKey, $scope.sliderData);
                    }

                };

                //draw the various svg elements to create the slider
                var trackRadius = sliderOptions.radius - (sliderOptions.trackWidth/2);
                var sliderData = initSlider();

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

                var sliderRangeTrack = d3.svg.arc()
                                         .innerRadius(sliderOptions.radius - sliderOptions.trackWidth)
                                         .outerRadius(sliderOptions.radius)
                                         .startAngle(0)
                                         .endAngle((sliderOptions.value-sliderOptions.min)/(sliderOptions.max-sliderOptions.min) * 2 * Math.PI);

                var drawRangeArc = d3.svg.arc()
                                     .innerRadius(sliderOptions.radius - sliderOptions.trackWidth)
                                     .outerRadius(sliderOptions.radius)
                                     .startAngle(0)
                                     .endAngle(function(d) { return d.handleAngle; });

                var sliderRange = container.selectAll('.slider-range-track')
                                        .data(sliderData)
                                        .enter()
                                        .append('path')
                                        .attr('d', drawRangeArc)
                                        .attr('class', 'slider-range-track');

                var handleCircle = container.append('g')
                                             .classed('handle', true).call(drag);

                //add handle
                handleCircle.selectAll('.handle-circle')
                             .data(sliderData)
                             .enter().append('circle')
                             .classed('handle-circle', true)
                             .attr('r', sliderOptions.handleRadius)
                             .attr('cx', function(d) { return d.x;})
                             .attr('cy', function(d) { return d.y;})
                             .call(drag);

                //add touch hidden handle if running on touch enabled device
                if(isTouchDevice) {
                    var hiddenTouchHandle = handleCircle.selectAll('.touch-hidden-handle')
                                                        .data(sliderData)
                                                        .enter().append('circle')
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
                                            .classed('handle-dot', true)
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
                                              .classed('handle-label', true)
                                              .attr('x', function(d) { return d.x;})
                                              .attr('y', function(d) { return d.y + 2.5;})
                                              .text(function (d) { return d.value })
                                              .attr('font-family', 'sans-serif')
                                              .attr('font-size', '8px')
                                              .style('text-anchor', 'middle')
                                              .attr('fill', 'white')
                                              .call(drag);

                //add handle pulse circle
                var handlePulse = handleCircle.append('circle')
                                              .data(sliderData)
                                              .classed('handle-pulse', true)
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


                //this method is called when the handle dragging starts
                function dragstarted(d) {

                    $scope.$apply(function() {
                        $scope.dragging = true;
                    });

                    d3.event.sourceEvent.stopPropagation();

                    //resize the handle
                    svg.selectAll('.handle-circle, .handle-dot')
                        .classed('dragging', true);
                    svg.select('.handle-circle')
                        .transition()
                        .duration(100)
                        .ease('quad')
                        .attr('r', sliderOptions.handleRadius * sliderOptions.selectedHandleScaleFactor);
                    svg.select('.handle-dot')
                        .transition()
                        .duration(100)
                        .ease('quad')
                        .attr('r', (sliderOptions.handleRadius * sliderOptions.selectedHandleScaleFactor) - sliderOptions.trackWidth);
                    svg.select('.handle-pulse')
                        .attr('r', sliderOptions.handleRadius * sliderOptions.selectedHandleScaleFactor)
                        .attr('opacity', 0);
                }

                //this method is called when the handle is being dragged
                function dragged(d) {

                    //calculate mouse distance and angle using pythagoras
                    var distancefromOrigin = Math.sqrt(Math.pow(d3.event.x, 2) + Math.pow(d3.event.y, 2));
                    var alpha = Math.acos(d3.event.x/distancefromOrigin);

                    //update the handle location data
                    d.x = trackRadius * Math.cos(alpha);
                    d.y = d3.event.y < 0 ? -trackRadius * Math.sin(alpha) : trackRadius * Math.sin(alpha);

                    //update the location of the handle and handle-dot
                    svg.selectAll('.handle circle')
                        .attr('cx', d.x)
                        .attr('cy', d.y);

                    //update the location and text of the handle label
                    handleLabel.attr('x', d.x)
                        .attr('y', d.y + 2.5)
                        .text(function (d) { return d.value });

                    //update label text
                    sliderLabel.text(function(d) { return d.value });

                    //update the sliderData data object
                    var sliderAngle = calculateRotation(sliderData[0].x, sliderData[0].y);
                    var value = calculateValueFromRotation(sliderAngle);
                    sliderData[0].handleAngle = sliderAngle;
                    sliderData[0].value = parseInt(value.toFixed(0));

                    //update the range arc
                    var drawRangeArc = d3.svg.arc()
                                     .innerRadius(sliderOptions.radius - ((defaultOptions.trackWidth - sliderOptions.trackWidth)/2) - sliderOptions.trackWidth)
                                     .outerRadius(sliderOptions.radius - ((defaultOptions.trackWidth - sliderOptions.trackWidth)/2))
                                     .startAngle(0)
                                     .endAngle(function(d) { return d.handleAngle; });
                    sliderRange.attr('d', drawRangeArc);

                    //update input element
                    $scope.$apply(function () {
                        updateValue(sliderData[0].value);
                    });
                }

                //this method is called when the handle dragging ends
                function dragended(d) {

                    $scope.$apply(function() {
                        $scope.dragging = false;
                        //call the sliderChanged callback
                        $scope.sliderChangeCallback($scope.sliderKey, $scope.sliderData);
                    });


                    svg.selectAll('.handle-circle, touch-hidden-handle, .handle-dot')
                            .classed('dragging', false);

                    //reduce the handle size
                    if($scope.sliderType === 'compact') {
                        if(!$scope.hovering) {
                            svg.selectAll('.handle-circle, .handle-dot')
                                .transition()
                                .attr('r', 0);
                        }
                    }
                    else {
                        svg.select('.handle-circle')
                            .transition()
                            .attr('r', sliderOptions.handleRadius);
                        svg.select('.handle-dot')
                            .transition()
                            .attr('r', sliderOptions.handleRadius - sliderOptions.trackWidth);
                    }


                    //show pulse animation
                    svg.select('.handle-pulse')
                        .attr('r', sliderOptions.handleRadius * sliderOptions.selectedHandleScaleFactor)
                        .attr('opacity', .5)
                        .transition()
                        .duration(300)
                        .ease('linear')
                        .attr('r', (sliderOptions.handleRadius * sliderOptions.selectedHandleScaleFactor) + 5)
                        .attr('opacity', 0);


                    //snap slider path arc to nearest whole value location
                    var currentSliderAngle = calculateRotation(sliderData[0].x, sliderData[0].y);
                    var value = calculateValueFromRotation(currentSliderAngle).toFixed(0);

                    //snap handle and range to nearest value with transition
                    var snappedSliderAngle = calculateRotationFromValue(value);
                    sliderRange.transition()
                                .duration(250)
                                .ease(sliderOptions.snapEaseFunction)
                                .attrTween('d', sliderTween(snappedSliderAngle));

                }

                //when user clicks on the slider track then update value and animate
                svg.selectAll('.slider-track, .slider-range-track').on('click', function () {

                    var angle = calculateRotation(d3.mouse(this)[0], d3.mouse(this)[1]);
                    var value = calculateValueFromRotation(angle).toFixed(0);


                    //snap handle and range to nearest value with transition
                    var snappedSliderAngle = calculateRotationFromValue(value);
                    sliderRange.transition()
                                .duration(500)
                                .attrTween('d', sliderTween(snappedSliderAngle));

                    sliderData[0].value = parseInt(value);

                    //update label text
                    sliderLabel.text(function(d) { return d.value });

                    //update handle label text
                    handleLabel.text(function(d) { return d.value });

                    $scope.$apply(function () {
                        updateValue(sliderData[0].value);

                        //call the sliderChanged callback
                        $scope.sliderChangeCallback($scope.sliderKey, $scope.sliderData);
                    });

                });

                function updateSliderRotation(value) {

                    //move handle and range to nearest value with transition
                    var sliderAngle = calculateRotationFromValue(value);

                    sliderRange.transition()
                                .duration(200)
                                .attrTween('d', sliderTween(sliderAngle));

                    sliderData[0].value = parseInt(value);

                    //update label text
                    sliderLabel.text(function(d) { return d.value });

                    //update handle label text
                    handleLabel.text(function(d) { return d.value });
                }

                function initSlider() {

                    //calculate the slider value from the numeric value as it is not always a linear scale
                    $scope.sliderData.value = getSliderValue($scope.sliderData.numericValue);

                    //setup the slider values
                    sliderOptions.value = $scope.sliderData.value;
                    var angle = calculateRotationFromValue(sliderOptions.value);
                    var handleLocation = calculateHandleLocationFromAngle(angle);

                    return [{
                        x: handleLocation.x,
                        y: handleLocation.y,
                        value: sliderOptions.value,
                        handleAngle: angle
                    }];
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

                        var startAngle = d.handleAngle;
                        var interpolate = d3.interpolate(startAngle, newAngle);

                        return function(t) {

                            d.handleAngle = interpolate(t);

                            //get the new handle x,y coordinates
                            var handleLocation = calculateHandleLocationFromAngle(d.handleAngle);
                            d.x = handleLocation.x;
                            d.y = handleLocation.y;

                            svg.selectAll('.handle-circle, .touch-hidden-handle, .handle-dot, .handle-pulse')
                            .attr('cx', handleLocation.x)
                            .attr('cy', handleLocation.y);

                            svg.selectAll('.handle-label')
                            .attr('x', handleLocation.x)
                            .attr('y', handleLocation.y + 2.5);

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
                        svg.select('.handle-circle')
                            .transition()
                            .attr('r', 20);
                        svg.select('.handle-dot')
                            .transition()
                            .attr('r', 15);
                    }
                };

                $scope.onMouseLeave = function() {
                    $scope.hovering = false;

                    if($scope.sliderType === 'compact' && !$scope.dragging) {
                        svg.selectAll('.handle-circle, .handle-dot')
                            .transition()
                            .attr('r', 0);
                    }

                };

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
                                //swicth to the normal slider style
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
