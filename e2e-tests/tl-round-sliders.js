'use strict';

describe('tiller app', function () {

    describe('round sliders', function () {

        beforeEach(function () {
            browser.get('/#/discovery/profiling/lump-sum');
        });

        it('should update their value when the handle is dragged', function () {

            var handle = element.all(by.css('g.handle'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).first();

            browser.actions().dragAndDrop(handle, {x: -100, y: -100}).perform();

            var sliderValue = element.all(by.css('input.slider-value'))
                .filter(function (elem) {
                    return elem.isDisplayed();
                }).getAttribute('value');

            expect(sliderValue).toMatch("£19,000");

        });

    });

    describe('risk slider', function () {

        beforeEach(function () {
            browser.get('/#/discovery/charts/asset-allocation');
        });

        it('should update it\'s value and reload data when dragged', function () {

            var trackerButton = element(by.buttonText('Tracker'));

            trackerButton.click().then(function() {

                var handle = element(by.css('.discovery-charts-risk-slider g.handle'));

                browser.actions().dragAndDrop(handle, {x: -100, y: -100}).perform();

                var sliderValue = element(by.css('.discovery-charts-risk-slider input.slider-value'));

                expect(sliderValue).toMatch("4");

            });

        });

    });

});
