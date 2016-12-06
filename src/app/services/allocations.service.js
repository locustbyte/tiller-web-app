'use strict';

angular.module('allocationsService', [])
    /*
     * Holds the user data collected within the app
     */
    .service('allocationsService', ['helperService', function (helperService) {

        /**
         * Set the chart colours object
         */
        this.setColours = function(colourPalletes)
        {

            var colours = {};

            colourPalletes.filter(function( obj )
            {
                if(obj.group === 'AssetClass' || obj.group === 'Theme')
                {
                    colours[obj.colourPaletteId] = obj.hexColour;
                }

            });

            this.colours = colours;
        };

        /**
         * Get a colour for an assetClass
         * @param theme
         * @returns {*}
         */
        this.getColour = function(colourPalleteId)
        {

            if(colourPalleteId === undefined)
                return '#ffffff';

            if(this.colours[colourPalleteId] !== undefined)
            {
                return this.colours[colourPalleteId];
            }

            return '#ffffff'

        };

        /**
         * Build the data objects required by the chart
         * @param response
         * @returns {*|Array}
         */
        this.setAssetAllocations = function(data)
        {

            if(data.chartColourPalettes !== undefined)
            {
                this.setColours(data.chartColourPalettes);
            }

            this.assetAllocations = {};

            this.hasThemes = false;

            var i;

            for (i = 0; i < data.allocationsModels.length; i++) {

                var category = 'assetClass',
                    isTheme = false;

                if (data.allocationsModels[i].assetType === 'Theme' && this.assetAllocations[data.allocationsModels[i].assetType] === undefined)
                {
                    category = 'assetType';
                    isTheme = true;
                    this.hasThemes = true;
                }

                if(this.assetAllocations[helperService.slugify(data.allocationsModels[i][category])] === undefined)
                {
                    this.assetAllocations[helperService.slugify(data.allocationsModels[i][category])] = {
                        label: data.allocationsModels[i][category],
                        colour: this.getColour(data.allocationsModels[i].allocationsColourPaletteId),
                        percentage: 0
                    };

                    if(isTheme)
                    {
                        this.assetAllocations[helperService.slugify(data.allocationsModels[i][category])].children = [];
                    }

                }

                this.assetAllocations[helperService.slugify(data.allocationsModels[i][category])].percentage = parseInt(this.assetAllocations[helperService.slugify(data.allocationsModels[i][category])].percentage + (data.allocationsModels[i].weight * 100));

                if(isTheme)
                {
                    this.assetAllocations[helperService.slugify(data.allocationsModels[i][category])].children.push({
                        label: data.allocationsModels[i].name
                    });
                }
            }

        };

        this.getAssetAllocations = function()
        {

            return this.assetAllocations;

        };


        this.getAllocationsListData = function(data) {

            var data = data.allocationsModels;

            //console.log(data);

            for(var i=0; i< data.length; i++) {

                data[i].percentage = (data[i].weight * 100).toFixed(2);
                data[i].percentage = data[i].percentage % 1 === 0 ? parseInt(data[i].percentage, 10) : data[i].percentage;

            }

            return data;

        };

    }]);