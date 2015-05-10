// Copyright (c) 2015 Niklas Koep

function getChannels(callback) {
  chrome.runtime.getBackgroundPage(function(page) {
    callback(page.channels);
  });
}

function createTableRow(name, isLive, viewers) {
  var color = isLive ? "red" : "gray";
  var baseUrl = "https://twitch.tv/";
  var tr = $("<tr>");
  var a = $("<a href='" + baseUrl + name + "' target='_blank'>");
  var tdChannel = $("<td>").append(a.text(name));
  var tdViewers = $("<td class='collapsing'>");
  tdViewers.append($("<i class='users icon " + color + "'>")).append(
    viewers.toLocaleString());
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

function registerUiCallbacks() {
  var addChannel = $("#add-channel");
  addChannel.click(function() {
    var channelInput = $("#channel input");
    var channel = channelInput.val();
    getChannels(function(channels) {
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
  var enableNotifications = $("#enable-notifications");
  enableNotifications.checkbox("setting", "onChange", function() {
    var state = enableNotifications.checkbox("is checked");
    console.log("TODO: toggle notifications");
  });
}

document.addEventListener("DOMContentLoaded", function() {
  registerUiCallbacks();

  getChannels(function(channels) {
    // Update the channel list on changes.
    channels.onchange(updateChannelList);
    // Update the channel list once on page load.
    updateChannelList(channels);
  });
});

