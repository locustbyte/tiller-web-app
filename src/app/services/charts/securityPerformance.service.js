'use strict';

angular.module('chart.securityPerformanceService', [])
    /*
     * Holds the user data collected within the app
     */
    .service('chart.securityPerformanceService', ['chart.helperService', 'restService', 'helperService', 'PubSub', function (chartHelperService, restService, helperService, PubSub) {

        var chart = this;

        /**
         * Set the values for the chart based on the data returned from the service
         * @param data
         */
        chart.setValues = function(data)
        {
            chart.values = [];
            chart.dotValues = [];

            angular.forEach(data, function(period, key){

                chart.values.push({
                    date: new Date(period.date),
                    value: period.value
                });

                if(key === 0 || (key +1) % 12 ===0)
                {
                    chart.dotValues.push({
                        date: new Date(period.date),
                        value: period.value
                    });

                }
            });

        };

        /**
         * A get method to setValues
         * Currently used in unit tests
         * @param data
         * @returns {Array}
         */
        chart.getValues = function(data)
        {
            chart.setValues(data);

            return chart.values;
        };

        chart.initThemeChart = function(theme, element)
        {

            if(theme.themeSecurity !== undefined)
            {

                chart.theme = theme;

                chart.element = element;

                chart.setSizes('element');

                chart.drawThemeContainer();

                restService.getSecurityHistoricPerformance(chart.theme.themeSecurity.securityId).then(function (response) {

                    if (response !== false) {

                        chart.destroyLoader(function(){
                            chart.setValues(response);

                            chart.setd3Layouts();

                            chart.drawThemeChart();

                            chart.addCloseButton();

                            return chart.graphGroup;
                        });

                    }

                });
            }

        };

        /**
         * Gracefully destory the loader with a fade
         */
        chart.destroyLoader = function(callback)
        {
            if(chart.loader !== undefined){
                chart.loader.transition()
                    .duration(500)
                    .style('opacity', 0)
                    .each('end', callback);
            }

        };

        /**
         * Prepare a chart container for drawing in
         */
        chart.drawThemeContainer = function()
        {
            chart.parent = d3.select(chart.element)
                .append("svg")
                .attr("width", chart.w)
                .attr("height", chart.h);

            chart.outerCircle = chart.parent
                .append("circle")
                .style('opacity', 0)
                .attr('r', 0)
                .attr('transform', function (d) {

                    return 'translate(' + chart.radius + ' , ' + chart.radius + ')';

                })
                .attr('stroke', chart.theme.themeSecurity.hexColour)
                .attr('stroke-width', 0);

            chart.outerCircle.transition()
                .duration(500)
                .style('opacity', 1)
                .attr('fill', '#2a2627')
                .attr('r', chart.portholeRadius)
                .attr('stroke-width', 6)
                .each('end', function(){
                    chart.loader = chart.parent.append('image')
                        .attr('xlink:href','assets/img/loading-ripple.svg')
                        .attr('width', chart.radius)
                        .attr('height', chart.radius)
                        .attr('transform', function (d) {
                            return 'translate(' + (chart.radius / 2) + ' ,' + (chart.radius / 2) + ')';
                        });
                });

            chart.graphGroup = chart.parent
                .append("g")
                .attr('width', chart.chartDiameter)
                .attr('height', chart.chartDiameter)
                .attr('transform', function(){
                    return 'translate (' + (chart.w / 5.6551724137931) + ', ' + (chart.chartDiameter * 0.2) + ')';
                });

            chart.graphGroup.moveToFront();
        };


        /**
         * Embed a chart in another d3 object
         * @param config
         * @returns {*}
         */
        chart.embed = function(config)
        {
            chart = angular.extend(chart, config);

            chart.setSizes('d3');

            chart.graphGroup = chart.parent
                .append("g")
                .attr('width', chart.w)
                .attr('height', chart.h)
                .style('transform', function (d) {
                    return 'translate(' + chart.offsetX + 'px, ' + chart.offsetY + 'px)';
                });

            chart.setd3Layouts();
            chart.embedChart();
            chart.addCloseButton();

            return chart.graphGroup;

        };

        /**
         * Set the sizes for the chart based on either a d3 node or a javascript element
         */
        chart.setSizes = function(type)
        {

            if(type === 'd3')
            {
                chart.w = chart.parent.node().getBBox().width * 0.72222;
                chart.h = chart.parent.node().getBBox().height;
            }
            else
            {
                chart.w = chart.element.offsetWidth;
                chart.h = chart.element.offsetHeight;
            }

            chart.portholeDiameter = chart.w * 0.9;

            chart.portholeRadius = chart.portholeDiameter / 2;

            chart.chartDiameter = chart.w * 0.6;
            chart.radius = chart.w / 2;
            chart.offsetX = (chart.radius - (0.9 * chart.radius));
            chart.offsetY = 0 - chart.h * 0.4;
            chart.offsetX = 0 - chart.w * 0.55;
            chart.offsetY = 0 - chart.h * 0.4;
            chart.chartY = (chart.h / 2) - (chart.h * 0.2);
            chart.axisY = chart.h / 2;
        };

        /**
         * Set up the d3 layouts
         * @param type
         */
        chart.setd3Layouts = function(type)
        {

            var width = chart.w;

            if(chart.theme !== undefined)
            {
                width = chart.chartDiameter;
            }

            chart.x = d3.time.scale()
                .range([0, width]);

            chart.y = d3.scale.linear()
                .range([120, 0]);

            chart.line = d3.svg.line()
                .interpolate('cardinal')
                .x(function (d) {
                    return chart.x(d.date);
                })
                .y(function (d) {
                    return chart.y(d.value);
                });

            chart.x.domain(d3.extent(chart.values, function(d) {
                return d.date;
            }));
            chart.y.domain(d3.extent(chart.values, function(d) {
                return d.value;
            }));
        };

        /**
         * Draw the chart from a theme
         * @returns {*}
         */
        chart.drawThemeChart = function()
        {
            chart.drawLine(chart.theme.themeSecurity.hexColour);

            chart.graphText = chart.graphGroup.append('g')
                .attr('class', 'graph-text')
                .style('opacity', 0);

            chart.graphGroup.text = chart.graphText.append('text')
                .attr("transform", function(d){

                    chart.textWidth = chartHelperService.getTheD3TextWidth(d3.select(this));

                    var textX = 25 + (chart.chartDiameter / 2);

                    return 'translate(' + textX + ', 0)';
                })
                .append('tspan')
                .attr("class", function (d) {
                    return 'chart-label chart-label-' + helperService.slugify(chart.theme.label) + ' h2';
                })
                .attr('dy', '1em')
                .attr('text-anchor', 'middle')
                .style("fill", function (d) {
                    return chart.theme.themeSecurity.hexColour;
                })
                .text(function (d) {
                    return chart.theme.label;
                })
                .call(chartHelperService.wrapSVGText, 300);

            chart.graphText.append('text')
                .attr("transform", function(d){

                    chart.textWidth = chartHelperService.getTheD3TextWidth(d3.select(this));

                    var textX = 25 + (chart.chartDiameter / 2);

                    return 'translate(' + textX + ', 50)';
                })
                .append("tspan")
                .attr("class", function (d) {
                    return 'chart-label chart-label-' + helperService.slugify(chart.theme.label) + ' h5';
                })
                .attr('dy', '10em')
                .attr('font-family', 'Mark Pro')
                .attr('font-weight', '300')
                .attr('text-anchor', 'middle')
                .attr("fill", '#ffffff')
                .text(function (d) {
                    return helperService.truncateLength(chart.theme.themeSecurity.description, 100);
                })
                .call(chartHelperService.wrapSVGText, 300);

            chart.graphText.append('text')
                .attr("transform", function(d){

                    chart.textWidth = chartHelperService.getTheD3TextWidth(d3.select(this));

                    var textX = 25 + (chart.chartDiameter / 2);

                    return 'translate(' + textX + ', 110)';
                })
                .attr("class", function (d) {
                    return 'chart-label chart-label-' + helperService.slugify(chart.theme.label) + ' h4';
                })
                .attr('dy', '3em')
                .attr('font-family', 'Mark Pro')
                .attr('font-weight', '300')
                .attr('text-anchor', 'middle')
                .text('One year return ')
                .append("tspan")
                .style("fill", function (d) {
                    return chart.theme.themeSecurity.hexColour;
                })
                .text(function (d) {
                    return chart.theme.themeSecurity.oneMonthReturn + '%';
                })
                .call(chartHelperService.wrapSVGText, 300);

            chart.drawDots();

            chart.xAxis = d3.svg.axis()
                .orient("bottom")
                .scale(chart.x);

            chart.graphGroup.append("g")
                .attr("class", "xaxis axis")
                .attr("transform", "translate(25, " + chart.axisY + ")")
                .call(chart.xAxis);

            chart.drawButton();

            chart.graphText.transition()
                .duration(250)
                .style('opacity', 1);

            chart.addCloseButton();

            return chart.graphGroup;
        };

        /**
         * Update the theme from within the chart
         */
        chart.updateTheme = function()
        {
            chart.theme.selected = !chart.theme.selected;
            PubSub.publish('charts.securityPerformance.updateTheme', chart.theme);
            chart.zoomOutTheme();
        };

        /**
         * Draw the graph line
         * @param colour
         */
        chart.drawLine = function(colour)
        {
            chart.path = chart.graphGroup.append("path")
                .datum(chart.values)
                .attr("class", "line")
                .attr("transform", "translate(25, " + chart.chartY + ")")
                .attr('stroke-width', 2)
                .attr('fill', 'transparent')
                .attr('stroke', colour)
                .attr("d", chart.line);

            chart.totalLength = chart.path.node().getTotalLength();

            chart.path
                .attr("stroke-dasharray", chart.totalLength + " " + chart.totalLength)
                .attr("stroke-dashoffset", chart.totalLength)
                .transition()
                .duration(500)
                .ease("linear")
                .attr("stroke-dashoffset", 0);
        };

        /**
         * Draw dots at monthly
         */
        chart.drawDots = function()
        {
            chart.circles = chart.graphGroup.selectAll("dot")
                .data(chart.dotValues)
                .enter().append("svg:circle")
                .attr('class', 'circ')
                .attr("r", 3)
                .attr("cx", function(d, i) {
                    return chart.x(d.date);
                })
                .attr("cy", function(d, i) {
                    return chart.y(d.value);
                })
                .attr("transform", "translate(25, " + chart.chartY + ")")
                .style('fill', '#ffffff');
        };

        /**
         * Draw a button
         */
        chart.drawButton = function()
        {
            var buttonText = 'Add',
                buttonHeight = 45,
                buttonWidth = 120;

            if(chart.theme.selected)
            {
                buttonText = 'Remove'
            }

            chart.buttonGroup = chart.graphGroup.append('g')
                .attr('class', 'button-group')
                .style('opacity', 0)
                .attr("transform", function(d){

                    return 'translate(' + ((chart.chartDiameter / 2) - (buttonWidth / 4)) + ', ' + (chart.chartDiameter + 50) + ')';
                });

            chart.button = chart.buttonGroup.append('rect')
                .attr("width", 120)
                .attr("height", 45)
                .attr('rx', 15)
                .attr('ry', 30)
                .attr('fill', 'transparent')
                .attr('stroke', chart.theme.themeSecurity.hexColour)
                .attr('stroke-width', 2)
                .attr("class","btn btn-orange")
                .on('click', function() {
                    chart.updateTheme();
                });

            chart.buttonGroup.append('text')
                .attr('x', buttonWidth / 2)
                .attr('y', 27)
                .attr('font-size', '17px')
                .attr('text-anchor', 'middle')
                .attr('class','cursor cursor-pointer')
                .text(buttonText)
                .on('click', function() {
                    chart.updateTheme();
                });

            chart.buttonGroup.transition()
                .duration(250)
                .style('opacity', 1);

        };

        /**
         * Build the chart inside a parent d3 object
         * @returns {*}
         */
        chart.embedChart = function()
        {
            chart.drawLine(chart.parentData.colour);

            chart.graphGroup
                .append("text")
                .attr("class", function (d) {
                    return chart.parentData.group + ' h4';
                })
                .attr('dy', '1em')
                .attr('font-family', 'Mark Pro')
                .attr('font-weight', '300')
                .attr('text-anchor', 'middle')
                .style("fill", function (d) {
                    return chart.parentData.colour;
                })
                .text(function (d) {
                    return chart.parentData.group;
                })
                .attr("transform", function(d){

                    chart.textWidth = chartHelperService.getTheD3TextWidth(d3.select(this));

                    var textX = 25 + (chart.w / 2);

                    return 'translate(' + textX + ', 0)';
                })
                .call(chartHelperService.wrapSVGText, 300);

            chart.graphGroup
                .append("text")
                .attr("class", function (d) {
                    return chart.parentData.group + ' h3';
                })
                .attr('dy', '1em')
                .attr('font-family', 'Mark Pro')
                .attr('font-weight', '300')
                .attr('text-anchor', 'middle')
                .style("fill", function (d) {
                    return chart.parentData.colour;
                })
                .text(function (d) {
                    return chart.parentData.name;
                })
                .attr("transform", function(d){

                    chart.textWidth = chartHelperService.getTheD3TextWidth(d3.select(this));

                    var textX = 25 + (chart.w / 2);

                    return 'translate(' + textX + ', 30)';
                })
                .call(chartHelperService.wrapSVGText, 300);

            chart.drawDots();

            chart.padding = 100;

            chart.xAxis = d3.svg.axis()
                .orient("bottom")
                .scale(chart.x);

            chart.graphGroup.append("g")
                .attr("class", "xaxis axis")
                .attr("transform", "translate(25, " + chart.axisY + ")")
                .call(chart.xAxis);

            return chart.graphGroup;
        };


        /**
         * Build the chart from data and config
         * @returns {*}
         */
        chart.addCloseButton = function() {

            var colour = '#ffffff',
                translate = 'translate(' + chart.w +', 10)';

            if(chart.parentData !== undefined)
            {
                colour = chart.parentData.colour;
            }
            else if(chart.theme !== undefined)
            {
                colour = chart.theme.themeSecurity.hexColour;
                translate = 'translate(' + chart.chartDiameter +', 10)';
            }

            chart.close = chart.graphGroup
                .append('g')
                .style('opacity', 0)
                .style('cursor', 'pointer')
                .attr("transform", translate)
                .on('click', function(){
                    chart.zoomOut('click');
                });

            chart.close
                .append('circle')
                .attr('r', 25)
                .style('fill', '#2a2627')
                .style('stroke', colour)
                .style('stroke-width', 2);

            chart.close
                .append('text')
                .style('font-family', 'tiller-iconfont')
                .attr('text-anchor', 'middle')
                .attr('fill', colour)
                .style('color', colour)
                .attr('dy', '8px')
                .text('d');

            chart.close.transition()
                .duration(250)
                .attr('r', 15)
                .style('opacity', 1);

        };

        /**
         * Destroys the chart completely
         */
        chart.destroyChart = function()
        {
            chart.graphGroup.remove();
            chart = this;
        };

        chart.destroyParent = function()
        {
            chart.parent.remove();
        };

        /**
         * Zooms the embedded chart out and returns to previous state
         * @param e
         */
        chart.zoomOut = function(e)
        {
            if(chart.graphGroup !== undefined)
            {

                if(chart.theme !== undefined)
                {
                    chart.zoomOutTheme();
                }
                else
                {
                    chart.zoomOutEmbed();
                }

            }

        };

        /**
         * Zoom out from an embedded chart
         */
        chart.zoomOutEmbed = function()
        {
            chart.parent.transition()
                .duration(300)
                .attr('class', '')
                .each('start', function (d) {

                    chart.group.circle.transition()
                        .duration(450)
                        .attr('r', chart.group.circleData.r)
                        .style('fill', chart.group.circleData.colour)
                        .style('stroke-opacity', 0)
                        .each('end', function(){
                            chart.group.circle.transition()
                                .duration(0)
                                .style('stroke-width', 1)
                                .style('stroke-dasharray', (5, 5));
                        });

                    chart.group.text.attr('class', '');

                    chart.graphGroup.remove();

                    chart.group.sliceDotGroup.transition()
                        .duration(200)
                        .attr('opacity', 1);

                })
                .attr('transform', function (d) {
                    return 'translate(' + chart.parentData.x + ',' + chart.parentData.y + ')';
                });
        };

        /**
         * Zoom out from thw theme chart
         */
        chart.zoomOutTheme = function()
        {
            chart.parent.transition()
                .duration(300)
                .each('start', function (d) {

                    chart.outerCircle.transition()
                        .duration(450)
                        .attr('r', 0)
                        .attr('transform', function (d) {

                            return 'translate(' + chart.radius + ' , ' + chart.radius + ')';

                        })
                        .attr('stroke-width', 0);

                    chart.graphGroup.remove();

                })
                .each('end', function(){
                    PubSub.publish('charts.securityPerformance.close', false);
                    chart.destroyParent();
                    delete chart.theme;
                });
        };

    }]);