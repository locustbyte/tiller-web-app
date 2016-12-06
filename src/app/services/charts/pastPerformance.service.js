'use strict';

angular.module('chart.pastPerformanceService', [])
    /*
     * Holds the user data collected within the app
     */
    .service('chart.pastPerformanceService', ['chart.helperService', function(chartHelperService) {

       var chart = this;

        /**
         * Se the values used in the service
         * @param data
         * @param user
         */
        chart.setValues = function(data, user)
        {
            chart.data = data;
            chart.user = user;

            angular.extend(chart, data);

            if(chart.indice === undefined)
            {
                chart.indice = chart.data.indices[0];
            }

            chart.setRangeValues();

            chart.setIndiceValues();

            chart.setPortfolioValues();

            return this;

        };


        /**
         * Set the entire range values of the chart
         */
        chart.setRangeValues = function()
        {
            chart.rangeValues = [];

            for(i=0; i < chart.portfolioPerformanceHistory.length; i++)
            {
                chart.rangeValues.push({
                    date: new Date(chart.portfolioPerformanceHistory[i].performanceDate),
                    value: chart.portfolioPerformanceHistory[i].value
                });
            }

            for(i=0; i < chart.indicePerformanceHistory.length; i++)
            {
                chart.rangeValues.push({
                    date: new Date(chart.indicePerformanceHistory[i].indicesDate),
                    value: chart.indicePerformanceHistory[i].totalReturn
                });
            }

        };


        /**
         * Set the aspect ration of the chart
         * @param value
         */
        chart.setAspectRatio = function(value)
        {
            chart.aspectRatio = value;
        };

        chart.setYears = function(years)
        {
            chart.years = years;
        };

        chart.getYears = function()
        {
            return chart.years;
        };

        chart.setCurrentIndice = function(indice)
        {
            chart.indice = indice;
        };

        chart.getCurrentIndice = function()
        {
            return chart.indice;
        };

        /**
         * Set the indice values
         */
        chart.setIndiceValues = function()
        {
            chart.indiceValues = [];

            chart.indicePerformanceHistory.filter(function( obj )
            {
                if(obj.indiceId === chart.indice.indiceId)
                {
                    chart.indiceValues.push({
                        date: new Date(obj.indicesDate),
                        value: obj.totalReturn
                    });
                }
            });
        };

        /**
         * Set our portfolio values
         */
        chart.setPortfolioValues = function()
        {
            chart.portfolioValues = [];

            for(i=0; i < chart.portfolioPerformanceHistory.length; i++)
            {
                chart.portfolioValues.push({
                    date: new Date(chart.portfolioPerformanceHistory[i].date),
                    value: chart.portfolioPerformanceHistory[i].value
                });
            }
        };

        /**
         * Set the target element for the chart
         * @param element
         */
        chart.setElement = function(id)
        {
            chart.element = document.getElementById(id);
        };

        /**
         * Create the chart
         * @returns {*}
         */
        chart.createChart = function() {

            if(chart.element === undefined)
            {
                chart.setElement('pastPerformanceChart');
            }

            if(chart.element !== undefined)
            {

                chart.w = chart.element.offsetWidth;
                chart.h = chart.w * chart.aspectRatio;
                chart.chartOffsetY = 70;
                chart.chartHeight = chart.h * 0.7;
                chart.chartWidth = chart.w - (chart.chartOffsetY + 25);

                chart.svg = d3.select(chart.element)
                    .append("svg")
                    .attr("width", chart.w)
                    .attr("height", chart.h);

                chart.graphGroup = chart.svg
                    .append("g")
                    .attr('transform', 'translate(' + chart.chartOffsetY + ',20)');

                chart.x = d3.time.scale()
                    .range([0, chart.chartWidth]);

                chart.y = d3.scale.linear()
                    .range([chart.chartHeight, 0]);

                chart.yLower = d3.scale.linear()
                    .range([chart.chartHeight, 0]);

                chart.area = d3.svg.area()
                    .x(function (d, i) {
                        return chart.x(d.date);
                    })
                    .y0(function (d) {
                        return chart.y(d.lowValue);
                    })
                    .y1(function (d) {
                        return chart.y(d.highValue);
                    });

                chart.line = d3.svg.line()
                    .x(function (d) {
                        return chart.x(d.date);
                    })
                    .y(function (d) {
                        return chart.y(d.value);
                    });

                chart.x.domain(d3.extent(chart.rangeValues, function (d) {
                    return d.date;
                }));

                chart.y.domain(d3.extent(chart.rangeValues, function (d) {
                    return d.value;
                }));

                chart.buildIndiceLine();

                chart.buildPortfolioLine();

                chart.buildAxis();
            }

        };

        /**
         * Update the indice graph with new data
         * @param indiceId
         */
        chart.updateChartIndice = function(indice)
        {
            chart.indice = indice;
            chart.setIndiceValues();
            chart.updateIndiceLine();
        };

        /**
         * Build the lines on the chart chart from portfolioValues provided by the service
         * @returns {*}
         */
        chart.buildPortfolioLine = function()
        {

            chart.portfolioPath = chart.graphGroup.append("path")
                .datum(chart.portfolioValues)
                .attr("class", "line")
                .attr('stroke', chart.getLineColour('portfolio'))
                .attr('stroke-width', 2)
                .attr('fill', 'transparent')
                .attr("d", chart.line);

            chart.totalLength = chart.portfolioPath.node().getTotalLength();

            chart.portfolioPath
                .attr("stroke-dasharray", chart.totalLength + " " + chart.totalLength)
                .attr("stroke-dashoffset", chart.totalLength)
                .transition()
                .duration(500)
                .ease("linear")
                .attr("stroke-dashoffset", 0);

            /**
             * Build the dots on the line
             */
            /*chart.portfolioDots = chart.graphGroup.selectAll('circle.dot-portfolio')
                .data(chart.portfolioValues)
                .enter()
                .append('circle')
                .attr("class", "dot dot-portfolio")
                .attr('r', 3)
                .attr('cx', function(d){
                    return chart.x(d.date);
                })
                .attr('cy', chart.h)
                .style('opacity', 0)
                .attr('fill', '#2a2627')
                .attr('stroke', chart.getLineColour('portfolio'))
                .attr('stroke-width', 1);

            chart.portfolioDots.moveToFront();

            chart.portfolioDots.transition()
                .duration(250)
                .attr('cy', function(d){
                    return chart.y(d.value);
                })
                .style('opacity', 1);*/


        };

        /**
         * Build the lines on the chart chart from indiceValues provided by the service
         * @returns {*}
         */
        chart.buildIndiceLine = function()
        {

            chart.indicePath = chart.graphGroup.append("path")
                .datum(chart.indiceValues)
                .attr("class", "line")
                .attr('stroke', chart.getLineColour('indice'))
                .attr('stroke-width', 2)
                .attr('fill', 'transparent')
                .attr("d", chart.line);

            chart.totalLength = chart.indicePath.node().getTotalLength();

            chart.indicePath
                .attr("stroke-dasharray", chart.totalLength + " " + chart.totalLength)
                .attr("stroke-dashoffset", chart.totalLength)
                .transition()
                .duration(500)
                .ease("linear")
                .attr("stroke-dashoffset", 0);

            /**
             * Build the dots on the line
             */
            /*chart.indiceDots = chart.graphGroup.selectAll('circle.dot-indice')
                .data(chart.indiceValues)
                .enter()
                .append('circle')
                .attr("class", "dot dot-indice")
                .attr('r', 3)
                .attr('cx', function(d){
                    return chart.x(d.date);
                })
                .attr('cy', 0)
                .style('opacity', 0)
                .attr('fill', '#2a2627')
                .attr('stroke', chart.getLineColour('indice'))
                .attr('stroke-width', 1);

            chart.indiceDots.moveToFront();

            chart.indiceDots.transition()
                .duration(250)
                .attr('cy', function(d){
                    return chart.y(d.value);
                })
                .style('opacity', 1);*/

        };

        /**
         * Updates the entire chart (all lines)
         */
        chart.updateChart = function()
        {
            chart.updateAxis();
            chart.updatePortfolioLine();
            chart.updateIndiceLine();
        };

        /**
         * Updates the user portfolio line
         */
        chart.updatePortfolioChart = function()
        {
            chart.updateAxis();
            chart.updatePortfolioLine();
        };

        /**
         * Build the lines on the chart chart from indiceValues provided by the service
         * @returns {*}
         */
        chart.updateIndiceLine = function()
        {
            chart.indicePath.remove();

            chart.indicePath = chart.graphGroup.append("path")
                .datum(chart.indiceValues)
                .attr("class", "line")
                .attr('stroke', chart.getLineColour('indice'))
                .attr('stroke-width', 2)
                .attr('fill', 'transparent')
                .attr("d", chart.line);

            chart.totalLength = chart.indicePath.node().getTotalLength();

            chart.indicePath
                .attr("stroke-dasharray", chart.totalLength + " " + chart.totalLength)
                .attr("stroke-dashoffset", chart.totalLength)
                .transition()
                .duration(500)
                .ease("linear")
                .attr("stroke-dashoffset", 0);

            /*chart.indiceDots = chart.graphGroup.selectAll('circle.dot-indice')
                .data(chart.indiceValues);

            chart.indiceDots.moveToFront();

            chart.indiceDots.transition()
                .duration(250)
                .attr('cy', function(d){
                    return chart.y(d.value);
                })
                .style('opacity', 1);*/
        };


        /**
         * Build the lines on the chart chart from portfolioValues provided by the service
         * @returns {*}
         */
        chart.updatePortfolioLine = function()
        {
            chart.portfolioPath.remove();

            chart.portfolioPath = chart.graphGroup.append("path")
                .datum(chart.portfolioValues)
                .attr("class", "line")
                .attr('stroke', chart.getLineColour('portfolio'))
                .attr('stroke-width', 2)
                .attr('fill', 'transparent')
                .attr("d", chart.line);

            chart.totalLength = chart.portfolioPath.node().getTotalLength();

            chart.portfolioPath
                .attr("stroke-dasharray", chart.totalLength + " " + chart.totalLength)
                .attr("stroke-dashoffset", chart.totalLength)
                .transition()
                .duration(250)
                .ease("linear")
                .attr("stroke-dashoffset", 0);

            /*chart.portfolioDots = chart.graphGroup.selectAll('circle.dot-portfolio')
                .data(chart.portfolioValues);

            chart.portfolioDots.moveToFront();

            chart.portfolioDots.transition()
                .duration(250)
                .attr('cy', function(d){
                    return chart.y(d.value);
                })
                .style('opacity', 1);*/
        };

        chart.buildAxis = function()
        {
            chart.yAxis = d3.svg.axis()
                .orient("left")
                .scale(chart.y)
                .ticks(3)
                .tickFormat(function(d) {
                    var format = d3.format(",d");
                    return '£' + format(d)
                });

            chart.graphGroup.append("g")
                .attr("class", "yaxis axis")
                .call(chart.yAxis);

            chart.yAxisLabel = chart.svg.append("text")
                .attr("class", "y label")
                .attr("transform", function(d){
                    return 'translate(15, 18)';
                })
                .append('tspan')
                .attr('text-anchor', 'right')
                .style('font-size', '15px')
                .text('Value');


            if(chart.years < 3)
            {
                chart.xAxis = d3.svg.axis()
                    .scale(chart.x)
                    .ticks(4)
                    .tickFormat(d3.time.format("%b %y"));
            }
            else
            {
                chart.xAxis = d3.svg.axis()
                    .scale(chart.x)
                    .ticks(4)
                    .tickFormat(d3.time.format("%Y"));
            }

            chart.graphGroup.append("g")
                .attr("class", "xaxis axis")
                .attr("transform",  "translate(0, " + chart.chartHeight + ")")
                .call(chart.xAxis);

            if(chart.years < 3)
            {
                chart.graphGroup.select(".xaxis")
                    .selectAll("text")
                    .style("font-size", "13px");
            }
            else
            {
                chart.xAxis = d3.svg.axis()
                    .orient("bottom")
                    .scale(chart.x)
                    .ticks(4)
                    .tickFormat(d3.time.format("%Y"));
            }

            chart.xAxisLabel = chart.svg.append("text")
                .attr("class", "x label")
                .attr("transform", function(d){

                    chart.textWidth = chartHelperService.getTheD3TextWidth(d3.select(this));

                    var textX = (chart.w / 2) - chart.textWidth;

                    return 'translate(' + textX + ', ' + chart.h + ')';
                })
                .append('tspan')
                .attr("text-anchor", "middle")
                .style('font-size', '15px')
                .text("Years");

        };

        chart.updateAxis = function()
        {

            chart.x.domain(d3.extent(chart.rangeValues, function(d) {
                return d.date;
            }));

            chart.y.domain(d3.extent(chart.rangeValues, function(d) {
                return d.value;
            }));


            if(chart.years < 3)
            {
                chart.xAxis = d3.svg.axis()
                    .orient("bottom")
                    .scale(chart.x)
                    .ticks(5)
                    .tickFormat(d3.time.format("%M"));
            }

            chart.xAxis = d3.svg.axis()
                .orient("bottom")
                .scale(chart.x)
                .ticks(5)
                .tickFormat(d3.time.format("%Y"));

            chart.graphGroup.append("g")
                .attr("class", "xaxis axis")
                .attr("transform",  "translate(0, " + chart.chartHeight + ")")
                .call(chart.xAxis);


        };

        /**
         * Destroys the chart completely
         */
        chart.destroyChart = function()
        {

            if(chart.svg !== undefined)
            {
                chart.svg.remove();
            }
        };

        chart.chartIsBuilt = function()
        {
            if(chart.svg === undefined)
            {
                return false;
            }

            return true;
        };

        chart.getLineColour = function(type)
        {

            switch(type)
            {
                case 'portfolio':
                    return '#35db9b';

                case 'indice':

                    return '#FFAA19';

                default:
                    return 'white';
            }

        };

    }]);