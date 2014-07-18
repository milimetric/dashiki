define(['knockout', 'text!./vega-graph.html', 'd3', 'zepto'], function(ko, templateMarkup, d3) {
    function VegaGraph(params) {
        var self = this;
        var i;
        var g = params.graph;

        self.addDataset = function(project, aggregate, submetric) {
            return function(rawData) {
                var normalized = [],
                    keys = Object.keys(rawData),
                    i;

                keys.splice(keys.indexOf('parameters'), 1);
                for (i=0; i<keys.length; i++) {
                    normalized.push({
                        date: new Date(keys[i]),
                        project: project,
                        submetric: rawData[keys[i]][aggregate][submetric]
                    });
                }
                self.datasets.push(normalized.sort(function(a, b){
                    return a.date.getTime() - b.date.getTime();
                }));
            };
        };
        self.datasets = ko.observableArray();
        self.name = g.metric + ' for ' + g.projects.join(', ');
        for (i=0; i<g.projects.length; i++){
            $.get(g.dataRoot + g.metric + '/' + g.projects[i] + '.json')
                .done(self.addDataset(g.projects[i], g.aggregate || 'Sum', g.submetric));
        }
        self.definition = ko.computed(function(){
            var datasets = this.datasets();
            return {
                "width": 500,
                "height": 200,
                "data": [
                    {
                        "name": "projects",
                        "format": {"parse": {"date":"date"}},
                        "values": d3.merge(datasets)
                    }
                ],
                "scales": [
                    {
                        "name": "x",
                        "type": "time",
                        "range": "width",
                        "domain": {"data": "projects", "field": "data.date"}
                    },
                    {
                        "name": "y",
                        "type": "linear",
                        "range": "height",
                        "nice": true,
                        "domain": {"data": "projects", "field": "data.submetric"}
                    },
                    {
                        "name": "color", "type": "ordinal", "range": "category10"
                    }
                ],
                "axes": [
                    {"type": "x", "scale": "x", "tickSizeEnd": 0},
                    {"type": "y", "scale": "y"}
                ],
                "marks": [
                    {
                        "type": "group",
                        "from": {
                            "data": "projects",
                            "transform": [{"type": "facet", "keys": ["data.project"]}]
                        },
                        "marks": [
                            {
                                "type": "line",
                                "properties": {
                                    "enter": {
                                        "x": {"scale": "x", "field": "data.date"},
                                        "y": {"scale": "y", "field": "data.submetric"},
                                        "stroke": {"scale": "color", "field": "data.project"},
                                        "strokeWidth": {"value": 1}
                                    }
                                }
                            }
                        ]
                    }
                ]
            };
        }, self);
    }


    VegaGraph.prototype.dispose = function() { };

    return { viewModel: VegaGraph, template: templateMarkup };
});
