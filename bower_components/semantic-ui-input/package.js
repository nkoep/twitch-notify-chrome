
Package.describe({
  name    : 'semantic:ui-input',
  summary : 'Semantic UI - Input: Single component release',
  version : '1.12.2',
  git     : 'git://github.com/Semantic-Org/UI-Input.git',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.addFiles([
    'input.css'
  ], 'client');
});
