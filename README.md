# Privacy Monitor - Microsoft Edge Browser Extension

[![Privacy Monitor by Osano][logo]][privacymonitor]
--
[![MIT License][li]][ll]
[![Platform][pi]][pl]

[Privacy Monitor][privacymonitor] is a Microsoft Edge browser plugin client for ingesting the [Osano][osano] privacy rating API and displaying those scores to end users.

## Dependencies & Requirements

The build uses the npm packages listed in `package.json` and the `pwabuilder` command.

## Building

1. Clone this repository.
2. Edit to your heart's content.
3. To build the extension for publishing, run `npm install` and `npx gulp`. This extension requires `pwabuilder`. The npm preinstall script attempts to install `pwabuilder`. If you have build issues, install it manually with `npm i -g pwabuilder`.
4. Upload the edgeExtension.appx to the store

The build also requires `appxmanifest-skeleton.xml` in the repository root. This file is not included in the repository.

You must create your own identity.json file. It should reside in the `json` folder in the following format:
```
{
    "name": "Edge Store Package Name",
    "publisher": "CN=XXXXXX-YYYY-ZZZZ-AAAA-00000000000",
    "displayName": "Microsoft Partner Company Display Name"
}
```

[privacymonitor]: https://www.privacymonitor.com
[logo]: Contrib/logo.png
[osano]: https://www.osano.com
[li]: https://img.shields.io/badge/license-MIT-brightgreen.svg
[ll]: package.json#L10
[pi]: https://img.shields.io/badge/platform-Microsoft%20Edge-lightgrey.svg
[pl]: https://docs.microsoft.com/en-us/microsoft-edge/extensions