﻿# Privacy Monitor - Microsoft Edge Browser Extension

[![Privacy Monitor by Osano][logo]][privacymonitor]
--
[![MIT License][li]][ll]
[![Platform][pi]][pl]

[Privacy Monitor][privacymonitor] is a Microsoft Edge browser plugin client for ingesting the [Osano][osano] privacy rating API and displaying those scores to end users.

## Dependencies & Requirements

Privacy Monitor has no external dependencies.

## Building

1. Clone this repository.
2. Edit to your heart's content.
3. To build the extension for publishing `npm install` & `gulp` - this extension requires `pwabuilder`. The NPM preinstall will attempt to install pwabuilder, however if you run into build issues you may need to manually install using `npm i -g pwabuilder`
4. Upload the edgeExtension.appx to the store

You must create your own identity.json file. It should reside in the `json` folder in the following format:
```
{
    "name": "Edge Store Package Name",
    "publisher": "CN=XXXXXX-YYYY-ZZZZ-AAAA-00000000000",
    "displayName": "Microsoft Partner Company Display Name"
}
```

## Export Control

This distribution includes cryptographic software. The country in which you
currently reside may have restrictions on the import, possession, use, and/or
re-export to another country, of encryption software. BEFORE using any
encryption software, please check your country's laws, regulations and
policies concerning the import, possession, or use, and re-export of encryption
software, to see if this is permitted. See <http://www.wassenaar.org/> for more
information.

The U.S. Government Department of Commerce, Bureau of Industry and Security
(BIS), has classified this software as Export Commodity Control Number (ECCN)
5D002.C.1, which includes information security software using or performing
cryptographic functions with asymmetric algorithms. The form and manner of this
Apache Software Foundation distribution makes it eligible for export under the
License Exception ENC Technology Software Unrestricted (TSU) exception (see the
BIS Export Administration Regulations, Section 740.13) for both object code and
source code.

[privacymonitor]: https://www.privacymonitor.com
[logo]: Contrib/logo.png
[osano]: https://www.osano.com
[li]: https://img.shields.io/badge/license-MIT-brightgreen.svg
[ll]: LICENSE
[pi]: https://img.shields.io/badge/platform-Microsoft%20Edge-lightgrey.svg
[pl]: https://docs.microsoft.com/en-us/microsoft-edge/extensions