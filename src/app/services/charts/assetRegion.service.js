'use strict';

angular.module('chart.assetRegionService', [])
    /*
     * Holds the user data collected within the app
     */
    .service('chart.assetRegionService', ['restService', 'helperService', 'PubSub', function (restService, helperService, PubSub) {

        var chart = this;

        chart.setRegionData = function(data)
        {
            if(data.chartColourPalettes !== undefined)
            {
                chart.colourPallets = data.chartColourPalettes;

                chart.setColours();
            }

            chart.regions = {};

            chart.lastWeight = 0;
            chart.totalWeight = undefined;

            //console.log('Region weight calculations');

            angular.forEach(data.allocationsModels, function(asset, key){

                chart.weight = chart.getSize(asset.weight);

                var regionSlug = helperService.slugify(asset.region);

                if(chart.totalWeight === undefined)
                {
                    chart.totalWeight = (chart.lastWeight + chart.weight);
                }
                else
                {
                    chart.totalWeight = chart.totalWeight + chart.weight;
                }


                //console.log(chart.lastWeight + ' + ' + chart.weight + ' = ' + chart.totalWeight);

                chart.lastWeight = chart.totalWeight;

                if(chart.regions[regionSlug] === undefined)
                {
                    chart.regions[regionSlug] = {
                        name: asset.region,
                        weight: chart.weight,
                        size: chart.weight,
                        radius: chart.weight,
                        px: 300,
                        py: 300,
                        x: 300,
                        y: 300,
                        percentage: chart.weight,
                        colour: chart.getRegionColour(asset.regionColourPaletteId)
                    };
                }
                else
                {
                    chart.regions[regionSlug].weight = chart.regions[regionSlug].weight + chart.weight;
                    chart.regions[regionSlug].size = chart.regions[regionSlug].size + chart.weight;
                    chart.regions[regionSlug].percentage = chart.regions[regionSlug].percentage + chart.weight;
                }
            });

            chart.data = {
                children: []
            };

            if(chart.colourPallets !== undefined)
            {
                chart.setLegend();
            }

            angular.forEach(chart.regions, function(region, key){
                region.percentage = Math.round(region.percentage);
                chart.data.children.push(region);
            });

            //console.log(chart.data);

        };

        /**
         * Set the legend object for building the chart legend
         */
        chart.setLegend = function()
        {
            chart.legend = [];

            angular.forEach(chart.regions, function(region, key){
                chart.legend.push({
                    name: region.name,
                    colour: region.colour,
                    percentage: region.percentage.toFixed(0) + '%'
                })
            });

            PubSub.publish('charts.assetRegion.legend.updated', chart.legend);
        };

        /**
         * Get the legend object for use in displaying the chart legend in the chart controller
         * @returns {*}
         */
        chart.getLegend = function()
        {
            if(chart.legend !== undefined)
            {
                return chart.legend;
            }

            return false;
        };

        /**
         * Set up the colours object within the service so each region is allocated a colour from the api
         */
        chart.setColours = function()
        {

            chart.colours = {};

            chart.colourPallets.filter(function( obj )
            {
                if(obj.group === 'Region')
                {
                    chart.colours[obj.colourPaletteId] = obj.hexColour;
                }

            });
        };


        /**
         * Get the region colour from the service
         * @param region
         * @returns {*}
         */
        chart.getRegionColour = function(regionColourPaletteId)
        {

            if(regionColourPaletteId === undefined)
                return '#ffffff';

            if(chart.colours[regionColourPaletteId] !== undefined)
            {
                return chart.colours[regionColourPaletteId];
            }

            return '#ffffff'

        };

        /**
         * Get a standardised size value of an asset
         * @param weight
         * @returns {Number}
         */
        chart.getSize = function(weight)
        {

            return (weight * 100 / 1);
        };

        /**
         * Draw the chart
         * @param element
         */
        chart.createChart = function(element) {

            chart.element = element;
            chart.setSizes();
            chart.setupChart();
            chart.buildChart();
        };

        /**
         * Destroy the chart svg
         */
        chart.destroy = function()
        {
            chart.lastWeight = undefined;
            chart.totalWeight = undefined;
            chart.svg.remove();
        };

        /**
         * Set up the chart structure
         */
        chart.setupChart = function()
        {
            chart.svg = d3.select(chart.element)
                .append("svg")
                .attr("width", chart.width)
                .attr("height", chart.height);

            chart.circles = chart.svg
                .append("g")
                .attr("class", "regions");

            chart.circles.attr("transform", "translate(" + (chart.radius - (chart.radius * chart.offsetBoundaryratio )) + "," + (chart.radius - (chart.radius * chart.offsetBoundaryratio )) + ")");

            chart.pack = d3.layout.pack()
                .size([(chart.width * chart.offsetBoundaryratio), (chart.height * chart.offsetBoundaryratio)])
                .value(function (d) {
                    return d.size;
                })
                .padding(chart.padding);
        };

        /**
         * Build all chart elements
         */
        chart.buildChart = function()
        {

            chart.animateRegions();

        };

        /**
         * Animate the regions on load
         */
        chart.animateRegions = function()
        {

            chart.regionNodes = chart.pack
                .nodes(chart.data)
                .filter(function (d) {
                    return !d.children;
                });

            chart.nodeGroups = chart.circles
                .selectAll('g')
                .data(chart.regionNodes);

            chart.nodeGroup = chart.nodeGroups
                .enter()
                .append("g")
                .attr('transform', function (d) {
                    d.px = d.x;
                    d.py = d.y;
                    return 'translate(' + d.x + ',' + d.y + ')';
                });

            chart.nodeGroup
                .append("circle")
                .attr('r', function (d) {
                    return d.r;
                })
                .attr('class', function (d) {
                    return d.name;
                })
                .attr('fill', 'transparent')
                .attr('stroke-width', 2)
                .attr('stroke', function(d){
                    return d.colour;
                });


            chart.nodeGroup
                .append("text")
                .append('tspan')
                .attr("text-anchor", "middle")
                .text(function (d) {
                    return d.name;
                });

            chart.nodeGroup
                .append("text")
                .append('tspan')
                .attr('dy', '1em')
                .attr("text-anchor", "middle")
                .text(function (d) {
                    return d.percentage + '%';
                });


        };

        /**
         * Update the regions with data
         */
        chart.updateRegions = function()
        {
            chart.regionNodes = chart.pack
                .nodes(chart.data)
                .filter(function (d) {
                    return !d.children;
                });

            chart.nodeGroups = chart.circles
                .selectAll('g')
                .data(chart.regionNodes);

            chart.nodeGroups.selectAll('text').remove();

            chart.nodeGroups.transition()
                .delay(250)
                .each('start', function (d) {
                    d3.select(this).select('circle').transition()
                        .delay(100)
                        .attr('r', d.r);
                })
                .attr('r', function (d) {
                    return d.r;
                })
                .attr('transform', function (d) {
                    return 'translate(' + d.x + ',' + d.y + ')';
                })
                .each('end', function (d) {

                    chart.nodeGroup
                        .append("text")
                        .append('tspan')
                        .attr("text-anchor", "middle")
                        .text(function (d) {
                            return d.name;
                        });

                    chart.nodeGroup
                        .append("text")
                        .append('tspan')
                        .attr('dy', '1em')
                        .attr("text-anchor", "middle")
                        .text(function (d) {
                            return d.percentage + '%';
                        });

                 });
        };


        chart.key = function (d) {
            return d.data.label;
        };

        /**
         * Define all the chart sizes
         */
        chart.setSizes = function()
        {
            chart.width = chart.element.offsetWidth;
            chart.height = chart.element.offsetWidth;
            chart.radius = chart.width /2;
            chart.circleOffset = (chart.radius - (0.9 * chart.radius));
            chart.circleRelOffset = 0.9 * chart.radius;
            chart.offsetBoundaryratio = 0.85;
            chart.padding = 15;
            chart.textAllowedSize = 3;
        };

    }]);