define(['knockout', 'text!./vega-graph.html'], function(ko, templateMarkup) {

    var unwrap = ko.utils.unwrapObservable;

    function VegaGraph(params) {
        var self = this;
        self.dataInput = ko.observable(unwrap(params.data));
        self.data = ko.computed({
            read: function(){
                return JSON.stringify(unwrap(this.dataInput()), null, 4);
            },
            write: function(value) {
                this.dataInput(JSON.parse(value));
            },
            owner: self
        });

        self.definition = ko.computed(function(){
            var data = JSON.parse(this.data());
            return {
                "width": 400,
                "height": 200,
                "padding": {"top": 10, "left": 40, "bottom": 30, "right": 10},
                "data": data,
                "scales": [
                    {
                        "name": "x",
                        "type": "ordinal",
                        "range": "width",
                        "domain": {"data": data[0].name, "field": "data.x"}
                    },
                    {
                        "name": "y",
                        "range": "height",
                        "nice": true,
                        "domain": {"data": data[0].name, "field": "data.y"}
                    }
                ],
                "axes": [
                    {"type": "x", "scale": "x"},
                    {"type": "y", "scale": "y"}
                ],
                "marks": [
                    {
                        "type": "rect",
                        "from": {"data": data[0].name},
                        "properties": {
                            "enter": {
                                "x": {"scale": "x", "field": "data.x"},
                                "width": {"scale": "x", "band": true, "offset": -1},
                                "y": {"scale": "y", "field": "data.y"},
                                "y2": {"scale": "y", "value": 0}
                            },
                            "update": {
                                "fill": {"value": "steelblue"}
                            },
                            "hover": {
                                "fill": {"value": "red"}
                            }
                        }
                    }
                ]
            };
        }, self);
    }

    VegaGraph.prototype.dispose = function() { };

    return { viewModel: VegaGraph, template: templateMarkup };
});
