define(['knockout', 'vega', 'd3'], function(ko, vega, d3) {
/**
 * Custom binding that is used to render a vega graph from an observable definition
 * `<div data-bind="vega: definition"></div>`
 * And works as follows:
 *     In the example above, definition is a ko.observable or plain property
 *     that evaluates to a Vega JS graph definition
 */
    ko.bindingHandlers.vega = {
        init: function(){
            return {
                controlsDescendantBindings: false
            };
        },
        update: function(element, valueAccessor){
            var datasets;
            datasets = ko.utils.unwrapObservable(valueAccessor());
            if (datasets !== null) {
                if(element.view && false /* updating data at runtime just won't work */){
                    var parsed = vega.parse.data(vegaData(datasets)).load;
                    element.view.data(parsed).update();
                } else {
                    vega.parse.spec(vegaDefinition(datasets), function(graph){
                        element.view = graph({el:element}).update();
                    });
                }
            }
        }
    };

    function vegaData(datasets){
        return [
            {
                "name": "projects",
                "format": {"parse": {"date":"date"}},
                "values": d3.merge(datasets)
            }
        ];
    }
    function vegaDefinition(datasets){
        return {
            "width": 900,
            "height": 400,
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
                                    "strokeWidth": {"value": 2}
                                }
                            }
                        }
                    ]
                }
            ]
        };
    }
});
