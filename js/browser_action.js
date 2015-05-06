// Copyright (c) 2015 Niklas Koep

function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

function getStreamInfo(streamName, callback, errorCallback) {
  var searchUrl = "https://api.twitch.tv/kraken/streams/" + streamName;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", searchUrl);
  // The twitch API responds with JSON, so let Chrome parse it.
  xhr.responseType = "json";
  xhr.onload = function() {
    // Parse and process the response.
    var response = xhr.response;
    if (!response || !response.responseData ||
        !response.responseData.stream) {
      errorCallback("Failed to retrieve info for stream " + streamName);
    } else {
      callback(response.responseData.stream);
    }
  };
  xhr.onerror = function() {
    errorCallback("Network error");
  };
  xhr.send();
}

function getStoredStreams(callback) {
  chrome.storage.sync.get({"streams": ["gocnak"]}, function(result) {
    callback(result.streams)
  });
}

function updateStreamList(streams) {
  chrome.runtime.getBackgroundPage(function(page) {
    var list = $("#stream-list");
    streams.forEach(function(stream, idx) {
      var li = $("<li></li>");
      li.text(stream);
      list.append(li);
    });
  });
}

document.addEventListener("DOMContentLoaded", function() {
  // TODO: Check if the current tab shows a twitch.tv page.
  getCurrentTabUrl(function(url) {
    chrome.runtime.getBackgroundPage(function(page) {});
  });

  // Populate the stream list.
  getStoredStreams(function(streams) {
    // TODO: Add a finish callback and call
    updateStreamList(streams);
  });
});

