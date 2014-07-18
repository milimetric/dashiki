define(['jquery', 'knockout', './router', 'bootstrap', 'knockout-projections', './bindings'], function($, ko, router) {

  // Components can be packaged as AMD modules, such as the following:
  ko.components.register('nav-bar', { require: 'components/nav-bar/nav-bar' });
  ko.components.register('home', { require: 'components/home/home' });

  // ... or for template-only components, you can just point to a .html file directly:
  ko.components.register('about', {
    template: { require: 'text!components/about/about.html' }
  });

  ko.components.register('error', { require: 'components/error/error' });

  ko.components.register('vega-graph', { require: 'components/vega-graph/vega-graph' });

  ko.components.register('dashboard', { require: 'components/dashboard/dashboard' });

  // [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]

  // Start the application
  ko.applyBindings({ route: router.currentRoute });
});
