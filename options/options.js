// Saves options to chrome.storage.sync.
function save_options() {

  var server_url = document.getElementById('server_url').value;
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  chrome.storage.sync.set({
    serverUrl: server_url,
    userName: username,
    passWord: password,
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
    serverUrl: '',
    userName: '',
    passWord: '',
  }, function(items) {
    document.getElementById('server_url').value = items.serverUrl;
    document.getElementById('username').value = items.userName;
    document.getElementById('password').value = items.passWord;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);