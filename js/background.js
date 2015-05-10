function timestamp() {
  return (new Date()).toTimeString();
}

function log(message) {
  console.log(timestamp() + ": " + message);
}

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
    var deferred = $.Deferred();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.twitch.tv/kraken/streams/" + this.name);
    xhr.responseType = "json";
    xhr.onload = function() {
      deferred.resolve(xhr.response);
    };
    xhr.send();
    return deferred.promise();

    // return $.ajax({
    //   "url": "https://api.twitch.tv/kraken/streams/" + this.name,
    //   "dataType": "json"
    // });
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
    var this_ = this;
    chrome.storage.sync.get({"channels": []}, function(result) {
      result.channels.forEach(function(name, idx) {
        log("restore: " + name);
        this_.channelList_.push(new Channel(name));
      });
      // TODO: REMOVE THIS!
      channels.poll();
    });
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
    $.when.apply($, promises).done(function(channelStates) {
      for (key in channelStates) {
        var state = channelStates[key];
        log(key + " - " + state);
      }
    });

    this.signalChange_();
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
    // channels.poll();
  }
});

