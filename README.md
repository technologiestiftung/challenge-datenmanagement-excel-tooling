![](https://img.shields.io/badge/Built%20with%20%E2%9D%A4%EF%B8%8F-at%20Technologiestiftung%20Berlin-blue)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

# Data Management Excel Tooling

This repository contains proof of concept code for explorations of how to use Excel as a data management tool. The premise is that we try to use Excel as the interface to data base. Since Excel is a already well known tool in the administration.

See also the subfolder [/add-in/et/](/add-in/et/) for a proof of concept for an Excel add-in that can be used to manage data in a database. This is actually the more promising way to handle this. It allows to have a more fine grained method of user authorization and allows to use modern web development tools to build the interface. The example add-in you can find there is the same as the scripts under /office-scripts/ but with a more modern interface.

## Prerequisites

- Office 365 License
- optional Sharepoint
- Supabase Account
- Node.js


## Usage

- Create a project on supabase and get your project id, supbase api  url and service role key
- Use the supabase CLI to deploy the local migrations to supabase.com

```bash
supabase login
supabase link --project-ref <YOUR SB ID>
supabase db push
```

- Populate the database with some data
- Add your service role key and supabase url to the top of the scripts in `/office-scripts/populate-worksheet.ts` and `/office-scripts/send-worksheet.ts`.
- Open a blank Excel workbook and add the scripts to the workbook automate ribbon as new scripts

Execute the populate-worksheet.ts script to populate the worksheet with data from the database. Execute the send-worksheet.ts script to send the worksheet to the database.



## Development

- Here are some resources for learning about office scripts.
- https://learn.microsoft.com/en-us/office/dev/scripts/overview/excel

You will have to edit and develop the scripts within Excel. There seems to be no way to use an external editor.


## Contributing

Before you create a pull request, write an issue so we can discuss your changes.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!


## Credits

<table>
  <tr>
    <td>
      Made by <a href="https://citylab-berlin.org/de/start/">
        <br />
        <br />
        <img width="200" src="https://logos.citylab-berlin.org/logo-citylab-berlin.svg" />
      </a>
    </td>
    <td>
      A project by <a href="https://www.technologiestiftung-berlin.de/">
        <br />
        <br />
        <img width="150" src="https://logos.citylab-berlin.org/logo-technologiestiftung-berlin-de.svg" />
      </a>
    </td>
    <td>
      Supported by <a href="https://www.berlin.de/rbmskzl/">
        <br />
        <br />
        <img width="80" src="https://logos.citylab-berlin.org/logo-berlin-senatskanzelei-de.svg" />
      </a>
    </td>
  </tr>
</table>

