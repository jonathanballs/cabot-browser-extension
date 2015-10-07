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
