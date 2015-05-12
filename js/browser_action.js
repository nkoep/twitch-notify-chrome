function getChannels(callback) {
  chrome.runtime.getBackgroundPage(function(page) {
    callback(page.channels);
  });
}

// TODO: Use underscore.js' template system to generate the table.
function createTableRow(name, isLive, viewers) {
  var color = isLive ? "red" : "gray";
  var baseUrl = "https://twitch.tv/";
  var tr = $("<tr>");
  var a = $("<a href='" + baseUrl + name + "' target='_blank'>");
  var tdChannel = $("<td>").append(a.text(name));
  var tdViewers = $("<td class='collapsing'>");
  var aViewers = a.clone().text(viewers.toLocaleString());
  tdViewers.append($("<i class='users icon " + color + "'>")).append(aViewers);
  var tdRemoveChannel = $("<td class='collapsing'>");
  var iRemoveChannel = $("<i class='remove user icon'>");
  var divRemoveChannelButton = $(
    "<div class='ui fitted tiny icon button remove-channel'>");
  divRemoveChannelButton.data("name", name);
  tdRemoveChannel.append(
    divRemoveChannelButton.append(iRemoveChannel));
  tr.append(tdChannel, tdViewers, tdRemoveChannel);
  return tr;
}

function updateChannelList(channels) {
  var tbody = $("#channel-list tbody");
  tbody.empty();
  if (channels.count() === 0) {
    tbody.append($("<tr>").append($("<td>").text("No channels added yet")));
  } else {
    channels.foreach(function(channel) {
      tbody.append(
        createTableRow(channel.name, channel.isLive, channel.viewers));
    });
    // Hook up the remove button callbacks.
    $(".remove-channel").click(function() {
      channels.removeChannel($(this).data("name"));
    });
  }
}

function initializeUi() {
  var addChannel = $("#add-channel");
  var channelInput = $("#channel input");
  addChannel.click(function() {
    var channel = channelInput.val();
    getChannels(function(channels) {
      // Clear the input field if we successfully added the channel.
      if (channels.addChannel(channel)) {
        channelInput.val("");
      }
    });
  });
  $("#channel").submit(function(ev) {
    ev.preventDefault();
    // We just fake a click event on form submissions to re-use the click
    // signal handler.
    addChannel.click();
  });
  var showNotifications = $("#show-notifications");
  // TODO: Add a settings API to background.js that wraps calls to
  //       chrome.storage.
  chrome.storage.local.get({"show-notifications": false}, function(result) {
    var state = result["show-notifications"] ? "check" : "uncheck";
    // FIXME: There is a bug in semantic-ui's 1.12.2 button module that
    //        prevents the checkbox state to be set programmatically.
    showNotifications.checkbox(state);
  });
  showNotifications.checkbox("setting", "onChange", function() {
    var state = showNotifications.checkbox("is checked");
    // XXX: Remove this once the bug in semantic-ui is fixed.
    state = true;
    chrome.storage.local.set({"show-notifications": state});
  });
  channelInput.focus();
}

document.addEventListener("DOMContentLoaded", function() {
  initializeUi();

  getChannels(function(channels) {
    // Update the channel list on changes.
    channels.onchange(updateChannelList);
    // Update the channel list once on page load.
    updateChannelList(channels);
  });
});

