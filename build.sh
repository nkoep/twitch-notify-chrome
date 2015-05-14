#!/bin/sh

set -e

function die() {
    echo $*
    exit 1
}

function move() {
    if [[ $# -ne 2 ]]; then
        die "Not enough arguments to function `move`"
    fi
    if [[ -e $1 ]]; then
        mv "$1" "$2"
    fi
}

# Directory definitions
basedir=$(pwd)
semanticdir="$basedir/bower/semantic-ui"
builddir="$semanticdir/dist"

# Download semantic-ui
bower install semantic-ui
cd $semanticdir
npm install --ignore-scripts

# Configure semantic-ui
cat > semantic.json <<EOF
{
  "base": "",
  "paths": {
    "source": {
      "config"      : "src/theme.config",
      "definitions" : "src/definitions/",
      "site"        : "src/site/",
      "themes"      : "src/themes/"
    },
    "output": {
      "packaged"     : "dist/",
      "uncompressed" : "dist/components/",
      "compressed"   : "dist/components/",
      "themes"       : "dist/themes/"
    },
    "clean"        : "dist/"
  },
  "permission" : false,
  "rtl": false,
  "components": [
    "button",
    "icon",
    "input",
    "form",
    "table",
    "checkbox"
  ]
}
EOF

move src/theme.config.example src/theme.config
move src/_site src/site
# Override device breakpoints to force desktop sizes
cat > src/site/globals/site.variables <<EOF
@largestMobileScreen: 0px;
@largestTabletScreen: 0px;
EOF

# Build semantic-ui
gulp build

# Install semantic-ui
cd "$basedir"
cp "$builddir/semantic.min.js" js/
cp "$builddir/semantic.min.css" css/
mkdir -p css/themes/
cp -R "$builddir/themes/default" css/themes/

