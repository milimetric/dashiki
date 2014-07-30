define(['knockout', 'text!./wikimetrics-data-browser.html'], function(ko, templateMarkup) {

    function WikimetricsDataBrowser(params) {
        // copies all the params to self
        $.extend(this, params);
        var self = this;

        self.filterProjects = ko.observable('').extend({
            rateLimit: 100, method: 'notifyWhenChangesStop'
        });
        self.filteredProjects = ko.computed(function(){
            return self.metricProjects().filter(function(d){
                return self.filterProjects() === '' ||
                       d.project.indexOf(self.filterProjects()) >= 0;
            });
        });
    }

    return { viewModel: WikimetricsDataBrowser, template: templateMarkup };
});
