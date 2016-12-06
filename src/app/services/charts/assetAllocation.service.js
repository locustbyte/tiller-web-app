'use strict';

angular.module('chart.assetAllocationService', [])
    /*
     * Holds the user data collected within the app
     */
    .service('chart.assetAllocationService', ['restService', 'chart.securityPerformanceService', 'helperService', 'PubSub', function (restService, chartSecurityPerformanceService, helperService, PubSub) {

        var chart = this;

        /**
         * Create the asset allocation chart
         * @param element - the javascript element to initialise the chart in
         * @param data - the data returned from the getAllocations api method
         */
        chart.createChart = function(element, data) {

            chart.element = element;
            chart.data = data;
            chart.setSizes();
            chart.setupChart();
            chart.buildChart();
        };

        /**
         * Set the sizes for the chart
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


        /**
         * Set the chart colours object
         */
        chart.setColours = function()
        {

            chart.colours = {};

            chart.colourPallets.filter(function( obj )
            {
                if(obj.group === 'AssetClass' || obj.group === 'Theme')
                {
                    chart.colours[obj.colourPaletteId] = obj.hexColour;
                }

            });
        };

        /**
         * Get a colour for an assetClass
         * @param theme
         * @returns {*}
         */
        chart.getThemeColour = function(colourPalleteId)
        {

            if(colourPalleteId === undefined)
                return '#ffffff';

            if(chart.colours[colourPalleteId] !== undefined)
            {
                return chart.colours[colourPalleteId];
            }

            return '#ffffff'

        };

        /**
         * Set the legend object for building the chart legend
         */
        chart.setLegend = function()
        {
            chart.legend = [];

            chart.colourPallets.filter(function( obj )
            {
                if(obj.group === 'AssetClass' || (chart.hasThemes && obj.group === 'Theme'))
                {

                    chart.legend.push({
                        name: obj.category,
                        group: helperService.slugify(obj.category),
                        class: 'chart-key-' + helperService.slugify(obj.category),
                        colour: obj.hexColour,
                        percentage: (chart.assetClassWeights[helperService.slugify(obj.category)] * 100).toFixed(0) + '%'
                    });
                }

            });

            PubSub.publish('charts.assetAllocation.legend.updated', chart.legend);
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
         * Build the data objects required by the chart
         * @param response
         * @returns {*|Array}
         */
        chart.setAllocations = function(response)
        {

            //console.log(response);

            if(response.data.chartColourPalettes !== undefined)
            {
                chart.colourPallets = response.data.chartColourPalettes;

                chart.setColours();
            }

            var assetClasses = [];

            chart.assetClassWeights = [];

            chart.data = [];

            chart.hasThemes = false;

            //console.log('number of allocations', response.data.allocationsModels.length, 'chart.data count', chart.data.length);

            var i;

            //console.log(response.data.allocationsModels);

            for (i = 0; i < response.data.allocationsModels.length; i++) {

                var category = 'assetClass';

                if (response.data.allocationsModels[i].assetType === 'Theme')
                {
                    category = 'assetType';

                    chart.hasThemes = true;

                }

                if (assetClasses.indexOf(response.data.allocationsModels[i][category]) === -1)
                {
                    assetClasses.push(response.data.allocationsModels[i][category]);

                    chart.assetClassWeights[helperService.slugify(response.data.allocationsModels[i][category])] = response.data.allocationsModels[i].weight;

                    chart.data.push({
                        label: helperService.slugify(response.data.allocationsModels[i][category]),
                        colour: chart.getThemeColour(response.data.allocationsModels[i].allocationsColourPaletteId),
                        children: []
                    });

                }
                else
                {
                    chart.assetClassWeights[helperService.slugify(response.data.allocationsModels[i][category])] = chart.assetClassWeights[helperService.slugify(response.data.allocationsModels[i][category])] + response.data.allocationsModels[i].weight;
                }

                var size = chart.getAllocationSize(response.data.allocationsModels[i].weight);

                chart.data.filter(function( obj )
                {
                    //console.log(obj.label, helperService.slugify(response.data.allocationsModels[i][category]));
                    if(obj.label === helperService.slugify(response.data.allocationsModels[i][category]))
                    {
                        obj.children.push({
                            name: response.data.allocationsModels[i].name,
                            isin: response.data.allocationsModels[i].isin,
                            sedol: response.data.allocationsModels[i].sedol,
                            size: size,
                            group: helperService.slugify(response.data.allocationsModels[i][category]),
                            cluster: response.data.allocationsModels[i][category],
                            radius: size,
                            px: 300,
                            py: 300,
                            x: 300,
                            y: 300,
                            colour: obj.colour,
                            percentage: (response.data.allocationsModels[i].weight * 100).toFixed(2)
                        });
                    }
                });

            }

            for (i = 0; i < chart.data.length; i++) {
                chart.data[i].value = chart.assetClassWeights[helperService.slugify(assetClasses[i])];
                chart.data[i].percentage = (chart.assetClassWeights[helperService.slugify(assetClasses[i])] * 100).toFixed(2);
            }

            if(chart.colourPallets !== undefined)
            {
                chart.setLegend();
            }

            //console.log(chart.data);

            return chart.data;
        };

        chart.getAllocationSize = function(weight)
        {

            return parseInt(weight * 100);
        };

        chart.getAssetClusters = function(data)
        {

            var clusters = [];

            for (i = 0; i < data.length; i++) {

                var cluster = {
                    label: data[i].label,
                    x: 0,
                    y: 0
                };

                clusters.push(cluster);

            }

            return clusters;
        };

        chart.destroy = function()
        {
            chart.svg.remove();
        };

        chart.setupChart = function()
        {
            chart.svg = d3.select(chart.element)
                .append("svg")
                .attr("width", chart.width)
                .attr("height", chart.height);

            /*chart.svg = d3.select(chart.element)
                .append("svg")
                .attr("width", '100%')
                .attr("height", '100%')
                .attr('viewbox', '0 0 820 820')
                .attr('preserveAspectRatio', 'xMidYMid meet');*/

            chart.chartGroup = chart.svg.append("g")
                .attr("class", "doughpie");

            chart.chartGroup.append("g")
                .attr("class", "slices");
            chart.chartGroup.append("g")
                .attr("class", "labels");
            chart.chartGroup.append("g")
                .attr("class", "lines");


            chart.pie = d3.layout.pie()
                .sort(null)
                .value(function (d) {
                    return d.value;
                })
                .padAngle(.02);

            chart.arc = d3.svg.arc()
                .outerRadius(chart.radius * 0.9)
                .innerRadius(chart.radius * 0.89)
                .cornerRadius(4);

            chart.outerArc = d3.svg.arc()
                .innerRadius(chart.radius * 0.92)
                .outerRadius(chart.radius * 0.92);

            chart.chartGroup.attr("transform", "translate(" + chart.radius + "," + chart.radius + ")");

            chart.assets = chart.svg
                .append("g")
                .attr("class", "assets");

            chart.assets.attr("transform", "translate(" + (chart.radius - (chart.radius * chart.offsetBoundaryratio )) + "," + (chart.radius - (chart.radius * chart.offsetBoundaryratio )) + ")");

            chart.dots = chart.svg.append("g")
                .attr("class", "dots");

            chart.dots.attr("transform", "translate(" + chart.radius + "," + chart.radius + ")");

            chart.pack = d3.layout.pack()
                .sort(function comparator(a, b) {
                    return a.group.length - b.group.length;
                })
                .size([(chart.width * chart.offsetBoundaryratio), (chart.height * chart.offsetBoundaryratio)])
                .value(function (d) {
                    return d.size;
                })
                .padding(chart.padding);
        };

        chart.buildChart = function()
        {

            chart.sliceDots = [];

            chart.animatePieSlices();

            //chart.animateSliceDots();

            chart.animateAssets();

        };

        chart.zoomIn = function(){

            chart.canZoom = false;

            //console.log(chart.asset);

            chart.asset.transition()
                .duration(300)
                .attr('class', 'node-group-active')
                .each('start', function (d) {

                    chart.embedAttempts = 0;
                    chart.securityChartDataSetup = false;
                    chart.securityChartTransitionFinished = false;

                    chart.assetData = d;

                    chart.circle = chart.asset.select('circle')
                        .style('stroke-width', 6)
                        .style('stroke-dasharray', (0, 0));

                    chart.circle.transition()
                        .duration(450)
                        .attr('r', function (c) {
                            chart.circleData = c;
                            return chart.radius * 0.9;
                        })
                        .style('fill', '#2a2627')
                        .style('stroke-opacity', 1)
                        .each('end', function(){
                            chart.loader = chart.asset.append('image')
                                .attr('xlink:href','assets/img/loading-ripple.svg')
                                .attr('width', chart.radius)
                                .attr('height', chart.radius)
                                .attr('transform', function (d) {
                                    return 'translate(-' + (chart.radius / 2) + ' , -' + (chart.radius / 2) + ')';
                                });
                        });

                    chart.text = chart.asset.select('text');

                    chart.text.attr('class', 'hidden');

                    chart.sliceDotContainer.transition()
                        .duration(200)
                        .attr('opacity', 0);

                    //console.log(chart.assetData.name);
                    //console.log('asset isin', chart.assetData.isin);

                    if(chart.assetData.isin.length > 0)
                    {
                        chart.securityIdentifier = chart.assetData.isin;
                    }
                    else if(chart.assetData.sedol.length > 0)
                    {
                        chart.securityIdentifier = chart.assetData.sedol;
                    }
                    else if(chart.assetData.name === 'Cash')
                    {
                        chart.securityIdentifier = 'cash';
                    }

                    restService.getSecurityHistoricPerformance(chart.securityIdentifier).then(function (response) {

                        chart.historicChart = {
                            parent: chart.asset,
                            parentData: chart.assetData,
                            group: {
                                circle: chart.circle,
                                circleData: chart.circleData,
                                text: chart.text,
                                sliceDotGroup: chart.sliceDotContainer
                            }
                        };

                        if (response !== false) {

                            chartSecurityPerformanceService.setValues(response);

                            chart.securityChartDataSetup = true;

                            chart.maybeEmbed();

                        }
                        else
                        {
                            chart.abortEmbed();
                        }

                    });

                })
                .attr('transform', function (d) {

                    return 'translate(' + chart.width * 0.425 + ' , ' + chart.height * 0.425 + ')';

                })
                .each('end', function () {
                    chart.securityChartTransitionFinished = true;
                    chart.maybeEmbed();
                });
        };

        chart.maybeEmbed = function()
        {
            if(chart.securityChartDataSetup && chart.securityChartTransitionFinished)
            {
                chart.loader.transition()
                .duration(500)
                .style('opacity', 0)
                .each('end', function(){
                    chart.loader.remove();
                    chartSecurityPerformanceService.embed(chart.historicChart);
                    chart.securityChartDataSetup = false;
                    chart.securityChartTransitionFinished = false;
                });
            }

            chart.embedAttempts++;
        };

        /**
         * Abort the animation if no data returned form api
         */
        chart.abortEmbed = function()
        {

            chart.asset.transition()
                .duration(300)
                .attr('class', '')
                .each('start', function (d) {

                    chart.circle.transition()
                        .duration(450)
                        .attr('r', chart.circleData.r)
                        .style('fill', chart.circleData.colour)
                        .style('stroke-opacity', 0)
                        .each('end', function(){
                            chart.circle.transition()
                                .duration(0)
                                .style('stroke-width', 1)
                                .style('stroke-dasharray', (5, 5));
                        });

                    chart.text.attr('class', '');

                    chart.sliceDotGroup.transition()
                        .duration(200)
                        .attr('opacity', 1);

                })
                .attr('transform', function (d) {
                    return 'translate(' + chart.assetData.x + ',' + chart.assetData.y + ')';
                });
        };

        /**
         * Zoom out a zoomed in asset
         */
        chart.zoomOut = function()
        {

            if(chart.historicChart !== undefined)
            {
                chartSecurityPerformanceService.zoomOut();
                delete chart.historicChart;
            }

        };

        /**
         * Draw each asset nodes
         */
        chart.animateAssets = function()
        {
            chart.nodeData = chart.childData();

            chart.assetNodes = chart.pack
                .nodes(chart.nodeData)
                .filter(function (d) {
                    return !d.children;
                });

            chart.assets
                .selectAll('g')
                .remove();

            chart.nodeGroup = chart.assets
                .selectAll('g')
                .data(chart.assetNodes)
                .enter()
                .append("g")
                .attr('class', 'asset')
                .attr('transform', function (d) {
                    d.px = d.x;
                    d.py = d.y;
                    return 'translate(' + d.x + ',' + d.y + ')';
                })
                .on('click', function (d) {

                    chart.asset = d3.select(this);

                    if(chart.asset.attr('class') !== 'node-group-active')
                    {
                        chart.asset.moveToFront();

                        chart.zoomIn();
                    }

                });

            chart.circles = chart.nodeGroup
                .append("circle")
                .attr('r', function (d) {
                    return 0;
                })
                .attr('class', function (d) {
                    return d.group;
                })
                .style("fill", function (d) {
                    return d.colour;
                })
                .style("stroke-opacity", 0)
                .style("stroke", function (d) {
                    return d.colour;
                })
                .style("stroke-dasharray", (5, 5));

            chart.updateNodes();
        };

        /**
         * Animate pie slices
         */
        chart.animatePieSlices = function()
        {
            chart.slice = chart.chartGroup.select(".slices").selectAll("path.slice")
                .data(chart.pie(chart.data), chart.key);

            chart.slice
                .enter()
                .insert("path")
                .style("fill", function (d) {
                    return d.data.colour;
                })
                .attr("class", "slice")
                .style('opacity', 0);

            chart.slice
                .transition()
                .duration(1000)
                .each('start', function(d, i){
                    var a = ((d.startAngle - Math.PI / 2) + (d.endAngle - Math.PI / 2)) / 2,
                        circumferencePointX = parseInt((chart.radius * 0.895 * Math.cos(a))),
                        circumferencePointY = parseInt((chart.radius * 0.895 * Math.sin(a)));

                    chart.sliceDots.push({
                        x: circumferencePointX,
                        y: circumferencePointY,
                        colour: d.data.colour,
                        group: d.data.label,
                        percentage: Math.round(d.data.percentage) + '%'
                    });

                })
                .attrTween("d", function (d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function (t) {
                        return chart.arc(interpolate(t));
                    };
                })
                .style('opacity', 1)
                .each('end', function(d, i){

                    chart.animateSliceDots();

                });

            chart.slice.exit().remove();
        };

        chart.rebuildSliceDots = function()
        {
            if(chart.sliceDotContainer !== undefined)
            {
                chart.sliceDotContainer.remove();
                chart.sliceDotContainer = null;
                chart.animateSliceDots();
            }
        };

        /**
         * Animate the dots around the outside of the pie
         */
        chart.animateSliceDots = function()
        {

            chart.sliceDotContainer = chart.dots.selectAll('g')
                .data(chart.sliceDots);

            chart.sliceDotGroup = chart.sliceDotContainer
                .enter()
                .append('g')
                .attr('class', function(d){
                    return 'slice-dot-' + helperService.slugify(d.group);
                })
                .attr('transform', function (d) {
                    return 'translate(' + d.x + ',' + d.y + ')';
                })
                .on("mouseenter", function (d) {
                    chart.selection = d3.select(this);
                    chart.enlarge(chart.selection, d);
                    chart.filterOut(d.group);
                    PubSub.publish('charts.assetAllocation.legend.filter', d.group);
                })
                .on('mouseleave', function (d) {

                    chart.selection = d3.select(this);
                    chart.disenlarge(chart.selection, d);
                    chart.filterIn(d.group);
                    PubSub.publish('charts.assetAllocation.legend.unfilter', d.group);
                });

            chart.sliceDot = chart.sliceDotGroup
                .append('circle')
                .attr('r', function (d) {
                    return 0;
                })
                .attr("fill", function (d) {
                    return d.colour;
                })
                .style('opacity', 0);


            chart.sliceDotText = chart.sliceDotGroup
                .append("text")
                .attr("class", function (d) {
                    return d.group + " hidden";
                })
                .attr('dy', '0.4em')
                .attr("text-anchor", "middle")
                .text(function (d) {
                    return d.percentage;
                });

            chart.sliceDot.transition()
                .duration(200)
                .attr('r', function (d) {
                    return 8;
                })
                .style('opacity', 1);

        };

        /**
         * Direct method to filter out the assets based on their assetClass
         * @param assetClass
         */
        chart.filterAssetClass = function(assetClass)
        {
            chart.enlargeFromGroup(helperService.slugify(assetClass));
            chart.filterOut(helperService.slugify(assetClass));
        };


        /**
         * Direct method to filter in the assets based on their assetClass
         * @param assetClass
         */
        chart.unfilterAssetClass = function(assetClass)
        {
            chart.disenlargeFromGroup(helperService.slugify(assetClass));
            chart.filterIn(helperService.slugify(assetClass));
        };


        /**
         * Update assets on the chart
         */
        chart.updateNodes = function()
        {

            if (chart.oldAssetCount !== undefined)
            {

                if(chart.oldAssetCount < chart.assetNodes.length)
                {
                    chart.addAssets();
                }
                else if(chart.oldAssetCount > chart.assetNodes.length)
                {
                    chart.removeAssets();
                }

            }

            chart.nodeGroup.data(chart.assetNodes)
                .transition()
                .duration(250)
                .each('start', function (d) {
                    d3.select(this).selectAll('circle').transition()
                        .delay(100)
                        .attr('r', d.r)
                        .style('opacity', 1);
                })
                .attr('r', function (d) {
                    return d.r;
                })
                .attr('transform', function (d) {
                    return 'translate(' + d.x + ',' + d.y + ')';
                });

        };


        /**
         * Remove assets to the chart
         */
        chart.removeAssets = function()
        {
            chart.assets
                .selectAll('g.asset')
                .data(chart.assetNodes)
                .exit()
                .transition()
                .duration(250)
                .each('start', function () {
                    d3.select(this).selectAll('circle').transition()
                        .delay(100)
                        .attr('r', 0)
                        .style('opacity', 0);
                })
            ;
        };

        /**
         * Add assets to the chart
         */
        chart.addAssets = function()
        {

            chart.assets
                .selectAll('g')
                .data(chart.assetNodes)
                .enter()
                .append("g")
                .attr('class', 'asset')
                .attr('transform', function (d) {
                    d.px = d.x;
                    d.py = d.y;
                    return 'translate(' + d.x + ',' + d.y + ')';
                })
                .on('click', function (d) {

                    chart.asset = d3.select(this);

                    if (chart.asset.attr('class') !== 'node-group-active') {
                        chart.asset.moveToFront();

                        chart.zoomIn();
                    }
                })
                .append("circle")
                .attr('r', function (d) {
                    return d.r;
                })
                .attr('class', function (d) {
                    return d.group;
                })
                .style("fill", function (d) {
                    return d.colour;
                })
                .style("stroke-opacity", 0)
                .style("stroke", function (d) {
                    return d.colour;
                })
                .style("stroke-dasharray", (5, 5));
        };

        /**
         * Redraw the assets based on new data
         */
        chart.rebuildChart = function(data)
        {

            chart.data = data;

            chart.slice = chart.chartGroup.select(".slices").selectAll("path.slice")
                .data(chart.pie(chart.data), chart.key);

            chart.slice
                .enter()
                .insert("path")
                .style("fill", function (d) {
                    return d.data.colour;
                })
                .attr("class", "slice");

            chart.sliceDots = [];

            var sliceCount = 0;
            chart.slice
                .transition()
                .duration(1000)
                .each('start', function (d, i) {

                    var a = ((d.startAngle - Math.PI / 2) + (d.endAngle - Math.PI / 2)) / 2,
                        circumferencePointX = parseInt((chart.radius * 0.895 * Math.cos(a))),
                        circumferencePointY = parseInt((chart.radius * 0.895 * Math.sin(a)));

                    chart.sliceDots.push({
                        x: circumferencePointX,
                        y: circumferencePointY,
                        colour: d.data.colour,
                        group: d.data.label,
                        percentage: Math.round(d.data.percentage) + '%'
                    });

                })
                .attrTween("d", function (d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function (t) {
                        return chart.arc(interpolate(t));
                    };
                })
                .each('end', function(){

                    sliceCount++;

                    if(sliceCount === chart.sliceDots.length)
                    {
                        //console.log(chart.sliceDots);
                        chart.rebuildSliceDots();
                    }

                });

            chart.slice.exit().remove();

            //chart.animatePieSlices();

            /**
             * Animate assets
             */
            //chart.nodeGroups.remove();

            chart.nodeData = chart.childData();

            chart.animateAssets();

            /*chart.oldAssetCount = chart.assetNodes.length;

            chart.assetNodes = chart.pack
                .nodes(chart.nodeData)
                .filter(function (d) {
                    return !d.children;
                });
            chart.updateNodes();*/
        };

        /**
         * Prepares the node data for the bubble chart (strips out the parent data and merges all children)
         * @param data
         */
        chart.childData = function() {

            var childs = [];
            $.each(chart.data, function (index, value) {
                childs.push(value.children);
            });
            var merged = [].concat.apply([], childs);

            return $.extend(true, {}, {"children": merged});

        };

        chart.key = function (d) {
            return d.data.label;
        };

        /**
         * Enlarge the outside dot to expose the text
         * @param selection
         * @param d
         */
        chart.enlarge = function(selection) {
            selection.selectAll('circle').transition()
                .duration(200)
                .attr("r", 25)
                .ease('sine-in')
                .each('end', function (d) {
                    selection.selectAll('text').attr('class', d.group + ' text-colour text-colour-white');
                });
        };

        /**
         * Enlarge the outside dot to expose the text
         * @param selection
         */
        chart.enlargeFromGroup = function(group) {

            var selection = d3.selectAll('g.slice-dot-' + helperService.slugify(group));

            chart.enlarge(selection);

        };


        /**
         * Disenlarge the outside dot and hide the text
         * @param selection
         * @param d
         */
        chart.disenlarge = function(selection) {
            selection.selectAll('circle').transition()
                .each('start', function (d) {
                    selection.selectAll('text').attr('class', d.group + ' hidden');
                })
                .duration(200)
                .attr("r", 8)
                .ease('sine-in');
        };

        /**
         * Enlarge the outside dot to expose the text
         * @param selection
         * @param d
         */
        chart.disenlargeFromGroup = function(group) {

            var selection = d3.selectAll('g.slice-dot-' + helperService.slugify(group));

            chart.disenlarge(selection);

        };


        /**
         * Filter out assets based on active assetsClass
         * @param group
         */
        chart.filterOut = function(group) {
            var filtered = chart.assets.selectAll('circle:not(.' + group + ')');

            filtered.transition()
                .duration(250)
                .each('start', function (d) {
                    d3.select(this.nextElementSibling).style('opacity', 0.05);
                })
                .style("fill-opacity", .00)
                .style("stroke-opacity", 1)
                .ease('sin-in');
        };

        /**
         * Filter in assets based on active assetsClass
         * @param group
         */
        chart.filterIn = function(group) {

            var filtered = chart.assets.selectAll('circle:not(.' + group + ')');

            filtered.transition()
                .duration(250)
                .each('start', function (d) {
                    d3.select(this.nextElementSibling).style('opacity', 1);
                })
                .style("fill-opacity", 1)
                .style("stroke-opacity", 0)
                .attr("dy", ".3em")
                .style("text-anchor", "middle")
                .ease('sin-in');
        };



    }]);