'use strict';

angular.module('restService', [])
    /*
     * Holds the user data collected within the app
     */
    .service('restService', ['$http', '$sessionStorage', '$localStorage', 'envService', 'errorService', function ($http, $sessionStorage, $localStorage, envService, errorService) {

        /**
         * Full apidocs in swagger
         * @link https://tillerapi.azurewebsites.net/swagger/
         * @type {string}
         */

        this.url = envService.read('apiUrl');

        /**
         * Initialise a session for non registered users based on session token identifier. Returns a new session token if one not present.
         * @param response
         */
        this.initialiseSession = function(response) {

            var config = {
                method: 'POST',
                headers: {
                    Accept: 'application/json'
                }
            };

            if($localStorage.sessionToken === undefined)
            {
                config.url = this.url + 'discovery/initialisesession';
            }
            else
            {
                config.url = this.url + 'discovery/initialisesession?sessionId=' + $localStorage.sessionToken;
            }

            return $http(config)

                .then(

                function(response) {

                    if (response.status === 200 && response.data.sessionToken !== undefined) {

                        $localStorage.sessionToken = response.data.sessionToken;

                        //console.log('init without email', response.data);

                        return response.data;

                    }
                    else
                    {
                        response.source = config.url;
                        errorService.setError(response);

                        return false;
                    }

                }
            );

        };

        /**
         * Initialise a session by going and grabbing based on session token identifier. Returns a new session token if one not present.
         * @param response
         */
        this.initialiseSessionWithEmail = function(email) {

            var config = {
                method: 'POST',
                headers: {
                    Accept: 'application/json'
                }
            };

            //if($localStorage.sessionToken === undefined)
            //{
            //    config.url = this.url + 'discovery/initialisesession';
            //}
            //else
            //{
                config.url = this.url + 'discovery/initialisesession?emailAddress=' + email;
            //}

            return $http(config)

                .then(

                function(response) {

                    if (response.status === 200 && response.data.sessionToken !== undefined) {

                        $localStorage.sessionToken = response.data.sessionToken;

                        //console.log('init by email', response.data);

                        return response.data;

                    }
                    else
                    {

                        response.source = config.url;
                        errorService.setError(response);

                        return false;
                    }

                }
            );

        };

        /**
         * Update the user profile for non registered users (in discovery)
         * @param profile
         * @returns {*}
         */
        this.updateProfile = function(profile) {

            if(profile.investorLevel === 0 || profile.investorLevel === undefined)
            {
                profile.investorLevel = 1;
            }
            
            var config = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    sessionAuthToken: $localStorage.sessionToken
                },
                data: profile,
                url: this.url + 'discovery/updateprofile'
            };

            return $http(config)

                .then(
                    function(response) {

                        // success

                        if (response.status === 200) {

                            return true;

                        } else {

                            response.source = config.url;
                            errorService.setError(response);

                        }

                    },

                    function(response) {

                        response.source = config.url;
                        errorService.setError(response);

                    }
                );


        };

        /**
         * Update the non-registered user profile with an email
         * @param email
         * @returns {*}
         */
        this.updateProfileWithEmail = function(email) {

            var config = {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    sessionAuthToken: $localStorage.sessionToken
                },
                data: '"' + email + '"',
                url: this.url + 'discovery/updateprofilewithemail/' + $localStorage.sessionToken
            };

            return $http(config)

                .then(
                    function(response) {

                        if (response.status === 200)
                        {

                            return true;

                        }
                        else
                        {
                            response.source = config.url;
                            errorService.setError(response);
                        }

                    },

                    function(response) {

                        response.source = config.url;
                        errorService.setError(response);

                    }
                );


        };

        /**
         * Get allocations form api
         * @param params - configuration for API call
         * @param state - the ui-view state of the application
         * @returns {*}
         */
        this.getAllocations = function(params, state) {

            if(state !== undefined) {

                var config = {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        sessionAuthToken: $localStorage.sessionToken
                    },
                    url: this.url + 'discovery/getallocations'
                };

                if(state.indexOf('onboarding') !== -1)
                {
                    config.url = this.url + 'portfolio/allocations';
                    config.method = 'GET';
                    config.params = {
                        "portfolioId": 0
                    }
                }

                return $http(config)

                    .then(
                    function(response) {

                        if (response.status === 200) {

                            return response;

                        }
                        else
                        {
                            response.source = config.url;
                            errorService.setError(response);
                        }

                    },

                    function(response) {

                        response.source = config.url;
                        errorService.setError(response);

                    }
                );
            }

            return false;

        };

        /**
         * Get security historical performance form api
         * @param params
         * @returns {*}
         */
        this.getSecurityHistoricPerformance = function(id) {

            if(id !== undefined) {

                var config = {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        sessionAuthToken: $localStorage.sessionToken
                    },
                    url: this.url + 'securities/getsecurityhistoricperformancefordiscovery/' + id
                };

                return $http(config)

                    .then(
                    function(response) {

                        if (response.status === 200) {

                            return response.data;

                        }
                        else
                        {
                            response.source = config.url;
                            errorService.setError(response);
                        }

                    },

                    function(response) {

                        response.source = config.url;
                        errorService.setError(response);

                    }
                );
            }

            return false;

        };

        /**
         * Get future performance data
         */
        this.getFuturePerformance = function(state) {

            var config = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    sessionAuthToken: $localStorage.sessionToken
                },
                url: this.url + 'discovery/futureperformance'
            };

            if(state === 1) //We are investing for capital growth
            {
                config.url = this.url + 'portfolio/futurecapitalperformance';
                config.params = {
                    "portfolioId": 0
                }
            }
            else if(state === 2) // We are investing for income
            {
                config.url = this.url + 'portfolio/futureincomeperformance';
                config.params = {
                    "portfolioId": 0
                }
            }

            return $http(config)

                .then(
                function(response) {

                    if (response.status === 200) {

                        return response.data;

                    }
                    else
                    {
                        response.source = config.url;
                        errorService.setError(response);
                    }

                },

                function(response) {

                    response.source = config.url;
                    errorService.setError(response);

                }
            );
        };

        /**
         * Get past performance data
         * @param years
         * @param state
         * @returns {*}
         */
        this.getPastPerformance = function(years, state) {

            if(years === undefined)
            {
                years = 5;
            }

            var config = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    sessionAuthToken: $localStorage.sessionToken
                },
                url: this.url + 'discovery/historicperformance?years=' + years
            };

            if(state.indexOf('onboarding') !== -1)
            {
                config.url = this.url + 'portfolio/historicportfolioperformance?years=' + years;
            }

            return $http(config)

                .then(
                function(response) {

                    if (response.status === 200) {

                        return response.data;

                    }
                    else
                    {
                        response.source = config.url;
                        errorService.setError(response);
                    }

                },

                function(response) {

                    response.source = config.url;
                    errorService.setError(response);

                }
            );
        };

        /**
         * Get portfolio themes from api
         * @param state
         * @returns {*}
         */
        this.getPortfolioThemes = function(state) {

            var config = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    sessionAuthToken: $localStorage.sessionToken
                },
                url: this.url + 'discovery/portfoliothemes'
            };

            if(state.indexOf('onboarding') !== -1)
            {
                config.url = this.url + 'portfolio/themes';
                config.params = {
                    "portfolioId": 0
                }
            }

            return $http(config)

                .then(
                function(response) {

                    if (response.status === 200) {

                        return response.data;

                    }
                    else
                    {
                        response.source = config.url;
                        errorService.setError(response);
                    }

                },

                function(response) {

                    response.source = config.url;
                    errorService.setError(response);

                }
            );

        };

        /**
         * Update portfolio theme status in api
         * @returns {*}
         */
        this.updatePortfolioThemes = function(themeModels, state) {

            var config = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    sessionAuthToken: $localStorage.sessionToken
                },
                url: this.url + 'discovery/updateportfoliothemes',
                data: themeModels
            };

            if(state.indexOf('onboarding') !== -1)
            {
                config.url = this.url + 'portfolio/updatethemes';
                config.params = {
                    "portfolioId": 0
                }
            }

            return $http(config)

                .then(
                function(response) {

                    if (response.status === 200) {

                        return response.data;

                    }
                    else
                    {
                        response.source = config.url;
                        errorService.setError(response);
                    }

                },

                function(response) {

                    response.source = config.url;
                    errorService.setError(response);

                }
            );

        };

        /**
         * Update portfolio theme status in api
         * @returns {*}
         */
        this.updatePortfolioTheme = function(themeId, isSelected, state) {

            var config = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    sessionAuthToken: $localStorage.sessionToken
                },
                url: this.url + 'discovery/updateselectedportfoliotheme/' + themeId.toString() + '/' + isSelected.toString()
            };

            if(state.indexOf('onboarding') !== -1)
            {
                config.url = this.url + 'portfolio/updateselectedtheme/0/' + themeId.toString() + '/' + isSelected.toString();
            }

            return $http(config)

                .then(
                function(response) {

                    if (response.status === 200) {

                        return response.data;

                    }
                    else
                    {
                        response.source = config.url;
                        errorService.setError(response);
                    }

                },

                function(response) {

                    response.source = config.url;
                    errorService.setError(response);

                }
            );

        };

    }])
;