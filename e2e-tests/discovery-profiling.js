'use strict';

describe('tiller app', function () {

    describe('discovery profiling user journey', function () {

        beforeEach(function () {
            browser.get('/#/discovery/profiling/lump-sum');
        });

        it('should load the discovery lump-sum profiling state', function () {
            expect(browser.getLocationAbsUrl()).toMatch("/discovery/profiling/lump-sum");
        });

        it('should move from discovery profiling lump-sum future-performance using set steps', function () {

            element(by.css('.discovery-profiling-navigation .discovery-profiling-forward')).click();
            expect(browser.getLocationAbsUrl()).toMatch("/discovery/profiling/top-up");

            element(by.css('.discovery-profiling-navigation .discovery-profiling-forward')).click();
            expect(browser.getLocationAbsUrl()).toMatch("/discovery/profiling/target");

            element(by.css('.discovery-profiling-navigation .discovery-profiling-forward')).click();
            expect(browser.getLocationAbsUrl()).toMatch("/discovery/profiling/total-years");

            element(by.css('.discovery-profiling-navigation .discovery-profiling-forward')).click();
            expect(browser.getLocationAbsUrl()).toMatch("/discovery/charts/future-performance");

        });

    });

    describe('discovery profiling lump-sum slider values', function () {

        beforeEach(function () {
            browser.get('/#/discovery/profiling/lump-sum');
        });

        it('should increase and decrease when you click the plus button', function () {

            var sliderValue = element.all(by.css('input.slider-value'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).getAttribute('value');

            expect(sliderValue).toMatch("£10,000");

            element.all(by.css('.slider-value-controls button'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).first().click();

            var sliderValue = element.all(by.css('input.slider-value'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).getAttribute('value');

            expect(sliderValue).toMatch("£11,000");


            element.all(by.css('.slider-value-controls button'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).last().click();

            var sliderValue = element.all(by.css('input.slider-value'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).getAttribute('value');

            expect(sliderValue).toMatch("£10,000");

        });

    });

    describe('discovery profiling top-up slider values', function () {

        beforeEach(function () {
            browser.get('/#/discovery/profiling/top-up');
        });

        it('should increase and decrease when you click the plus, minus and reset buttons', function () {

            var sliderValue = element.all(by.css('input.slider-value'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).getAttribute('value');

            expect(sliderValue).toMatch("£500");

            element.all(by.css('.slider-value-controls button'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).first().click();

            var sliderValue = element.all(by.css('input.slider-value'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).getAttribute('value');

            expect(sliderValue).toMatch("£550");


            element.all(by.css('.slider-value-controls button'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).last().click();

            var sliderValue = element.all(by.css('input.slider-value'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).getAttribute('value');

            expect(sliderValue).toMatch("£500");

            element(by.css('.discovery-profiling-titles label.checkbox-label')).click();

            var sliderValue = element.all(by.css('input.slider-value'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).getAttribute('value');

            expect(sliderValue).toMatch("£0");

        });

        it('should navigate to the lump sum slider on clicking the back button"', function () {

            element.all(by.css('.slider-back-button'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).first().click();

            expect(browser.getLocationAbsUrl()).toMatch("/discovery/profiling/lump-sum");

        });

    });

    describe('discovery profiling target slider values', function () {

        beforeEach(function () {
            browser.get('/#/discovery/profiling/target');
        });

        it('should increase and decrease when you click the plus, minus and reset buttons', function () {

            var sliderValue = element.all(by.css('input.slider-value'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).getAttribute('value');

            expect(sliderValue).toMatch("£50,000");

            element.all(by.css('.slider-value-controls button'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).first().click();

            var sliderValue = element.all(by.css('input.slider-value'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).getAttribute('value');

            expect(sliderValue).toMatch("£55,000");


            element.all(by.css('.slider-value-controls button'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).last().click();

            var sliderValue = element.all(by.css('input.slider-value'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).getAttribute('value');

            expect(sliderValue).toMatch("£50,000");

            element(by.css('.discovery-profiling-titles label.checkbox-label')).click();

            var sliderValue = element.all(by.css('input.slider-value'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).getAttribute('value');

            expect(sliderValue).toMatch("£0");

        });

        it('should navigate to the top-up slider on clicking the back button"', function () {

            element.all(by.css('.slider-back-button'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).last().click();

            expect(browser.getLocationAbsUrl()).toMatch("/discovery/profiling/top-up");

        });

    });

    describe('discovery profiling total years slider values', function () {

        beforeEach(function () {
            browser.get('/#/discovery/profiling/total-years');
        });

        it('should increase and decrease when you click the plu, minus and reset buttons', function () {

            var sliderValue = element.all(by.css('input.slider-value'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).getAttribute('value');

            expect(sliderValue).toMatch("10");

            element.all(by.css('.slider-value-controls button'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).first().click();

            var sliderValue = element.all(by.css('input.slider-value'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).getAttribute('value');

            expect(sliderValue).toMatch("11");


            element.all(by.css('.slider-value-controls button'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).last().click();

            var sliderValue = element.all(by.css('input.slider-value'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).getAttribute('value');

            expect(sliderValue).toMatch("10");

            element(by.css('.discovery-profiling-titles label.checkbox-label')).click();

            var sliderValue = element.all(by.css('input.slider-value'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).getAttribute('value');

            expect(sliderValue).toMatch("1");

        });

        it('should navigate to the target slider on clicking the back button"', function () {

            element.all(by.css('.slider-back-button'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).last().click();

            expect(browser.getLocationAbsUrl()).toMatch("/discovery/profiling/target");

        });

    });

});
