function timestamp() {
  return Date.now();
}

function log(message) {
  console.log(timestamp() + ": " + message);
}

function updateBrowserAction(channels) {
  var action = chrome.browserAction, icon, text;
  action.setBadgeBackgroundColor({"color": [100, 65, 165, 175]});
  if (channels.length > 0) {
    icon = "twitch";
    text = channels.length.toString();
  } else {
    icon = "twitch_gray";
    text = "";
  }
  action.setIcon({"path": "img/" + icon + ".png"});
  action.setBadgeText({"text": text});
}

function sendNotification(channels) {
  var channelNames = [];
  channels.forEach(function(channel, idx) {
    channelNames.push(channel.name);
  });
  if (channels.length > 0) {
    if (channels.length === 1) {
      var title = "New channel is live";
      var message = " is streaming";
    } else {
      var title = "New channels are live";
      var message = " are streaming";
    }
    chrome.storage.local.get({"show-notifications": true}, function(result) {
      if (result["show-notifications"]) {
        chrome.notifications.create("twitch-notify", {
          "type": "basic", "iconUrl": "img/notifications.png",
          "title": title,
          "message": channelNames.join(", ") + message
        });
      }
    });
  }
}

function Channel(name) {
  this.name = name;
  this.viewers = 0;
  this.isLive = false;
}

Channel.prototype = {
  pollState: function() {
    return $.ajax({
      "url": "https://api.twitch.tv/kraken/streams/" + this.name,
      "dataType": "json"
    }).done(function(data) {
      var stream = data.stream;
      if (stream) {
        this.viewers = stream.viewers;
        this.isLive = true;
      } else {
        this.viewers = 0;
        this.isLive = false;
      }
    }.bind(this));
  }
}

function Channels() {
  this.channelList_ = [];
  this.onchangeCallback_ = null;
}

Channels.prototype = {
  count: function() {
    return this.channelList_.length;
  },

  find_: function(name) {
    for (var idx in this.channelList_) {
      if (this.channelList_[idx].name === name) {
        return idx;
      }
    }
    return -1;
  },

  get_: function(name) {
    var idx = this.find_(name);
    if (idx !== -1) {
      return this.channelList_[idx];
    }
    return null;
  },

  addChannel: function(name) {
    if (name && this.find_(name) === -1) {
      this.channelList_.unshift(new Channel(name));
      this.save_();
      return true;
    }
    return false;
  },

  removeChannel: function(name) {
    var idx = this.find_(name);
    if (idx !== -1) {
      this.channelList_.splice(idx, 1);
      this.save_();
    }
  },

  getChannelNames_: function() {
    var channelNames = [];
    this.foreach(function(channel) {
      channelNames.push(channel.name);
    });
    return channelNames;
  },

  restore: function() {
    var this_ = this; // so we don't have to .bind twice
    chrome.storage.sync.get({"channels": []}, function(result) {
      result.channels.forEach(function(name, idx) {
        this_.channelList_.push(new Channel(name));
      });
      channels.poll();
    });
  },

  save_: function() {
    chrome.storage.sync.set({"channels": this.getChannelNames_()}, function() {
      channels.poll();
    }.bind(this));
  },

  foreach: function(callback) {
    this.channelList_.forEach(function(channel, idx) {
      callback(channel);
    });
  },

  poll: function() {
    var promises = [];
    var states = {};
    this.foreach(function(channel) {
      // Cache the old state.
      states[channel.name] = channel.isLive;
      // Poll for the new state.
      promises.push(channel.pollState());
    });
    $.when.apply($, promises).done(function() {
      // Check whether any new channels went live.
      var liveChannels = [];
      var newlyLiveChannels = [];
      this.foreach(function(channel) {
        if (channel.isLive) {
          liveChannels.push(channel);
          if (!states[channel.name]) {
            // The channel was offline before.
            newlyLiveChannels.push(channel);
          }
        }
      });
      updateBrowserAction(liveChannels);
      sendNotification(newlyLiveChannels);

      // The channel states are resolved in the Channel object, so we only need
      // to inform the UI about the fact that channel states were updated here.
      this.signalChange_();
    }.bind(this));
  },

  onchange: function(callback) {
    this.onchangeCallback_ = callback;
  },

  signalChange_: function() {
    if (this.onchangeCallback_) {
      this.onchangeCallback_(this);
    }
  }
}

var channels = new Channels();

function init() {
  chrome.alarms.create("pollChannelStates", {"periodInMinutes": 1});
  channels.restore();
}

chrome.runtime.onInstalled.addListener(init);
chrome.runtime.onStartup.addListener(init);
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name == "pollChannelStates") {
    channels.poll();
  }
});

