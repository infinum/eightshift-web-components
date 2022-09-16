# Conditional logic repeater

A simple web component that allows adding multiple rules for conditionally rendering form fields.

## Usage

1. Import/enqueue the web component `.js` file
2. Use it in your markup:

```html
<conditional-logic-repeater fields='[{"label":"Name","value":"name"},{"label":"E-mail","value":"email"},{"label":"Date of birth","value":"dob"}]'></conditional-logic-repeater>
```

### Settable props

- **`fields`** - fields that are shown in the dropdown menu, should be provided as a JSON string (array of objects with label & value keys)
- **`hasUseToggle`** - if provided, enables the *Use conditional logic* toggle

### Gettable props

- **`conditions`** - all the conditions the user has set,
  in the format of
  ```js
  [
    { field: "", comparison: "is", value: "" },
    { field: "", comparison: "is", value: "" },
	...
  ]
  ```
  where `field` is the `value` of the chosen field (from the list of `fields`), `comparison` is the compare type, and `value` the entered value
- **`behavior`** - `show` or `hide`, depending on the user's choice
- **`logic`** - `and` (*all*) or `or` (*any*), depending on the user's choice

Props can be fetched just as with any other HTML element, e.g.
```js
const repeaterElement = document.querySelector('.demo-repeater');

if (repeaterElement.enabled) {
	console.log({
		enabled: repeaterElement.enabled,
		behavior: repeaterElement.behavior,
		logic: repeaterElement.logic,
		conditions: repeaterElement.conditions,
	});
} else {
	console.log('Repeater is disabled');
}
```
## Setup

1. Clone
2. `npm install`

### Dev build
Run `npm run dev` in your terminal.

You will get a link in your terminal which you can open. A live server starts up and updates as you develop.

### Production build
Run `npm run build` in your terminal.

The compiled component will be in `dist/assets`, with a randomly generated filename.

## File & folder structure

- `dist`: _output folder_ (auto-generated on production builds)
- `src`: _source code_
  - `Repeater.svelte`: _the conditional-logic-repeater web component_
  - `main.js`: _supporting file for preparing the export of the web component_
- `index.html`: _Sample/demo page_
- other JSON/config files: _not important_

## How it works

Svelte has an option to export web components.

`Repeater.svelte` contains all the logic and styles for the component.

All the `export let` properties will be publicly accessible using JS when the exported component is used.

The `<svelte:options tag='conditional-logic-repeater' />` defines the custom element tag name.

For more info about the rest of Svelte logic and how it works, visit [the Svelte docs](https://svelte.dev/docs).


### Why Svelte?
Usually web components are pretty cumbersome to build, requiring a lot of code for not much work, all the fiddling with HTML templates, etc.

Svelte makes it all easier with its simple, yet powerful syntax.
