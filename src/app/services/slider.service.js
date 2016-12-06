'use strict';

angular.module('sliderService', [])

    .service('sliderService', ['$rootScope', '$location', 'PubSub', 'helperService', function ($rootScope, $location, PubSub, helperService) {

        if($rootScope.sliders === undefined)
        {
            $rootScope.sliders = {};
        }

        this.enableReRouting = true;

        this.setSliderData = function(key, data)
        {
            this.reRouteIfServiceNotReady(key);

            if($rootScope.sliders[key] === undefined)
            {
                $rootScope.sliders[key] = {};
            }

            $rootScope.sliders[key].data = {
                value: data,
                numericValue: data,
                reset: false
            };
        };

        this.setSliderModel = function(key, data)
        {

            if($rootScope.sliders[key] === undefined)
            {
                $rootScope.sliders[key] = {};
            }

            $rootScope.sliders[key].model = data;


        };

        this.setSliderValidationModel = function(key, model)
        {

            if($rootScope.sliders[key] === undefined)
            {
                $rootScope.sliders[key] = {};
            }

            $rootScope.sliders[key].validationModel = model;

        };

        this.setSliderOptions = function(key, options)
        {

            if($rootScope.sliders[key] === undefined)
            {
                $rootScope.sliders[key] = {};
            }

            $rootScope.sliders[key].options = options;

        };

        this.slidersAreValid = function()
        {
            angular.forEach($rootScope.sliders, function(slider, key) {
                if(!slider.validationModel.isValid)
                {
                    return false;
                }
            });

            return true;
        };

        this.navigateToSlider = function(slideName) {
            $location.path('/discovery/profiling/' + slideName);
        };

        this.navigateNext = function()
        {
            var currentStep = $rootScope.currentUIState.current.name.replace('discovery.profiling.','')
            var nextStep;
            switch(currentStep)
            {
                case 'lumpSum':
                    nextStep = '/discovery/profiling/top-up';
                    break;
                case 'topUp':
                    nextStep = '/discovery/profiling/target';
                    break;
                case 'target':
                    nextStep = '/discovery/profiling/total-years';
                    break;
                case 'totalYears':
                    nextStep = '/discovery/charts/future-performance';
                    break;
            }
            $location.path(nextStep);
        };

        this.navigateBack = function()
        {
            var currentStep = $rootScope.currentUIState.current.name.replace('discovery.profiling.','')
            var previousStep;
            switch(currentStep)
            {
                case 'lumpSum':
                    previousStep = '/';
                    break;
                case 'topUp':
                    previousStep = '/discovery/profiling/lump-sum';
                    break;
                case 'target':
                    previousStep = '/discovery/profiling/top-up';
                    break;
                case 'totalYears':
                    previousStep = '/discovery/profiling/target';
                    break;
                case 'assetAllocation':
                    previousStep = '/discovery/charts/total-years';
                    break;
            }

            $location.path(previousStep);
        };

        this.reRouteIfServiceNotReady = function(key)
        {
            if (key !== 'lumpSum' && ($rootScope.sliders === undefined || $rootScope.sliders.lumpSum === undefined) && this.enableReRouting === true)
            {
                $location.path('/discovery/profiling/lump-sum');
            }
        };

        /**
         * Set the reset value of the slider
         * @param key
         */
        this.resetSlider = function(key)
        {
            //console.log(key);

            $rootScope.sliders[key].data.reset = true;

            PubSub.publish('slider.reset', key);

            //console.log('reset', key);

        };

        /**
         * Check the slider value to see if the slider is in a reset state
         * @param key
         * @param minValue
         * @param value
         */
        this.setResetValue = function(key, minValue, value)
        {

            //console.log('setReset', key, minValue, value);
            if(key === 'totalYears' || key === 'portfolioIncomeTimeFrame' && $rootScope.sliders[key].data.reset === true && value === 10)
            return;

            if(value === minValue)
            {
                $rootScope.sliders[key].data.reset = true;
            }
            else
            {
                $rootScope.sliders[key].data.reset = false;
            }
        };

        this.navigateForwards = function()
        {

            var currentStep = $rootScope.currentUIState.current.name.replace('discovery.profiling.','');

            var nextStep;

            switch(currentStep)
            {
                case 'lumpSum':
                    nextStep = '/discovery/profiling/top-up';
                    break;
                case 'topUp':
                    nextStep = '/discovery/profiling/target';
                    break;
                case 'target':
                    nextStep = '/discovery/profiling/total-years';
                    break;
                case 'totalYears':
                    nextStep = '/discovery/charts/future-performance';
                    break;
            }

            $location.path(nextStep);
        }

    }]);