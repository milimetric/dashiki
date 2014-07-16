define(["knockout", "text!./home.html"], function(ko, homeTemplate) {

    function HomeViewModel(route) {
        var self = this;
        self.action = (route && route.action) || 'view';
        console.log(route);
    }

    return { viewModel: HomeViewModel, template: homeTemplate };

});
