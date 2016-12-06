'use strict';

describe('tiller app', function () {

    describe('discovery charts investor level', function () {

        beforeEach(function () {
            browser.get('/#/discovery/charts/future-performance');
        });

        it('should show the info overlay for investor level 1', function () {

            var buttonClass = element.all(by.css('.discovery-charts-investment-type .nav-group-1 button')).first().getAttribute('class');

            expect(buttonClass).toContain('btn-active');

            var infoButtonClass = element.all(by.css('.discovery-charts-investment-type .nav-group-1 button')).last().getAttribute('class');

            expect(infoButtonClass).toContain('btn-active');

            var overlayClass = element(by.css('.discovery-chart-overlays')).getAttribute('class');

            expect(overlayClass).toContain('opacity-1');

            var modalClass = element.all(by.css('.chart-modal')).first().getAttribute('class');

            expect(modalClass).toContain('opacity-1');

        });

    });

    describe('discovery charts navigation', function () {

        beforeEach(function () {
            browser.get('/#/discovery/charts/future-performance');
        });

        it('should load the discovery future-performance charts state', function () {
            expect(browser.getLocationAbsUrl()).toMatch("discovery/charts/future-performance");
        });

        it('should have the following navigation routes', function () {

            element(by.css('.discovery-charts-navigation .discovery-charts-type-asset-btn')).click();
            expect(browser.getLocationAbsUrl()).toMatch("/discovery/charts/asset-allocation");

            element(by.css('.discovery-charts-navigation .discovery-charts-asset-region-btn')).click();
            expect(browser.getLocationAbsUrl()).toMatch("/discovery/charts/asset-allocation/region");

            element(by.css('.discovery-charts-navigation .discovery-charts-asset-list-btn')).click();
            expect(browser.getLocationAbsUrl()).toMatch("/discovery/charts/asset-allocation/list");

            browser.waitForAngular();

            element.all(by.css('.discovery-chart-zoom-btns .zoom-btn a'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).first().click();

            expect(browser.getLocationAbsUrl()).toMatch("/discovery/charts/asset-allocation/list/expanded");

            element.all(by.css('.discovery-chart-close-btns .close-btn a'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).first().click();

            expect(browser.getLocationAbsUrl()).toMatch("/discovery/charts/asset-allocation/list");

            element(by.css('.discovery-charts-navigation .discovery-charts-type-performance-btn')).click();
            expect(browser.getLocationAbsUrl()).toMatch("/discovery/charts/future-performance");

            element.all(by.css('.discovery-chart-zoom-btns .zoom-btn a'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).first().click();

            expect(browser.getLocationAbsUrl()).toMatch("/discovery/charts/future-performance/expanded");

            element.all(by.css('.discovery-chart-close-btns .close-btn a'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).first().click();

            expect(browser.getLocationAbsUrl()).toMatch("/discovery/charts/future-performance");

            element(by.css('.discovery-charts-navigation .discovery-charts-past-performance-btn')).click();
            expect(browser.getLocationAbsUrl()).toMatch("/discovery/charts/past-performance");

            element.all(by.css('.discovery-chart-zoom-btns .zoom-btn a'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).first().click();

            expect(browser.getLocationAbsUrl()).toMatch("/discovery/charts/past-performance/expanded");

            element.all(by.css('.discovery-chart-close-btns .close-btn a'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).first().click();

            expect(browser.getLocationAbsUrl()).toMatch("/discovery/charts/past-performance");

            element(by.css('.discovery-charts-navigation .discovery-charts-future-performance-btn')).click();
            expect(browser.getLocationAbsUrl()).toMatch("/discovery/charts/future-performance");

        });

    });

    describe('user investment level', function(){

        it('active+ should enable themes to be toggled', function () {

            var activePlusButton = element(by.buttonText('Active+'));

            activePlusButton.click().then(function(){

                var activePlusButtonClass = activePlusButton.getAttribute('class');

                expect(activePlusButtonClass).toContain('btn-active');

                var themeCarousel = element(by.css('.discovery-charts-investment-theme-carousel'));

                expect(themeCarousel.getAttribute('class')).toContain('opacity-1');

                var themeItem = element(by.css('.discovery-charts-investment-theme-carousel .item'));

                expect(themeItem).toBeDefined();

                /*unCheckedTheme.click().then(function(){
                    expect(unCheckedTheme.getAttribute('class')).toContain('checked');
                });*/

            });

        });

    });

    describe('chart call to actions', function(){

        it('should navigate to the onboarding process', function () {

            element(by.css('.discovery-charts-call-to-action .btn-primary')).click();

            expect(browser.getLocationAbsUrl()).toMatch("onboarding/get-started");

        });

    });

});
