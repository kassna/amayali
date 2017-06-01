# meteor-boilerplate
This is a boilerplate for start creating awesome app with **MeteorJS**. It includes basic packages that most of the time you need to develop your application, such as _routing_, _collections_, _SASS support_, _email support_ and much more. It also contains an extended file structure out-of-the-box.

Just clone this repo and start developing your next app right now.

## Table of contents
- [Download](#download)
- [File Structure](#file-structure)
- [Packages](#packages)
- [Credits](#credits)

## Download

Download this repo:

```
git clone http://github.com/alexhenkel/meteor-base project-name
```

After doing this, you can start coding in your new meteor app

```
cd project-name
meteor
```

## File Structure

This is the file structure that comes with **meteor-base**. It contains basic folders and files to help you with some functions. If you think you don't need one of the folders, you can delete it or rename it; always remembering how meteor load files:

1. HTML template files are always loaded before everything else
2. Files beginning with main. are loaded last
3. Files inside any lib/ directory are loaded next
4. Files with deeper paths are loaded next
5. Files are then loaded in alphabetical order of the entire path

```
├── project-name/
│   ├── .meteor
│   ├── client
│   │   ├── js
│   │   ├── sass
│   │   ├── templates
│   │   │   ├── home
│   │   │   │   ├── Home.html
│   │   │   │   ├── Home.js
│   │   │   ├── layout
│   │   │   │   ├── MainLayout.html
│   │   │   ├── partials
│   │   │   │   ├── Header.html
│   │   │   │   ├── Footer.html
│   ├── collections
│   ├── lib
│   │   ├── common.js
│   │   ├── routes.js
│   ├── private
│   │   ├── emailTemplates
│   ├── public
│   │   ├── fonts
│   │   ├── img
│   ├── server
│   │   ├── main.js
│   │   ├── methods.js
│   │   ├── publish
```

+ `.meteor`: Is the core folder of the framework.  
+ `client`: All the code inside this folder will be used by the client of the application.  
+ `client/js`: Here you can place any javascript of coffeescript file you need for your app. *Note: If you use jQuery plugins you need to initialize, is better if you do it from your `Template.name.onRendered` function in order to ensure the DOM is loaded.*
+ `client/sass`: It contains SASS boilerplate from [HugoGiraude](https://github.com/HugoGiraudel/sass-boilerplate) plus some useful mixins from [Ryan Burgess](https://github.com/ryanburgess/SASS-Useful-Mixins) and a file `_hidden.scss` created by me to simulate bootstrap visible and hidden classes, in case you don't want to use bootstrap in your project.
+ `client/templates`: Here you can place all your `.html` or `.js` files of your project. *Note: It's suggested that you create a folder for each feature of your application to organize better your templates.*
+ `client/templates/home`: It is an example of how your templates should be organized. First as a folder, and inside the `.html` and `.js` file.
+ `client/layout`: Here you can place your general layout templates, which can cointain header and footer and then `{{> Template.dynamic template=main}}` to load the content from the router.
+ `client/partials`: Common partial templates of your application, such as header, footer, side navbar, etc.
+ `collections`: Here you can store all of your files that contain your Mongo Collections and schemas.
+ `lib`: This folder loads right after templates, and runs on both client and server
+ `lib/common.js`: You can place your common methods here
+ `lib/routes.js`: Place your routes here. *Note: This boilerplate is optimized for FlowRouter but it can easily be changed to IronRouter or any other router.*
+ `private`: Place your private assets here.
+ `private/emailTemplates`: Place your email html templates here.
+ `public`: Place your public assets here. (Eg. Favicon)
+ `public/fonts`: Place your fonts files here.
+ `public/fonts`: Place your images files here.
+ `server`: All the code inside this folder will be used by the server of the application. 
+ `server/main`: Place your functions that you want to run everytime the server is started.
+ `server/methods`: Place your server methods that you call from the client with `Meteor.call()`.
+ `server/publish`: Publish your collections with `Meteor.publish()`.

## Packages

There are included some useful packages to start developing almost any app. If you won't use one of the packages or you just don't like, it you can go to `.meteor/packages` and delete the line of the package, or you can type in your console `meteor remove package_name`. For more info and documentation of each package, just look for the repo in GitHub.

Here are all the packages included:

### Router

+ **kadira:flow-router**: Flow router package.
+ **kadira:blaze-layout**: Add dynamic templating inside other templates.

### Front-end

+ **twbs:bootstrap**: Add bootstrap framework to the project
+ **seba:minifiers-autoprefixer**: Add SASS minifier.
+ **fourseven:scss**: Enable SASS support. Every SASS file in the client will be compiled out-of-the box.

### Collections

+ **aldeed:collection2**: Excellent package to support schemas in your MongoDB collections.
+ **aldeed:autoform**: Create automatic forms from collection2 schemas.
+ **matb33:collection-hooks**: Add hookers before and after inserting, updating or deleting in the database.

### Accounts

+ **accounts-base**: Meteor's user account system. 
+ **accounts-password**: Add password to user accounts
+ **accounts-ui**: Add login buttons with just `{{> loginButtons}}`
+ **alanning:roles**: Add roles support for users.

### Template

+ **aldeed:template-extension**: Boost templates. (Eg. Overwritting templates)
+ **raix:handlebar-helpers**: Access different variables without creating helpers (Eg. `{{> $.Session }}`)

### Images

+ **cfs:standard-packages**: Image uploading support.
+ **cfs:gridfs** 	

### Email

+ **email**: Allow sending email. Check documentation to configure email client.
+ **meteorhacks:ssr**: Allow server side rendering, which can be used to render html templates to send emails.

### General

+ **erasaur:meteor-lodash**: Useful javascript helpers. Check documentation
+ **meteortoys:allthings**: Collection inspector in the browser by pressing 'ctrl + m'.

### Additional packages

Here are some other useful packages you may want to consider, but are not included.

+ **less**: LESS support
+ **useraccounts:unstyled**: Custom login buttons
+ **zimme:active-route**: Check for active route in templates
+ **fontawesome:fontawesome**: Fontawesome icon library
+ **vazco:universe-selectize**: Autocomplete select input
+ **vazco:universe-autoform-select**: Autocomplete select optimized for autoform
+ **drewy:datetimepicker**: Datetimepicker (It's the only one not using bootstrap).
+ **drewy:autoform-datetimepicker**: Datetimepicker compatible with autoform
+ **kevohagan:sweetalert**: Add pretty alerts
+ **momentjs:moment**: Prettify dates
+ **gwendall:auth-client-callbacks**:	Add login callbacks on the client


## Credits

Alejandro Henkel [alehenkel17@gmail.com](mailto:alehenkel17@gmail.com)  
[@henkel0](https://twitter.com/henkel0)  
[LinkedIn Profile](https://mx.linkedin.com/in/alejandrohenkel/en)
