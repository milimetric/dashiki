define(['knockout', 'vega', 'd3'], function(ko, vega, d3) {
/**
 * Custom binding that is used to render a vega graph from an observable definition
 * `<div data-bind="vega: definition"></div>`
 * And works as follows:
 *     In the example above, definition is a ko.observable or plain property
 *     that evaluates to a Vega JS graph definition
 */
    ko.bindingHandlers.vega = {
        init: function(element){
            $(window).resize(function(){
                if (element.view){
                    var defs = element.view.defs();
                    var h = defs.height,
                        w = defs.width,
                        hPad = defs.padding.top + defs.padding.bottom,
                        wPad = defs.padding.left + defs.padding.right;

                    var parent = $(element).parents('.vega-container');
                    h = parent.innerHeight() - hPad;
                    w = parent.innerWidth() - wPad;
                    element.view.height(h).width(w).update({duration: 300});
                }
            });
            return {
                controlsDescendantBindings: false
            };
        },
        update: function(element, valueAccessor){
            var datasets;
            datasets = ko.utils.unwrapObservable(valueAccessor());
            if (datasets !== null) {
                // NOTE: if datasets is emptied, it's faster for some reason to just create a new graph
                if(element.view && datasets.length) {
                    var parsed = vega.parse.data(vegaData(datasets)).load;
                    element.view.data(parsed).update({ duration: 300 });
                } else {
                    vega.parse.spec(vegaDefinition(datasets), function(graph){
                        element.view = graph({el:element}).update();
                        $(window).trigger('resize');
                    });
                }
            }
        }
    };

    function vegaData(datasets){
        return [
            {
                "name": "projects",
                // NOTE: This causes the whole spec to not work with runtime data updates: "format": {"parse": {"date":"date"}},
                "values": d3.merge(datasets)
            }
        ];
    }
    function vegaDefinition(datasets){
        return {
            "width": 700,
            "height": 300,
            "padding": { top: 20, right: 100, bottom: 50, left: 100 },
            "data": vegaData(datasets),
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
                {"type": "x", "scale": "x", "tickSizeEnd": 0, "grid": true, "properties": {
                    "ticks": { "stroke": { "value": "#666666" } },
                    "labels": { "fill": { "value": "#666666" } },
                    "grid": { "stroke": { "value": "#cacaca" } },
                    "axis": { "stroke": { "value": "#666666" }, "strokeWidth": { "value": 2 } }
                }},
                {"type": "y", "scale": "y", "grid": true, "properties": {
                    "ticks": { "stroke": { "value": "#666666" } },
                    "labels": { "fill": { "value": "#666666" } },
                    "grid": { "stroke": { "value": "#cacaca" } },
                    "axis": { "stroke": { "value": "#666666" }, "strokeWidth": { "value": 2 } }
                }}
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
                                    "strokeWidth": {"value": 2}
                                },
                                "update": {
                                    "x": {"scale": "x", "field": "data.date"},
                                    "y": {"scale": "y", "field": "data.submetric"},
                                    "stroke": {"scale": "color", "field": "data.project"}
                                }
                            }
                        },
                        {
                            "type": "text",
                            "from": {
                                "transform": [{"type": "filter", "test": "index==data.length-1"}]
                            },
                            "properties": {
                                "enter": {
                                    "baseline": {"value": "middle"}
                                },
                                "update": {
                                    "x": {"scale": "x", "field": "data.date", "offset": 2},
                                    "y": {"scale": "y", "field": "data.submetric"},
                                    "fill": {"scale": "color", "field": "data.project"},
                                    "text": {"field": "data.project"}
                                }
                            }
                        }
                    ]
                }
            ]
        };
    }
});
