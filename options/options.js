// Remove trailing slash from url
function stripTrailingSlash(str) {
    if(str.substr(-1) === '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
}

function addhttp(url) {
   if (!/^(f|ht)tps?:\/\//i.test(url)) {
      url = "http://" + url;
   }
   return url;
}

// Saves options to chrome.storage.sync.
function save_options() {

  var server_url = document.getElementById('server_url').value;
  server_url = stripTrailingSlash(server_url);
  server_url = addhttp(server_url);

  chrome.storage.sync.set({
    serverUrl: server_url
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1000);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    serverUrl: ''
  }, function(items) {
    document.getElementById('server_url').value = items.serverUrl;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);