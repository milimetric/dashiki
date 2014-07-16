define(['knockout', 'text!./error.html'], function(ko, templateMarkup) {

    function Error(params) {
        this.message = {
            404: 'We could not find that, sorry',
            500: 'Nasty error, sorry'
        }[params.code];
    }

    return { viewModel: Error, template: templateMarkup };
});
