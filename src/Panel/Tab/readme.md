# Tab Component

The Tab component is a reusable WP Gutenberg component designed to render a tabbed interface with customizable styles and functionality. It provides a simple and intuitive way to create tabbed navigation elements within a React application.

## Usage

```javascript
const MyComponent = () => {
  return (
    <Tab
      options={["Tab 1", "Tab 2", "Tab 3"]}
      value={tab}
      onChange={(value) => setTab(tab)}
    />
  );
};

export default MyComponent;
```

## Props

The Tab component accepts the following props:

- `options`: An array of strings representing the tab labels.
- `value`: The currently selected tab value.
- `onChange`: A callback function to handle tab change events.
- `paddingY`: Vertical padding for the tab labels.
- `paddingX`: Horizontal padding for the tab labels.
- `borderColor`: Color of the tab borders.
- `hoverColor`: Background color of the tabs on hover.
- `activeColor`: Background color of the active tab.
- `color`: Text color of the tab labels.
