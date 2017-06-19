# translations-from-spreadsheet

> plugin to generate translations json files and other types from a google spreadsheet
> **IMPORTANT:** google spreadsheet must have no auth public permissions (e.g.  Anyone with the link can view)
> and it should be explicitly published using "File > Publish to the web" menu option in the google spreadsheets GUI.
> as far ar this plugin is based on [node-google-spreadsheet](https://github.com/theoephraim/node-google-spreadsheet)
> it can be extended to support spreadsheets with authentication

# Install

```
npm i translations-from-spreadsheet --save
```

# Basic Usage

const optionsMessage = {
  key: '###',
  sheet: 1,
  languages: ['en', 'fr'],
  keyColumn: 'key',
  type: 'message'
};

const optionsTemplate = {
  key: '###',
  sheet: 1,
  languages: ['en', 'fr'],
  keyColumn: 'key',
  type: 'template'
};
```

### Options
**NOTE:** all options are mandatory

#### key
Type: `String`

Google spreadsheet key.  
*Example: `https://docs.google.com/spreadsheets/d/1cKTLZCglRJkJR_7NGL6vPn1MHdadcLPUOMYjqVKFlB4/edit?usp=sharing`*

*`1cKTLZCglRJkJR_7NGL6vPn1MHdadcLPUOMYjqVKFlB4 is a key here`*

#### sheet
Type: `Number`

Worksheet id
**NOTE:** IDs start at 1
