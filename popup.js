var source   = $("#service-template").html();
var template = Handlebars.compile(source);

Handlebars.registerHelper('if_eq', function(a, b, opts) {
    if(a == b) // Or === depending on your needs
        return opts.fn(this);
    else
        return opts.inverse(this);
});

chrome.storage.sync.get({
    serverUrl: '',
}, function(items) {
    var server_url = items.serverUrl;

    if (server_url == "") {
        $('#message')
            .html('<div class="message cabot-no-url"><i class="fa fa-exclamation fa-5x"></i><br>You have not set a server URL.</div>');
        $('body').on('click', 'div.cabot-no-url', function(){
            chrome.runtime.openOptionsPage()
            return false;
        });
    }
    else {

    var services_api_url = server_url + '/api/services';

    // get csrf token
    chrome.runtime.sendMessage({server_url: server_url}, function(response) {
    $.ajax({
        url: services_api_url,
        dataType: "json",
        data: {
          'csrfmiddlewaretoken': response.csrftoken
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Unable to get services");
            console.log(jqXHR);
            console.log(textStatus);
            if (jqXHR.status == 401) {
                $('#message')
                .html('<div class="message cabot-unauthorised"><i class="fa fa-lock fa-5x"></i><br>Youre not authorised for this server.<br>Click here to log in.</div>');
            }

            if (jqXHR.status == 0) {
                $('#message')
                .html('<div class="message cabot-no-connection"><i class="fa fa-question fa-5x"></i><br>Unable to read service data from ' + services_api_url + '</div>');
            }
        },
        success: function(data, textStatus, jqXHR) {
            var context = {services: data, server_url: server_url};
            html = template(context);
            $('#service-table-body')
                .html(html);
            console.log(jqXHR);
        }
    });
    });

    // Open service in new tab if its row is clicked
    $('body').on('click', 'tr.service', function(){
        var service_url = server_url + '/service/' + $(this).attr('service-id');
        chrome.tabs.create({url: service_url});
        return false;
    });

    // Open login page in new tab.
    $('body').on('click', 'div.cabot-unauthorised', function(){
        var service_url = server_url + '/accounts/login/?next=/services/';
        chrome.tabs.create({url: service_url});
        return false;
    });
}

});