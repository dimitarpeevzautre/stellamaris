# Stella Maris Jekyll Site - GitHub Copilot Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Project Overview
Stella Maris is a multilingual Jekyll static site for a Portuguese Water Dog breeder based in Sofia, Bulgaria. The site supports English, Bulgarian, and Spanish languages using the jekyll-multiple-languages-plugin, and features custom parallax scrolling effects.

## Working Effectively

### Essential Setup (REQUIRED EVERY TIME)
Run these commands in order BEFORE any Jekyll operations:

```bash
# Install bundler for user (due to permission restrictions)
gem install bundler --user-install

# Add gem binary path to PATH (CRITICAL - Jekyll won't work without this)
export PATH=$PATH:/home/runner/.local/share/gem/ruby/3.2.0/bin

# Configure bundle to install locally (REQUIRED due to system permission restrictions)
bundle config set --local path vendor/bundle

# Install dependencies - takes ~30 seconds. NEVER CANCEL.
bundle install
```

### Build Commands (All validated and timed)

```bash
# Build site for production - takes ~2 seconds. NEVER CANCEL. Set timeout to 10+ seconds.
bundle exec jekyll build

# Run development server - starts in ~2 seconds, runs continuously
bundle exec jekyll serve --host 0.0.0.0 --port 4000

# Clean build artifacts - takes ~1 second
bundle exec jekyll clean
```

**CRITICAL TIMING**: 
- Bundle install: ~25 seconds (NEVER CANCEL - set timeout to 60+ seconds)
- Jekyll build: ~1.2 seconds (NEVER CANCEL - set timeout to 10+ seconds) 
- Jekyll serve: ~2 seconds to start (NEVER CANCEL - set timeout to 10+ seconds)
- Jekyll clean: ~0.6 seconds (NEVER CANCEL - set timeout to 5+ seconds)

### Development Workflow
Always follow this exact sequence:
1. Run essential setup commands above
2. `bundle exec jekyll clean` (clean previous builds)
3. `bundle exec jekyll build` (build fresh)
4. `bundle exec jekyll serve --host 0.0.0.0 --port 4000` (test locally)
5. Access site at `http://localhost:4000/`

## Validation Scenarios
ALWAYS manually validate changes by running these complete end-to-end scenarios:

### Required Validation Tests
1. **Multilingual Generation**: Verify all three language versions are generated
   ```bash
   bundle exec jekyll build
   ls -la _site/        # Should show English version 
   ls -la _site/bg/     # Should show Bulgarian version
   ls -la _site/es/     # Should show Spanish version
   ```

2. **Site Functionality**: Test the development server
   ```bash
   bundle exec jekyll serve --host 0.0.0.0 --port 4000
   curl -s http://localhost:4000/ | grep -o "<title>.*</title>"  # Should return title
   curl -s http://localhost:4000/bg/ | grep -o "<title>.*</title>"  # Should return title
   curl -s http://localhost:4000/es/ | grep -o "<title>.*</title>"  # Should return title
   ```

3. **Build Integrity**: Ensure clean builds work
   ```bash
   bundle exec jekyll clean
   bundle exec jekyll build
   # Should complete without errors, only Sass deprecation warnings are expected
   ```

## Known Issues and Workarounds

### Permissions Issue (CRITICAL)
- **Problem**: Standard gem installation fails with permission errors
- **Solution**: Always use `gem install bundler --user-install` and configure bundle path locally
- **Required**: Export PATH with `/home/runner/.local/share/gem/ruby/3.2.0/bin`

### Sass Deprecation Warnings (EXPECTED)
- **Problem**: Build shows many Sass deprecation warnings about `@import` and color functions
- **Status**: These warnings are EXPECTED and do NOT indicate build failure
- **Action**: Ignore these warnings - the build completes successfully despite them

### Bundle Path Configuration (REQUIRED)
- **Problem**: Bundle install fails without local path configuration
- **Solution**: Always run `bundle config set --local path vendor/bundle` before `bundle install`

