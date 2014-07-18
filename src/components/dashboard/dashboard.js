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

            // TODO: fetch this via CORS
            // Currently not working:
            // http://meta.wikimedia.org/w/api.php?
            //      action=query&
            //      prop=revisions&
            //      rvprop=content&
            //      format=json&
            //      titles=Dashboard:test
            // var url = self.url();
            // if (!url) { return; }

            // TODO: automatically map the model
            self.model = tmp;
            self.name(self.model.name);
            self.description(self.model.description);
            for (i=0; i<self.model.graphs.length; i++){
                var value = self.model.graphs[i];
                value.dataRoot = self.model.dataRoot;
                var graph = self.graphs().find(find(value));
                if (!graph) {
                    self.graphs.push(value);
                }
            }
        };
        self.url.subscribe(self.refresh);
        self.refresh();
    }

    return { viewModel: Dashboard, template: templateMarkup };
});

var tmp = {
    name: 'Editor Engagement Vital Signs',
    description: 'This is just a test for a potential dashboarding solution',
    layout: 'metrics-by-project',
    dataRoot: 'https://metrics-staging.wmflabs.org/static/public/datafiles/',
    graphs: [
        { metric: 'NewlyRegistered', submetric: 'newly_registered', projects: ['enwiki', 'dewiki', 'frwiki', 'jawiki', 'eswiki', 'ruwiki'] },
        { metric: 'NewlyRegistered', submetric: 'newly_registered', projects: ['rowiki'] }
    ]
};
