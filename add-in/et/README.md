# Office Add-in Excel Tooling with React & Vite

This work is based on a template by [github.com/ExtraBB](https://github.com/ExtraBB/Office-Addin-React-Vite-Template). The template was generated using the [generator-office](https://www.npmjs.com/package/generator-office) generator which is based on the [Office-Addin-Taskpane-React](https://github.com/OfficeDev/Office-Addin-TaskPane-React) project.
These are the key differences between this template and the default generated template:

- Use Vite instead of Webpack.
- Use React 18.
- Remove polyfills and support for IE 11.
- Enabled typescript strict mode



This is a template for developing an [Office.JS](https://learn.microsoft.com/en-us/office/dev/add-ins/) Excel add-in with **Vite** and **React 18**. 


## Development

Follow the instructions on [https://www.npmjs.com/package/generator-office](https://www.npmjs.com/package/generator-office) to setup your development environment.  Follow the tutorials on [https://learn.microsoft.com/en-us/office/dev/add-ins/](https://learn.microsoft.com/en-us/office/dev/add-ins/) to learn how to develop Office add-ins.


To start the development server for the add-in, run:

```bash
npm run dev
```

To load the add-in in your Excel, use any of the `start` scripts. e.g:

```bash
npm run start
```

To create a production build, run:

```bash
npm run build
```

To unload the add in from Excel, run:

```bash
npm run stop
```

## Debugging

To enable debugging in Excel stop your Excel project. Close Excel. Then run

```bash
defaults write com.microsoft.Excel OfficeWebAddinDeveloperExtras -bool true
```

Now you can right click on the add-in and select "inspect source"

Taken from: https://learn.microsoft.com/en-us/office/dev/add-ins/testing/debug-office-add-ins-on-ipad-and-mac
