// Respond to requests for csrf token
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // Get and return csrf token
    chrome.cookies.get({ url: request.server_url, name: 'csrftoken' },
      function (cookie) {
        if (cookie) {
            sendResponse({csrftoken: cookie.value});
        } else {
            sendResponse({csrftoken: ''})
        }
    });
    
    return true;
});

// Continuously check for failing services
window.setInterval(function(){

    chrome.storage.sync.get({
    serverUrl: ''
    }, function(items) {
            server_url = items.serverUrl;
            chrome.cookies.get({ url: server_url, name: 'csrftoken' },
            function (cookie) {
            if (cookie) {

                $.ajax({
                    url: server_url + '/api/services/',
                    dataType: "json",
                    data: {
                      'csrfmiddlewaretoken': cookie.value
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR);
                        return;
                    },
                    success: function(data, textStatus, jqXHR) {
                        var failing = 0;

                        var i;
                        for (i=0; i<data.length; i++) {
                            if (data[i].overall_status != "PASSING") {
                                failing = failing + 1;
                            }
                            console.log(data[i]);
                        }
                        chrome.browserAction.setBadgeText({text: failing.toString()});
                    }
                });


            } else {
                return;
            }
        });
    });
}, 1000);