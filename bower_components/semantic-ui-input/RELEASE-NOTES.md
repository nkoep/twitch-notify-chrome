### Version 1.12.2 - May 4, 2015

- **Dropdown** - Fixed `left` and `right` arrow does not move input cursor with `visible selection dropdown`. Event accidentally prevented by `sub menu` shortcut keys.

### Version 1.12.1 - April 26, 2015

- **Input** - Fixes labeled inputs not adjusting correctly with flex. **Backported from 2.0**
- **Input** - Fixes placeholder text color prefixes for `webkit` **Backport from 2.0**

### Version 1.12.0 - April 13, 2015

- **Input** - Backports fix from `2.x` for `ui fluid input` not appearing correctly.

### Version 1.11.0 - March 3, 2015

- **Form** - Added `input[type="search"]` styles to `ui form`

### UI Changes

- **Input** - Input with dropdowns is now much easier, see docs. `action input` and `labeled input` now use `display: flex`. `ui action input` now supports `<button>` tag usage (!) which support `flex` but not `table-cell`
- **Form** - Input rules now apply to `input[type="time"]`

### Version 1.8.1 - January 26, 2015

- **Input** - `ui labeled input` now uses  `flex` added example in ui docs with dropdown
- **Input** - Fix border radius on `ui action input` with button groups, aka `ui buttons`

### Version 1.8.0 - January 23, 2015

- **Form** - Form will now prevent browsers from resubmitting form repeatedly when keydown is pressed on input field.
- **Checkbox** - Checkbox now only modifies `input[type="radio"]` and `input[type="checkbox"]` ignoring any other inputs

### Version 1.7.0 - January 14, 2015

- **Site** - Form input highlighting color added (helps differentiate form colors with autocompleted fields). Default text highlighting color moved from highlighter yellow to a mellow blue.
- **Dropdown** - Search dropdown input can now have backgrounds. Fixes issues with autocompleted search dropdowns which have forced yellow "autocompleted" bg.
- **Dropdown** - Fixes dropdown search input from filtering text values when input is inside menu, i.e "In-Menu Search"

### Version 1.5.0 - December 30, 2014

- **Form** - ``ui input`` now receives the same formatting as a normal input inside an ``inline field``
- **Input** - Fixed bug when ``ui action input`` uses a ``ui icon button``, button was receiving `i.icon` formatting.

### Version 1.4.0 - December 22, 2014

- **Form** - Form inputs without ``type`` specified are now formatted **Thanks PSyton**

### Version 1.3.0 - December 17, 2014

- **Dropdown** - Search Dropdown is now much more responsive, js improvements and input throttling added.Throttling defaults to `50ms` and can be modified with settings ``delay.search``

### Version 1.2.0 - December 08, 2014

- **Checkbox** - JS Checkbox now handles several variations of html. Labels can be before inputs, after, or not included at all. This should work better with server side form generation.

### Version 1.1.0 - December 02, 2014

- **Input** - ``transparent input`` can now be ``inverted``
- **Input** - ``ui action input`` can now accomodate ``ui button`` that adjust padding from default
- **Dropdown** - Fix ``action input`` used inside ``ui dropdown`` to appear correctly **Thanks ordepdev**

### Version 1.0.0 - November 24, 2014

- **Form** - Date field has been removed, use a ``ui icon input`` with a ``calendar icon`` instead
- **Input** - Labeled inputs now have ``corner`` ``left`` and ``top`` label types. Any labeled inputs should be converted to ``corner labeled input`` to preserve functionality from ``0.x``
- **Dropdown** - Many new content types now work inside dropdowns, headers, dividers, images, inputs, labels and more
- **Form** - Inputs now use 1em font size and correctly match selection dropdown height

### Version 0.18.0 - June 6, 2014

- **Modal** - Modals now focus on first input if available **Thanks Knotix**

### Version 0.17.0 - May 9, 2014

- **Form, Input** - Fixes ``ui input`` to work correctly inside ``inline field``

### Version 0.15.5 - April 11, 2014

- **Checkbox** - Fixes ``ui checkbox`` to obey ``disabled`` property of input

### Version 0.15.0 - Mar 14, 2014

- **Form** - Forms, Dropdowns, and Inputs now have matching padding size, and use 1em font size to appear same size as surrounding text
- **Input** - Fixes slight error in corner label rounding **Thanks MohammadYounes**
- **Checkbox** - Checkboxes can now have multiple inputs inside, for use with .NET and other languages that insert their own hidden inputs

### Version 0.13.1 - Feb 28, 2014

- **Input** - Fixes ui input to inherit form sizing

### Version 0.13.0 - Feb 20, 2014

- **Label** - Corner labels now are coupled to have rounded edges with components with rounded edges like input
- **Form Validation** - Form validation now rechecks on all form change events, not just input change

### Version 0.12.4 - Jan 29, 2014

- **Input** - Fixes ``ui buttons`` to work inside an ``ui action input`` **Thanks MohammadYounes **

### Version 0.12.2 - Jan 21, 2014

- **Menu** - Slightly updates input sizes inside menus

### Version 0.12.1 - Jan 15, 2014

- **Menu** - Fixes ``action input`` to work inside menus  **thanks joltmode**

### Version 0.12.0 - Jan 06, 2014

- **Input** - Fixes input placeholder styles to work (accidental regex replace)
- **Input** - Action inputs can now be fluid
- **Form** - Fixes all validation input to be trimmed for whitespace

### Version 0.10.3 - Dec 22, 2013

- **Input** - Removes duplicate sizes

### Version 0.10.2 - Dec 13, 2013

- **Input** - Action inputs now support button groups

### Version 0.10.0 - Dec 05, 2013

- **Form Validation** - Adds two new parameters, to allow for changing of revalidation and delay on input

### Version 0.9.4 - Nov 24, 2013

- **Form** - Adds input type="url" to forms

### Version 0.9.0 - Nov 5, 2013

- **Input** - Labeled icons now have smaller corner labels

### Version 0.8.0 - Oct 25, 2013

- **Input** - Action buttons now have tactile feedback like normal buttons
- Added new examples to button and input

### Version 0.6.2 - Oct 15, 2013

- Fixes input position inside menus with no other content
- Fixes input sizing on small/large menus

### Version 0.3.2 - Oct 2, 2013

- Adds input focus/blur to modal, see Issue #124
- Fixes icon input inside a menu placement issues

### Version 0.2.5 - Sep 28, 2013

- Fixes checkbox  selector issue with multiple inputs inside a checkbox
- Fixes dropdown to now set active item to whatever hidden input field is when using action updateForm

### Version 0.1.0 - Sep 25, 2013

- Added fluid input variation