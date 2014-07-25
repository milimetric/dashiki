define(['jquery', 'knockout', 'knockout-projections', './bindings'], function($, ko) {

    ko.components.register('wikimetrics-data-browser', { require: 'components/wikimetrics-data-browser/wikimetrics-data-browser' });

    ko.components.register('wikimetrics-dashboard', { require: 'components/wikimetrics-dashboard/wikimetrics-dashboard' });

    ko.components.register('vega', { require: 'components/vega/vega' });

    // [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]

    // Start the application
    ko.applyBindings();
});
