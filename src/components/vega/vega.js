define(['knockout', 'moment', 'text!./vega.html', 'zepto'], function(ko, moment, templateMarkup) {

    function Vega(params) {
        // copies all the params to self
        $.extend(this, params);

        var self = this;
        var dataCache = {};

        self.selectedProjects.subscribe(function(newProjects){
            var self = this;
            var currentProjects = self.datasets();
            var currentDict = {};
            var newDict = {};
            var i;

            for (i=0; i<currentProjects.length; i++){
                currentDict[currentProjects[i][0].project] = currentProjects[i];
            }
            for (i=0; i<newProjects.length; i++){
                newDict[newProjects[i].name] = newProjects[i];
            }

            for (i=0; i<currentProjects.length; i++){
                var c = currentProjects[i][0].project;
                if (!(newDict.hasOwnProperty(c))){
                    self.datasets.remove(currentDict[c]);
                }
            }

            // Definitely replace this with proper cache headers on the data
            function addAndCache(add) {
                return function(rawData) {
                    add.call(self, rawData);
                    dataCache[p.dataURL] = rawData;
                };
            }

            for (i=0; i<newProjects.length; i++){
                var p = newProjects[i];
                if (!(currentDict.hasOwnProperty(p.name))){
                    var add = self.addDataset(p.name, p.aggregate || 'Sum', p.submetric);
                    if (!(dataCache.hasOwnProperty(p.dataURL))){
                        $.get(p.dataURL).done(addAndCache(add));
                    } else {
                        add.call(self, dataCache[p.dataURL]);
                    }
                }
            }
        }, self);

        self.datasets = ko.observableArray();
        self.addDataset = function(project, aggregate, submetric) {
            return function(rawData) {
                var normalized = [],
                    keys = Object.keys(rawData),
                    i;

                keys.splice(keys.indexOf('parameters'), 1);
                if (keys.indexOf('result') >= 0){
                    keys = Object.keys(rawData.result[aggregate][submetric]);
                    for (i=0; i<keys.length; i++) {
                        normalized.push({
                            date: moment(keys[i]).toDate(),
                            project: project,
                            submetric: rawData.result[aggregate][submetric][keys[i]]
                        });
                    }
                } else {
                    for (i=0; i<keys.length; i++) {
                        normalized.push({
                            date: moment(keys[i]).toDate(),
                            project: project,
                            submetric: rawData[keys[i]][aggregate][submetric]
                        });
                    }
                }
                self.datasets.push(normalized.sort(function(a, b){
                    return a.date.getTime() - b.date.getTime();
                }));
            };
        };

    }

    return { viewModel: Vega, template: templateMarkup };

});
