define(['knockout', 'vega'], function(ko, vega) {
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
            var unwrapped;
            unwrapped = ko.utils.unwrapObservable(valueAccessor());
            if (unwrapped !== null) {
                vega.parse.spec(unwrapped, function(graph){
                    var view = graph({el:element}).update();
                    //if (typeof(element.view) === 'undefined'){
                        //var view = graph({el:element}).update();
                        //element.view = view;
                    //} else {
                        //var dataDict = {}, i, d = unwrapped.data;
                        //for (i=0; i<d.length; i++){
                            //dataDict[d[i].name] = d[i].values;
                        //}
                        //element.view.data(dataDict).update({duration:500});
                        //console.log(dataDict);
                    //}
                });
            }
        }
    };
});
