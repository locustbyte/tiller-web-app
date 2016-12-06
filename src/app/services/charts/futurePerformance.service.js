'use strict';

angular.module('chart.futurePerformanceService', [])
    /*
     * Holds the user data collected within the app
     */
    .service('chart.futurePerformanceService', ['chart.helperService', 'helperService', 'PubSub', function (chartHelperService, helperService, PubSub) {

       var chart = this;

        chart.setValues = function(data, user)
        {
            //console.log('setting future performance values', data);

            chart.limit = 1;
            chart.data = data;
            chart.user = user;
            chart.setTitle();
            chart.setKeys();
            chart.setMonths();
            chart.setTimeDataPoint();
            chart.setRangeValues();
            chart.setTickValues();
            chart.setAreaValues();
            chart.setDotValues();
            chart.setMedianValues();
            chart.setTarget();

            return chart;
        };

        chart.setAspectRatio = function(value)
        {
            chart.aspectRatio = value;
        };

        chart.setTarget = function()
        {
            chart.target = chart.user.target;
        };

        chart.setKeys = function()
        {
            chart.keys = [
                'good',
                'likely',
                'poor'
            ];
        };

        chart.setMonths = function()
        {

            chart.startDate = new Date(chart.data.returns[0].date);
            chart.userDate = moment(chart.startDate).add(chart.user.totalYears, 'years').toDate();
            chart.endDate = moment(chart.userDate).add(2, 'years').toDate();

            chart.limit = Math.abs(Math.round(moment(chart.startDate).diff(moment(chart.endDate), 'months', true))) - 1;
            chart.userMonth = chart.limit - 24;

            //console.log(chart);
        };

        chart.setTimeDataPoint = function()
        {
            chart.userMonth = chart.limit - 24;
            chart.timeDataPoint = chart.userMonth;
        };

        /**
         * Build the full range to create a usable scale
         */
        chart.setRangeValues = function()
        {
            chart.rangeValues = [];

            for(i=0; i < chart.data.returns.length; i++)
            {
                chart.rangeValues.push({
                    month: i,
                    date: new Date(chart.data.returns[i].date),
                    lowValue: chart.data.returns[i].band7Low,
                    highValue: chart.data.returns[i].band1High
                });
            }
        };

        /**
         * Set the values on the axis
         */
        chart.setTickValues = function()
        {
            chart.tickValues = [0];

            chart.setMonthDivisor();

            var slicedRange = sliceValues(chart.rangeValues);

            for(i=0; i < slicedRange.length; i++)
            {
                if((i + 1) % chart.monthDivisor === 0)
                {
                    chart.tickValues.push((i + 1));
                }
            }
        };

        /**
         * Create the chart title string
         */
        chart.setTitle = function()
        {

            function formatFuturePerformanceChartHeading(fractionYears, totalYears) {
                var daysInYear = 365.25;
                var totalDays = fractionYears * daysInYear;
                var years = Math.floor(totalDays / daysInYear);
                var months = Math.floor((totalDays - (years * daysInYear)) / (daysInYear / 12));

                var heading = 'In';
                if (years === 0 && months === 0) {
                    heading += ' 0';
                }
                else {
                    if (years === 0) {
                        heading += (months === 1) ? ' ' + months + ' month' : ' ' + months + ' months';
                    }
                    else if (months === 0) {
                        heading += ' ' + years;
                    }
                    else {
                        heading += (years === 1) ? ' 1 year' : ' ' + years + ' years';
                        heading += (months === 1) ? ' ' + months + ' month' : ' ' + months + ' months';
                    }
                }
                heading += ' of ' + totalYears;
                if (months > 0 || years === 0 || (months === 0 || years === 0)) {
                    heading += (totalYears === 1) ? ' year' : ' years';
                }
                return heading;
            }

            if(chart.userTimeLineIsValid())
            {
                var fractionYears = chart.userTimeLine.key / 12;

                chart.title = formatFuturePerformanceChartHeading(fractionYears, chart.user.totalYears)
            }
            else
            {
                chart.title = 'In ' + chart.user.totalYears + ' investment years';
            }

        };

        chart.getChartTitle = function()
        {
            return chart.chartTitle;
        };

        /**
         * Diced how we divide up the years on the x-axis.
         * This is determined by the number of months returned and gives us the number of months to divide by (the divisor) so that we can show years in 1s, 2s and 3s.
         */
        chart.setMonthDivisor = function()
        {

            if(chart.limit > 239)
            {
                chart.monthDivisor = 36;
            }
            else if(chart.limit > 119)
            {
                chart.monthDivisor = 24;
            }
            else
            {
                chart.monthDivisor = 12;
            }
        };

        /**
         * Build the values for each dot on the timeline on the chart
         */
        chart.setDotValues = function()
        {

            var key = chart.getDataKey();

            chart.dotValues = {
                'good': {
                    month: key,
                    date: new Date(chart.data.returns[key].date),
                    value: chart.data.returns[key].band2
                },
                'likely': {
                    month: key,
                    date: new Date(chart.data.returns[key].date),
                    value: chart.data.returns[key].band4
                },
                'poor': {
                    month: key,
                    date: new Date(chart.data.returns[key].date),
                    value: chart.data.returns[key].band6
                }
            };

        };

        /**
         * Build the values for each area on the chart
         * @returns {Array}
         */
        chart.setAreaValues = function()
        {

            if(chart.areaPlots === undefined)
            {
                chart.areaPlots = [];
            }

            chart.setOldAreaValues();

            chart.areaValues = [[],[],[],[],[],[],[]];

            for(i=0; i < chart.data.returns.length; i++)
            {
                chart.areaValues[0].push({
                    month: i,
                    date: new Date(chart.data.returns[i].date),
                    lowValue: chart.data.returns[i].band1Low,
                    highValue: chart.data.returns[i].band1High
                });
                chart.areaValues[1].push({
                    month: i,
                    date: new Date(chart.data.returns[i].date),
                    lowValue: chart.data.returns[i].band2Low,
                    highValue: chart.data.returns[i].band2High
                });
                chart.areaValues[2].push({
                    month: i,
                    date: new Date(chart.data.returns[i].date),
                    lowValue: chart.data.returns[i].band3Low,
                    highValue: chart.data.returns[i].band3High
                });
                chart.areaValues[3].push({
                    month: i,
                    date: new Date(chart.data.returns[i].date),
                    lowValue: chart.data.returns[i].band4Low,
                    highValue: chart.data.returns[i].band4High
                });
                chart.areaValues[4].push({
                    month: i,
                    date: new Date(chart.data.returns[i].date),
                    lowValue: chart.data.returns[i].band5Low,
                    highValue: chart.data.returns[i].band5High
                });
                chart.areaValues[5].push({
                    month: i,
                    date: new Date(chart.data.returns[i].date),
                    lowValue: chart.data.returns[i].band6Low,
                    highValue: chart.data.returns[i].band6High
                });
                chart.areaValues[6].push({
                    month: i,
                    date: new Date(chart.data.returns[i].date),
                    lowValue: chart.data.returns[i].band7Low,
                    highValue: chart.data.returns[i].band7High
                });
            }
        };

        /**
         * Store the old area values so we can animate better on update
         */
        chart.setOldAreaValues = function()
        {
            if(chart.areaValues !== undefined)
            {
                chart.oldAreaValues = chart.areaValues;
            }
        };


        /**
         * Limit the values to the
         * @param values
         * @returns {*}
         */
        function sliceValues(values)
        {

            var splicedValues = values.slice(0, (chart.limit + 1));

            return splicedValues;

        };

        /**
         * Decides which timeline key to look for. If the user has selected a userTimeLine key on the graph then we use that, if not we use the user.totalYears value
         * @returns {*}
         */
        chart.getDataKey = function()
        {
            if(chart.userTimeLineIsValid())
            {
                return chart.userTimeLine.key;
            }

            return chart.userMonth;
        };

        chart.userTimeLineIsValid = function()
        {
            return (chart.userTimeLine !== undefined && chart.userTimeLine.key < chart.limit);
        };

        /**
         * Sets the media values for each type of performance
         * @returns {Array}
         */
        chart.setMedianValues = function()
        {

            var key = chart.getDataKey();

            chart.medians = {
                good: {
                    value: helperService.formatMoney(chart.data.returns[key].band2),
                    percentage: Math.round(helperService.percentageGrowth(chart.data.returns[0].band2, chart.data.returns[key].band2)) + '%'
                },
                likely: {
                    value: helperService.formatMoney(chart.data.returns[key].band4),
                    percentage: Math.round(helperService.percentageGrowth(chart.data.returns[0].band4, chart.data.returns[key].band4)) + '%'
                },
                poor: {

                    value: helperService.formatMoney(chart.data.returns[key].band6),
                    percentage: Math.round(helperService.percentageGrowth(chart.data.returns[0].band6, chart.data.returns[key].band6)) + '%'

                }
            };
        };

        /**
         * Return median values to all that want it
         * @returns {{good: {value, percentage: string}, likely: {value, percentage: string}, poor: {value, percentage: string}}|*}
         */
        chart.getMedianValues = function()
        {
            return chart.medians;
        };

        /**
         * Create a chart
         * chart.graphGroup must be set
         * @returns {*}
         */
        chart.createChart = function(element, data)
        {

            chart.element = element;

            chart.setSizes();

            chart.setD3Layouts();

            angular.extend(chart, data);

            chart.svg = d3.select(chart.element)
                .append("svg")
                .attr("width", chart.w)
                .attr("height", chart.h);

            chart.graphGroup = chart.svg
                .append("g")
                .attr('transform', 'translate(5, 20)');

            for(i = 0; i < chart.areaValues.length; i++)
            {
                chart.buildArea(i);
            }

            chart.buildAxis();
            chart.buildTimeLine();
            chart.buildTargetLine();
            chart.buildDots();
            chart.maybeBuildUserTimeline();

        };

        chart.setSizes = function()
        {
            chart.w = chart.element.offsetWidth;
            chart.h = chart.w * chart.aspectRatio;
            chart.chartHeight = chart.h - 60;
            chart.chartWidth = chart.w - 60;
        };

        chart.setD3Layouts = function()
        {
            chart.x = d3.scale.linear()
                .range([0, chart.chartWidth]);

            chart.y = d3.scale.linear()
                .range([chart.chartHeight, 0]);

            chart.yLower = d3.scale.linear()
                .range([chart.chartHeight, 0]);

            chart.area = d3.svg.area()
                .interpolate('monotone')
                .x(function(d, i) {
                    return chart.x(d.month);
                })
                .y0(function(d) {
                    return chart.y(d.lowValue);
                })
                .y1(function(d) {
                    return chart.y(d.highValue);
                });

            chart.line = d3.svg.line()
                .x(function (d) {
                    return chart.x(d.month);
                })
                .y(function (d) {
                    return chart.y(d.value);
                });

            chart.setAreaRanges();
        };

        /**
         *
         */
        chart.setAreaRanges = function()
        {
            var slicedRangeValues = sliceValues(chart.rangeValues);

            chart.x.domain(d3.extent(slicedRangeValues, function(d) {
                return d.month;
            }));

            chart.y.domain(d3.extent(slicedRangeValues, function(d) {
                return d.highValue;
            }));

            chart.yLower.domain(d3.extent(slicedRangeValues, function(d) {
                return d.lowValue;
            }));
        };


        /**
         * Rebuild the chart on update of data
         */
        chart.rebuildChart = function()
        {

            //console.log('rebuild chart');

            chart.setAreaRanges();

            for(i = 0; i < chart.areaValues.length; i++)
            {
                chart.updateArea(i);
            }
            chart.updateTimeLine();
            chart.updateUserTimeLine();
            chart.updateTargetLine();
            chart.updateDots();
            chart.updateAxis();

        };

        /**
         * Build the areas from the areaValues array using the index of the array
         * @param i
         */
        chart.buildArea = function(i)
        {

            chart.getAreaStartData(i);

            chart.areaPlots[i] = chart.graphGroup.append("path")
                .datum(sliceValues(chart.areaStartData))
                .attr('d', chart.area)
                .attr('fill', chart.getAreaColour(i))
                .attr("class", "area")
                .on('click', function(){
                    chart.buildUserTimeLine(chart.x.invert(d3.event.offsetX), chart.y.invert(d3.event.offsetY));
                });

            chart.areaPlots[i].transition()
                .duration( 1000 )
                .attrTween( 'd', function() {

                    var interpolator = d3.interpolateArray( sliceValues(chart.areaStartData), sliceValues(chart.areaValues[i]) );

                    return function( t ) {
                        return chart.area( interpolator( t ) );
                    }

                } );

        };

        /**
         * Update each area with new data
         * @param i
         */
        chart.updateArea = function(i)
        {

            chart.areaPlots[i]
                .transition()
                .duration(1000)
                .attrTween( 'd', function() {

                    var interpolator = d3.interpolateArray(sliceValues(chart.oldAreaValues[i]), sliceValues(chart.areaValues[i]));

                    return function( t ) {
                        return chart.area( interpolator( t ) );
                    }

                } );
        };

        /**
         * Get the start data for the area so we can animate it in
         * @param i
         */
        chart.getAreaStartData = function(i)
        {

            chart.areaStartData = chart.areaValues[i].map( function( data ) {
                return {
                    month: i,
                    date: new Date(data.date),
                    highValue : 0,
                    lowValue: 0
                };
            } );

        };

        /**
         * Build the axis on the chart
         */
        chart.buildAxis = function()
        {

            chart.xAxis = d3.svg.axis()
                .orient("bottom")
                .scale(chart.x)
                .tickValues(chart.tickValues)
                .tickFormat(function(t){
                    return t/12;
                });

            chart.xAxisLabel = chart.graphGroup.append("text")
                .attr("class", "x label")
                .attr("transform", function(d){

                    chart.textWidth = chartHelperService.getTheD3TextWidth(d3.select(this));

                    var textX = (chart.w / 2) - chart.textWidth;

                    return 'translate(' + textX + ', ' + chart.h + ')';
                })
                .append('tspan')
                .attr("text-anchor", "middle")
                .style('font-size', '13px')
                .text("Years");

            chart.xAxisGroup = chart.graphGroup.append("g")
                .attr("class", "xaxis axis")
                .attr("transform", "translate(0, " + (chart.h - 45) + ")")
                .call(chart.xAxis);

        };

        /**
         * Update the x axis on the chart
         */
        chart.updateAxis = function()
        {

            chart.xAxis = d3.svg.axis()
                .orient("bottom")
                .scale(chart.x)
                .tickValues(chart.tickValues)
                .tickFormat(function(t){
                    return t/12;
                });

            chart.xAxisGroup.transition()
                .duration(250)
                .call(chart.xAxis);

        };

        /**
         * Draw the time line on the graph vertically
         */
        chart.buildTimeLine = function()
        {

            chart.dataPointX = chart.x(chart.timeDataPoint);

            chart.graphTimeLine = chart.graphGroup.append("line")
                .attr("class", "time-line")
                .attr({
                    x1: 0,
                    y1: 20,
                    x2: 0,
                    y2: 0
                })
                .attr('stroke', 'white')
                .style('stroke-width', 0.2);

            chart.graphTimeText = chart.graphGroup.append('text')
                .attr('class', 'time-line-text')
                .attr('text-anchor', 'middle')
                .attr({
                    x: chart.dataPointX,
                    y: 10
                })
                .attr('fill', 'white')
                .text('Time Horizon');


            chart.graphTimeLine.transition()
                .duration(250)
                .attr({
                    x1: chart.dataPointX,
                    y1: 20,
                    x2: chart.dataPointX,
                    y2: chart.chartHeight
                })
                .ease('sine');

            chart.graphTimeText.transition()
                .duration(300)
                .attr({
                    x: chart.dataPointX,
                    y: 10
                })
                .ease('sine');



        };

        /**
         * Update the time line on the graph vertically
         */
        chart.updateTimeLine = function()
        {

            chart.dataPointX = chart.x(chart.timeDataPoint);

            chart.graphTimeLine.transition()
                .duration(250)
                .attr({
                    x1: chart.dataPointX,
                    y1: 20,
                    x2: chart.dataPointX,
                    y2: chart.chartHeight
                })
                .ease('sine');

            chart.graphTimeText.transition()
                .duration(300)
                .attr({
                    x: chart.dataPointX,
                    y: 10
                })
                .ease('sine');

        };

        /**
         * Create the user timeline if the object exists but the d3 object does not
         */
        chart.maybeBuildUserTimeline = function()
        {
            //console.log('running', 'userTimeLine', chart.userTimeLine, 'graphUserTimeLine', chart.graphUserTimeLine);

            if(chart.userTimeLine !== undefined && chart.graphUserTimeLine === undefined)
            {
                chart.createUserTimeLine();
            }
        };

        /**
         * Build the user timeline so that we
         * @param x
         * @param y
         */
        chart.buildUserTimeLine = function(x, y)
        {

            x = parseInt(x);

            if(chart.userTimeLine === undefined)
            {

                chart.userTimeLine = {
                    posX: x,
                    posY: y,
                    x: chart.x(x),
                    y: chart.y(y),
                    key: x
                };

                chart.createUserTimeLine();

            }
            else
            {
                chart.userTimeLine.posX = x;
                chart.userTimeLine.posY = y;
                chart.userTimeLine.key = x;
                chart.updateUserTimeLine();
            }

        };

        chart.createUserTimeLine = function()
        {

            chart.graphUserTimeLine = chart.graphGroup.append("line")
                .attr("class", "user-time-line")
                .attr({
                    x1: chart.dataPointX,
                    y1: 20,
                    x2: chart.dataPointX,
                    y2: chart.chartHeight
                })
                .attr('stroke', 'white')
                .style('stroke-width', 0.2)
                .style('opacity', 0)
                .style('stroke-dasharray', (3, 3));

            chart.setDotValues();
            chart.setMedianValues();
            chart.setTitle();

            chart.graphUserTimeLine.transition()
                .duration(250)
                .attr({
                    x1: chart.userTimeLine.x,
                    y1: 20,
                    x2: chart.userTimeLine.x,
                    y2: chart.chartHeight
                })
                .style('opacity', 1);

            chart.updateDots();

            PubSub.publish('charts.futurePerformance.updated', {
                medians: chart.medians,
                title: chart.title
            });
        };

        /**
         * Aniimate the user timeline and animate the medians
         */
        chart.updateUserTimeLine = function()
        {

            if(chart.userTimeLine !== undefined && chart.graphUserTimeLine !== undefined)
            {
                chart.userTimeLine.x = chart.x(chart.userTimeLine.posX);
                chart.userTimeLine.y = chart.y(chart.userTimeLine.posY);

                chart.setDotValues();
                chart.setMedianValues();
                chart.setTitle();

                chart.graphUserTimeLine.transition()
                    .duration(250)
                    .attr({
                        x1: chart.userTimeLine.x,
                        y1: 20,
                        x2: chart.userTimeLine.x,
                        y2: chart.chartHeight
                    })
                    .style('opacity', 1);

                chart.updateDots();

                PubSub.publish('charts.futurePerformance.updated', {
                    medians: chart.medians,
                    title: chart.title
                });
            }

        };

        /**
         * Draw the target line on the graph vertically
         */
        chart.buildTargetLine = function()
        {

            //console.log(chart.target);

            if(chart.target === false)
            return;

            chart.dataPointY = chart.y(chart.target);
            var opacity = chart.opacityOutsideChartBounds(chart.dataPointY);
            chart.lineStartX = chart.w * 0.125;

            chart.graphTargetLine = chart.graphGroup.append("line")
                .attr("class", "target-line")
                .attr({
                    x1: chart.lineStartX,
                    y1: 0,
                    x2: 0,
                    y2: 0
                })
                .attr('stroke', 'white')
                .style('stroke-width', 0.2);

            chart.graphTargetText = chart.graphGroup.append('text')
                .attr('class', 'target-line-text')
                .attr('text-anchor', 'left')
                .attr('dy', '0.3em')
                .attr({
                    x: 5,
                    y: chart.dataPointY
                })
                .attr('fill', 'white')
                .text('Target');

            chart.graphTargetValueText = chart.graphGroup.append('text')
                .attr('class', 'target-line-text')
                .attr('text-anchor', 'right')
                .attr('dy', '0.3em')
                .attr({
                    x: chart.chartWidth + 10,
                    y: chart.dataPointY
                })
                .attr('fill', 'white')
                .text(helperService.formatK(chart.target));

            chart.graphTargetValueLabel = chart.svg.append('text')
                .attr('class', 'target-line-label')
                .attr('text-anchor', 'right')
                .style('font-size', '13px')
                .attr({
                    x: chart.chartWidth + 10,
                    y: 10
                })
                .attr('fill', 'white')
                .text('Value');

            chart.graphTargetLine.transition()
                .duration(250)
                .attr({
                    x1: chart.lineStartX,
                    y1: chart.dataPointY,
                    x2: chart.chartWidth,
                    y2: chart.dataPointY
                })
                .style('opacity', opacity)
                .ease('ease-in-out');

            chart.graphTargetText.transition()
                .duration(300)
                .attr({
                    x: 5,
                    y: chart.dataPointY
                })
                .style('opacity', opacity)
                .ease('ease-in-out');

            chart.graphTargetValueText.transition()
                .duration(300)
                .attr({
                    x: chart.chartWidth + 10,
                    y: chart.dataPointY
                })
                .style('opacity', opacity)
                .ease('ease-in-out');

        };

        /**
         * Update the target line
         */
        chart.updateTargetLine = function()
        {

            if(chart.target === false)
                return;

            chart.dataPointY = chart.y(chart.target);
            var opacity = chart.opacityOutsideChartBounds(chart.dataPointY);

            chart.graphTargetLine.transition()
                .duration(250)
                .attr({
                    x1: chart.lineStartX,
                    y1: chart.dataPointY,
                    x: chart.chartWidth,
                    y2: chart.dataPointY
                })
                .style('opacity', opacity)
                .ease('ease-in-out');

            chart.graphTargetText.transition()
                .duration(300)
                .attr({
                    x: 5,
                    y: chart.dataPointY
                })
                .style('opacity', opacity)
                .ease('ease-in-out');

            chart.graphTargetValueText
                .text(helperService.formatK(chart.target))
                .transition()
                .duration(300)
                .attr({
                    x: chart.chartWidth + 10,
                    y: chart.dataPointY
                })
                .style('opacity', opacity)
                .ease('ease-in-out');
        };

        /**
         * Set opacity to 0 for objects outside chart bounds
         * @param plotY
         * @returns {number}
         */
        chart.opacityOutsideChartBounds = function(plotY)
        {

            if(plotY < 0 || plotY > (chart.chartHeight - 10))
            {
                return 0;
            }

            return 1;
        };

        /**
         * Build dots on load
         */
        chart.buildDots = function()
        {
            chart.timeDots = [];
            angular.forEach(chart.dotValues, function(dot, key){

                chart.dotY = chart.y(dot.value);
                chart.dotX = chart.x(dot.month);

                chart.timeDots[key] = chart.graphGroup.append("circle")
                    .attr("class", "time-dot time-dot-" + key)
                    .attr('r', 3)
                    .attr({
                        cx: chart.dotX,
                        cy: chart.chartHeight
                    })
                    .style('opacity', 0)
                    .attr('fill', 'transparent')
                    .attr('stroke', 'white')
                    .attr('stroke-width', 3);

                chart.timeDots[key].transition()
                    .duration(1000)
                    .style('opacity', 1)
                    .attr({
                        cx: chart.dotX,
                        cy: chart.dotY
                    });

            });
        };

        /**
         * Reposition dots on update
         */
        chart.updateDots = function()
        {
            angular.forEach(chart.dotValues, function(dot, key){

                chart.dotY = chart.y(dot.value);
                chart.dotX = chart.x(dot.month);

                chart.timeDots[key].transition()
                    .duration(250)
                    .attr({
                        cx: chart.dotX,
                        cy: chart.dotY
                    });

            });
        };

        /**
         * Destroys the chart completely
         */
        chart.destroyChart = function()
        {
            chart.svg.remove();
        };

        chart.getLineColour = function(i)
        {

            switch(i)
            {
                case 0:
                    return 'red';

                case 1:

                    return 'green';

                case 2:

                    return 'blue';

                default:
                    return 'white';
            }

        };

        /**
         * Helper function to get the colour of an area
         * @param i
         * @returns {*}
         */
        chart.getAreaColour = function(i)
        {
            switch(i)
            {
                case 0:
                    return '#3e7ba7';

                case 1:

                    return '#48a2e0';

                case 2:

                    //return '#4ba3e2';
                    return '#34c88e';

                case 3:

                    return '#39d99b';

                case 4:

                    return '#34c88e';

                case 5:

                    return '#ffaa19';

                case 6:

                    return '#c0821d';

                default:
                    return 'white';
            }
        };

    }]);