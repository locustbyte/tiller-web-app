'use strict';

angular.module('helperService', [])
    /*
     * Holds the user data collected within the app
     */
    .service('helperService', function () {

        this.slugify = function(str)
        {
            return str.toString().toLowerCase()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                .replace(/^-+/, '')             // Trim - from start of text
                .replace(/-+$/, '');            // Trim - from end of text
        };

        this.isEmptyObj = function(obj) {
            for(var key in obj) {
                if(obj.hasOwnProperty(key))
                    return false;
            }
            return true;
        };

        this.formatMoney = function(value)
        {
            return '£' + value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        };

        this.formatK = function(value)
        {

            if(value > 999)
            {
                return '£' + (value/1000).toFixed(0) + 'K';
            }

            return value;
        };

        this.percentageGrowth = function(startValue, endValue)
        {
            var difference = endValue - startValue;

            return difference / startValue * 100;
        };

        this.truncateLength = function(str, length)
        {
            var trancatedStr = str.substr(0, length);

            return trancatedStr.substr(0, Math.min(trancatedStr.length, trancatedStr.lastIndexOf(" ")));

        };

        this.serialize = function(obj) {
            var str = [];
            for(var p in obj)
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            return str.join("&");
        };


    });