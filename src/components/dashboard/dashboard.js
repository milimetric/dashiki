define(['knockout', 'text!./dashboard.html', 'zepto'], function(ko, templateMarkup) {

    function Dashboard(params) {
        var self = this;

        self.url = params.url;
        self.name = ko.observable();
        self.description = ko.observable();
        self.graphs = ko.observableArray([]);

        var find = function(value){
            return function(e, i){
                return value === e;
            };
        };

        self.refresh = function(){
            var i;

            var url = self.url();
            if (!url) {
                console.error('must type in a URL or leave the default alone');
                return;
            }
            url = url + '&origin=' + location.origin;

            $.get(url).done(function(mw){
                // FOR DEBUG WITHOUT MEDIAWIKI: self.model = staticModel;
                self.model = JSON.parse(
                    mw.query.pages[Object.keys(mw.query.pages)[0]].revisions[0]['*']
                );

                // TODO: automatically map the model
                self.name(self.model.name);
                self.description(self.model.description);
                for (i=0; i<self.model.graphs.length; i++){
                    var value = self.model.graphs[i];
                    value.dataRoot = self.model.dataRoot;
                    self.graphs.push(value);
                }
            });
        };
        self.url.subscribe(self.refresh);
        self.refresh();
    }

    return { viewModel: Dashboard, template: templateMarkup };
});

var staticModel = {
    name: 'Editor Engagement Vital Signs',
    description: 'This is just a test for a potential dashboarding solution',
    layout: 'metrics-by-project',
    dataRoot: 'https://metrics-staging.wmflabs.org/static/public/datafiles/',
    graphs: [
        { metric: 'NewlyRegistered', submetric: 'newly_registered', projects: ['enwiki', 'dewiki', 'frwiki', 'jawiki', 'eswiki', 'ruwiki'] },
        { metric: 'NewlyRegistered', submetric: 'newly_registered', projects: ['rowiki'] }
    ]
};
