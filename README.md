# babel-plugin-react-attribute-scope

Allows for automatic namespacing of props and attribute values to the React component where they are used.

This is useful for automated testing where you want to ensure your data-hooks, dataIds or whatever convention you are using are unique on an individual page.


For example in `login-form.jsx`

`<Button dataHook="button" />` becomes `<Button dataHook="login-form-button" />`



## Usage
In `babel.config.js`, add `react-attribute-scope` to your plugins, and specify the `jsxProperty` and `htmlAttribute` you want to transform.

```javascript
  const plugins = [
    ['react-attribute-scope', { jsxProperty: 'dataHook', htmlAttribute: 'data-hook' }],
    ...
    ];
```

