# Simple Website Platform

```
# Check out the repo
git clone git@github.com:clocklimited/VanillaExpressProject

# Install the dependencies
cd VanillaExpressProject
npm install

# Install pliers globally (the build tool)
npm install -g pliers

# Begin!
pliers go
```

## Customisation

The project has a number of things that need changing/adding to make it a base
for the specific brand:

### Design

* Within the `public/images/meta` folder:
  * The `apple-touch-icon-precomposed-XxX.png` files need to be changed
  * The `favicon.ico` file need to be changed
* If custom fonts are being used:
  * Fonts need to be added to the `public/fonts` folder
  * `@font-face` for each font needs to be added to `public/css/fonts.styl`
  * The font faces need to be added to the `TYPOGRAPHY` section in `public/css/settings.styl`
* Error page image needs to be changed: `public/images/error/logo-error.png`

### Tech

* Where `SITENAME` is used, this needs to be changed to the appropriate project title (use search in your editor to find all the instances)
* Routes need to be set up for static pages
* Port needs to be updated to correct port for project
* Update the `properties.js` file in the root of the project for all environments:
  * Google Analytics IDs
  * Port number
  * URLs
  * Domains