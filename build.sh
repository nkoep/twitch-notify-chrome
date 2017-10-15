#!/bin/sh

set -o errexit

die() {
  echo $*
  exit 1
}

if [ $# -ne 1 ]; then
  die "One argument required (output directory)"
fi
outdir="$1"

# Check if the necessary command-line tools can be found in PATH.
for p in npm gulp; do
  command -v $p >/dev/null 2>&1 || { die "\`$p\` not found in PATH"; }
done

npm install

# Directory definitions
basedir="$(pwd)"
bowerdir="$basedir/bower_components"
semanticdir="$bowerdir/semantic"
builddir="$semanticdir/dist"

# Download semantic-ui
npm run bower -- install semantic
cd "$semanticdir"
npm install --ignore-scripts

# Configure semantic-ui
cp "$basedir/rc/semantic.json" .
cp src/theme.config.example src/theme.config
cp -R src/_site src/site
cp "$basedir/rc/site.variables" src/site/globals

# Build semantic-ui
gulp build
cd "$basedir"

# Install semantic-ui
mkdir -p "$outdir"

cp -R js css img "$outdir"
cp *.html manifest.json "$outdir"

cp "$builddir/semantic.min.js" "$outdir/js"
cp "$builddir/semantic.min.css" "$outdir/css"
mkdir -p "$outdir/css/themes"
cp -R "$builddir/themes/default" "$outdir/css/themes"

# Install jquery (gets fetched as a dependency of semantic-ui anyway)
cp "$bowerdir/jquery/dist/jquery.min.js" "$outdir/js"
