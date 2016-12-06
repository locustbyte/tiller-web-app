//jshint strict: false

//to run Protractor tests - first update the Selenium webdriver: 'npm run update-webdriver'
//use 'npm run protractor' to run tests

exports.config = {

  allScriptsTimeout: 11000,

  chromeOnly: false,
  directConnect: true,

  specs: [
    '*.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:8000/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  },

  onPrepare: function() {
    browser.driver.manage().window().maximize();
  }

};