## File Structure and Navigation

### Key Directories
- `_layouts/` - Jekyll layout templates (default.html, page.html, post.html, home.html)
- `_includes/` - Reusable template components  
- `_sass/` - Custom SCSS files including parallax.scss for custom styling
- `_i18n/` - Translation files (en.yml, bg.yml, es.yml)
- `assets/` - Images, CSS, JavaScript, and SVG files
- `vendor/bundle/` - Local gem installation (excluded from git)
- `_site/` - Generated static site (excluded from git)

### Important Files
- `Gemfile` - Ruby dependencies including Jekyll 4.3.4 and jekyll-multiple-languages-plugin
- `_config.yml` - Jekyll configuration with multilingual settings
- `CLAUDE.md` - Developer guide with style guidelines
- `.github/workflows/jekyll-gh-pages.yml` - GitHub Pages deployment workflow

### Content Files
All content pages are Markdown files at root level:
- `index.markdown` - Homepage with parallax images
- `story.markdown`, `breed.markdown`, `dogs.markdown` - Content pages
- `puppies.markdown`, `litters.markdown`, `apply.markdown` - Dog breeding pages
- `contact.markdown`, `thanks.markdown` - Contact and thank you pages

## Dependencies and Requirements

### Required Software
- Ruby 3.2+ (available in environment)
- Bundler (install with `gem install bundler --user-install`)
- Jekyll 4.3.4 (installed via bundle)

### Key Gems
- `jekyll` - Static site generator
- `minima` - Base theme
- `jekyll-multiple-languages-plugin` - Multilingual support
- `jekyll-feed` - RSS feed generation

## Testing and Quality

### No Test Framework
This project does NOT have automated tests. Manual validation is required for all changes.

### Code Style Guidelines
- Follow existing code style in `CLAUDE.md`
- Use semantic HTML5 elements
- Classes follow kebab-case naming (e.g., `parallax-image`)
- SCSS follows BEM-like conventions
- Maximum 3 levels of Sass nesting

### Manual Testing Requirements
After making ANY changes:
1. Run complete build process
2. Test all three language versions
3. Verify development server functionality
4. Check that images and assets load correctly
5. Test navigation between pages

## CI/CD Pipeline
The repository uses GitHub Actions for deployment:
- `.github/workflows/jekyll-gh-pages.yml` - Builds and deploys to GitHub Pages
- Uses Ruby 3.2 and bundler caching
- Runs on push to main branch

## Common Commands Reference

```bash
# Essential setup sequence (run every time)
gem install bundler --user-install
export PATH=$PATH:/home/runner/.local/share/gem/ruby/3.2.0/bin  
bundle config set --local path vendor/bundle
bundle install  # ~25 seconds, NEVER CANCEL

# Development commands
bundle exec jekyll clean    # ~1 second
bundle exec jekyll build    # ~1 seconds  
bundle exec jekyll serve --host 0.0.0.0 --port 4000  # ~2 seconds to start

# Validation commands  
ls -la _site/ _site/bg/ _site/es/  # Check multilingual generation
curl -s http://localhost:4000/    # Test server response
```

## Troubleshooting

### "Command not found: bundle"
- Ensure bundler is installed: `gem install bundler --user-install`
- Ensure PATH includes: `/home/runner/.local/share/gem/ruby/3.2.0/bin`

### "Permission denied" during bundle install
- Use: `bundle config set --local path vendor/bundle`
- Then run: `bundle install`

### Jekyll serve not accessible
- Always use: `--host 0.0.0.0 --port 4000`
- Test with: `curl -s http://localhost:4000/`

### Missing language pages
- Check `_i18n/` directory has en.yml, bg.yml, es.yml
- Verify `_config.yml` has languages configured: `["en", "bg", "es"]`
- Run clean build: `jekyll clean && jekyll build`

REMEMBER: NEVER CANCEL long-running commands. Builds may take up to 30 seconds, which is normal for Jekyll projects with multilingual support.