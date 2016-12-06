'use strict';

angular.module('chart.helperService', [])
    /*
     * Holds the user data collected within the app
     */
    .service('chart.helperService', function () {

        d3.selection.prototype.moveToFront = function () {
            return this.each(function () {
                this.parentNode.appendChild(this);
            });
        };

        this.wrapSVGText = function(text, width)
        {
            text.each(function() {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    y = text.attr("y"),
                    dy = 1.1,
                    tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr('class', 'inherit').attr("dy", dy + "em");
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr('class', 'inherit').attr("dy", dy + "em").text(word);
                    }
                }
            });
        };

        this.getTheD3TextWidth = function(d3Node)
        {
            var textWidth = d3Node.node().getBBox().width;


            if(textWidth > 300)
            {
                textWidth = 300;
            }

            return textWidth;

        };

        this.getDeSaturatedColour = function(){
            return '#333030';
        };


    });