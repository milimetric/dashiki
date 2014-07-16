define(['knockout', 'components/vega-graph/vega-graph', 'zepto'], function(ko, vg) {
    var VegaGraph = vg.viewModel;

    describe('VegaGraph view model', function() {

        var metric1 = {
            "name": "metric1",
            "values": [
                {"x": 1,  "y": 28}, {"x": 2,  "y": 55},
                {"x": 3,  "y": 43}, {"x": 4,  "y": 91},
                {"x": 5,  "y": 81}, {"x": 6,  "y": 53},
                {"x": 7,  "y": 19}, {"x": 8,  "y": 87},
                {"x": 9,  "y": 52}, {"x": 10, "y": 48}
            ]
        };
        it('should create an observable around data passed in', function() {
            var data = [metric1];
            var graph = new VegaGraph({data: data});

            expect(graph.data()).toEqual(data);
        });

        it('should create a vega definition from static data', function() {
            var data = [metric1];
            var graph = new VegaGraph({data: data});

            expect(graph.definition().data).toEqual(data);
            expect(graph.definition().scales[0].name).toEqual('x');
            expect(graph.definition().scales[1].name).toEqual('y');
        });
    });

    describe('template HTML', function() {

        var parsed = $('<div/>').html(vg.template);

        it('should have a place for the graph to go', function() {
            expect(parsed.find('.graph-root').length).toEqual(1);
        });
    });
});
