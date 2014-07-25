define(['knockout', 'text!./wikimetrics-data-browser.html'], function(ko, templateMarkup) {

    function WikimetricsDataBrowser(params) {
        // copies all the params to self
        $.extend(this, params);
    }

    return { viewModel: WikimetricsDataBrowser, template: templateMarkup };
});
