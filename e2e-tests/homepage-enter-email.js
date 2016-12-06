'use strict';

describe('tiller app', function() {

  describe('homepage', function() {

    beforeEach(function() {
      browser.get('/');
    });

    it('should load the homepage', function() {
      expect(browser.getLocationAbsUrl()).toMatch("");
    });

    it('should display an error message when entering an invalid email address', function() {
      element(by.css('input[type=email]')).clear().sendKeys('test@test');
      element(by.buttonText('Next')).click();
      var errorMsg = element(by.css('.validation-error-message'));
      expect(errorMsg.getText()).toContain('Invalid email address supplied');
    });

    it('should navigate to the /discovery route when entering a valid email address', function() {
      element(by.css('input[type=email]')).clear().sendKeys('test@test.com');
      element(by.buttonText('Next')).click();
      expect(browser.getLocationAbsUrl()).toMatch("/discovery");
    });

  });

});
