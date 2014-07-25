define(['knockout', 'moment', 'text!./vega.html', 'zepto'], function(ko, moment, templateMarkup) {

    function Vega(params) {
        // copies all the params to self
        $.extend(this, params);

        var self = this;
        var dataCache = {};
        function key(datum){
            return datum.metricName + datum.project;
        }

        self.selectedProjects.subscribe(function(newProjects){
            if (!newProjects || !newProjects.length) {
                this.datasets([]);
                return;
            }
            var self = this;
            var currentProjects = self.datasets();
            var currentDict = {};
            var newDict = {};
            var keep = 0;
            var maxLoop = 10000;
            var i;

            for (i=0; i<currentProjects.length; i++){
                currentDict[key(currentProjects[i][0])] = currentProjects[i];
            }
            for (i=0; i<newProjects.length; i++){
                newDict[key(newProjects[i])] = newProjects[i];
            }

            while (keep<currentProjects.length && maxLoop > 0){
                var c = key(currentProjects[keep][0]);
                if (!(newDict.hasOwnProperty(c))){
                    self.datasets.remove(currentDict[c]);
                } else {
                    keep++;
                }
                // NOTE: this kind of thing is what's tricky about knockout.
                // The logic here will be cleaned up once we stop passing random hardcoded structures around
                // and move to object-oriented cleanliness.  But knockout does keep you honest because I believe
                // this could turn into an infinite loop if some of the dependencies fire in a weird order.
                maxLoop--;
            }

            // Definitely replace this with proper cache headers on the data
            function addAndCache(key, add) {
                return function(rawData) {
                    add.call(self, rawData);
                    dataCache[key] = rawData;
                };
            }

            for (i=0; i<newProjects.length; i++){
                var p = newProjects[i];
                if (!(currentDict.hasOwnProperty(key(p)))){
                    var add = self.addDataset(p.project, p.aggregate || 'Sum', p.submetric);
                    if (!(dataCache.hasOwnProperty(p.dataURL))){
                        $.get(p.dataURL).done(addAndCache(p.dataURL, add));
                    } else {
                        add.call(self, dataCache[p.dataURL]);
                    }
                }
            }
        }, self);

        self.datasets = ko.observableArray().extend({ rateLimit: 20, method: 'notifyWhenChangesStop' });
        self.addDataset = function(project, aggregate, submetric) {
            return function(rawData) {
                var normalized = [],
                    keys = Object.keys(rawData),
                    metricName = self.selectedMetric().name,
                    i;

                keys.splice(keys.indexOf('parameters'), 1);
                if (keys.indexOf('result') >= 0){
                    keys = Object.keys(rawData.result[aggregate][submetric]);
                    for (i=0; i<keys.length; i++) {
                        normalized.push({
                            date: moment(keys[i]).toDate(),
                            project: project,
                            metricName: metricName,
                            submetric: rawData.result[aggregate][submetric][keys[i]]
                        });
                    }
                } else {
                    for (i=0; i<keys.length; i++) {
                        normalized.push({
                            date: moment(keys[i]).toDate(),
                            project: project,
                            metricName: metricName,
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
