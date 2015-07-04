# twitch-notify Chrome extension

**twitch-notify** is a small Chrome extension that allows monitoring
[Twitch](http://twitch.tv) channels without the need to follow a particular
channel or even have a Twitch account. Instead, the extension periodically
checks whether a channel is live, and -- if so configured -- displays a
notification when a stream just started broadcasting.

## Installation

The extension is currently **not** available in the Chrome Web Store, and
therefore has to be built and installed manually. Since it uses the
[semantic-ui](http://semantic-ui.com) framework to construct its user
interface, a simple build script is supplied to fetch, configure and build the
necessary components. Before invoking it, make sure that `npm`, `bower` and
`gulp` are all found in the `PATH` variable. Then just issue
```bash
$ ./build.sh
```
to build the extension. To install it in Chrome, go to `chrome://extensions`,
make sure the `Developer mode` box is checked, and use the `Load unpacked
extension...` button to install in extension.

