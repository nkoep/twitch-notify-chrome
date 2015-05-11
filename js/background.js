function timestamp() {
  return Date.now();
}

function log(message) {
  console.log(timestamp() + ": " + message);
}

// TODO: Notify when we notice that streams went live.
// TODO: Update the browser action icon via
//         chrome.browserAction.setIcon({"path": "img/icon.png"});
function notify() {
  chrome.notifications.create("bla", {
    "type": "basic", "iconUrl": "img/icon.svg", "title": "remove channel",
    "message": channel
  });
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
      this.channelList_.push(new Channel(name));
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
    }.bind(this));
  },

  save_: function() {
    chrome.storage.sync.set({"channels": this.getChannelNames_()});
    this.signalChange_();
  },

  foreach: function(callback) {
    this.channelList_.forEach(function(channel, idx) {
      callback(channel);
    });
  },

  poll: function() {
    var promises = [];
    this.foreach(function(channel) {
      promises.push(channel.pollState());
    });
    $.when.apply($, promises).done(function() {
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

