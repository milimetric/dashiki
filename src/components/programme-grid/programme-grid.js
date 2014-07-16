define(['knockout', 'text!./programme-grid.html'], function(ko, templateMarkup) {
    Array.prototype.shuffle = function(){
      var array = this;
      var n = array.length, t, i;
      while (n) {
        i = Math.random() * n-- | 0; // 0 ≤ i < n
        t = array[n];
        array[n] = array[i];
        array[i] = t;
      }
      return array;
    };
  function r(n){
      return Math.round(Math.random()*(n-1))+1;
  }
  function d(i){
      var o = { title: 'p '+i, width: i*3, startTime: '0', endTime: i };
      return o;
  }

  function ProgrammeGrid(params) {
    var self = this;
    var i = 0;
    var logosUrl = 'http://also.kottke.org/misc/images/tv-channel-logos.jpg';

    self.channels = ko.observableArray([]);
    self.shouldFilter = ko.unwrap(params && params.onlyMine);
    self.myChannels = self.channels.filter(function(c){
        return self.shouldFilter ? c.isSubscribed : true;
    });

    for (i=0; i<10; i++) {
        var c = {
            isSubscribed: r(2) === 1,
            background: 'url('+logosUrl+') '+r(10)*38+'px '+r(10)*61+'px',
            height: '32px',
            width: '50px',
            programmes: [30, 30, 60, 90].map(d).shuffle()
        };
        self.channels.push(c);
    }
  }

  return { viewModel: ProgrammeGrid, template: templateMarkup };

});
