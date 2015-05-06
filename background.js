chrome.runtime.onInstalled.addListener(function() {
  chrome.alarms.create("checkStreamStatus", {"periodInMinutes": 1});
});
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name == "checkStreamStatus") {
    // TODO
  }
});

function bla() {
  return "blub";
}

