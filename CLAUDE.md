# Stella Maris Jekyll Site Guide

## Build Commands
- `bundle install` - Install dependencies
- `bundle exec jekyll serve` - Run development server with live reload
- `bundle exec jekyll build` - Build site for production (outputs to _site/)
- `bundle exec jekyll clean` - Clean the site (removes _site/ and .jekyll-cache/)

## Code Style Guidelines

### Markup/Content
- Use Markdown for content in `.markdown` files
- Follow front matter format with proper indentation:
  ```yaml
  ---
  layout: default
  title: Page Title
  ---
  ```

### HTML/Layout
- Use semantic HTML5 elements
- Classes follow kebab-case naming convention (e.g., `parallax-image`, `three-column-section`)
- Maintain consistent indentation (2 spaces)

### CSS/SCSS
- Follow BEM-like naming convention where appropriate
- Use Sass nesting (max 3 levels deep)
- Organize CSS by component/section

### JavaScript
- Use ES6+ syntax where possible
- Functions follow camelCase naming
- Prefer `const` and `let` over `var`
- Use descriptive variable names