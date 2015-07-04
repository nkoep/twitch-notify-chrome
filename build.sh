#!/bin/sh

set -e

die() {
  echo $*
  exit 1
}

# Check if npm, bower and gulp can be found in PATH.
for p in npm bower gulp; do
  if [[ ! -f $(which $p 2>/dev/null) ]]; then
    die "\`$p\` not found in \$PATH"
  fi
done

# Directory definitions
basedir=$(pwd)
bowerdir="$basedir/bower_components"
semanticdir="$bowerdir/semantic-ui"
builddir="$semanticdir/dist"

# Download semantic-ui
bower install semantic-ui
cd $semanticdir
npm install --ignore-scripts

# Configure semantic-ui
cp "$basedir/rc/semantic.json" .
cp src/theme.config.example src/theme.config
cp -R src/_site src/site
cp "$basedir/rc/site.variables" src/site/globals/

# Build semantic-ui
gulp build

# Install semantic-ui
cd -
cp "$builddir/semantic.min.js" js/
cp "$builddir/semantic.min.css" css/
mkdir -p css/themes/
cp -R "$builddir/themes/default" css/themes/

# Install jquery (gets fetched as a dependency of semantic-ui anyway)
cp "$bowerdir/jquery/dist/jquery.min.js" js/

