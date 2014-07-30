define(['knockout', 'text!./wikimetrics-dashboard.html', 'zepto'], function(ko, templateMarkup) {

    function WikimetricsDashboard(params) {
        var self = this;

        self.projectsByMetric = ko.observableArray([]);
        self.selectedMetric = ko.observable();

        self.metricProjects = ko.computed(function(){
            var metric = this.selectedMetric();
            if (metric && metric.projects && metric.projects().length){
                return metric.projects();
            }
            return [];
        }, self);

        self.selectedProjects = ko.computed(function(){
            return this.metricProjects().filter(function(item){
                return item.selected();
            });
        }, self);

        function last(relativeUrl){
            var simpleParse = /([a-zA-Z_]+).*/;
            return simpleParse.exec(relativeUrl)[1];
        }
        function href(){
            return $(this).attr('href');
        }

        $.get(params.baseURL).done(function(metricsDir){
            $(metricsDir).find('a').slice(5).map(href).each(function(){
                var metricLink = this;
                var metric = {
                    name: last(metricLink),
                    projects: ko.observableArray([]),
                    selected: ko.observable(false)
                };
                $.get(params.baseURL + metricLink).done(function(projectsDir){
                    $(projectsDir).find('a').slice(5).map(href).each(function(){
                        var projectLink = this;
                        var submetrics = {
                            NewlyRegistered: 'newly_registered',
                            RollingActiveEditor: 'rolling_active_editor'
                        };
                        metric.projects.push({
                            project: last(projectLink),
                            metricName: last(metricLink),
                            dataURL: params.baseURL + metricLink + projectLink,
                            submetric: submetrics[last(metricLink)],
                            dataType: 'wikimetrics',
                            selected: ko.observable(false)
                        });
                    });
                    self.projectsByMetric.push(metric);
                });
            });
        });
    }

  return { viewModel: WikimetricsDashboard, template: templateMarkup };
});
