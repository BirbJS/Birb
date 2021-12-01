# Contributing to Birb.JS
We're open to outside contributors! But, to keep things from decending into chaos, we have some rules we need to go over.

## Building
Birb.JS is written in TypeScript. This means, beforing testing, you must build Birb.JS locally. To do this, follow these steps:
1. Head to the root directory of Birb.JS (NOT in `/src`).
2. Run `npm install --include=dev` to install all dependencies, including the dev dependencies.
3. CHECK for vulnerabilities in the dependencies using `npm audit`.
4. Run `npm run build` to build the Birb.JS library.

You can now find the built version Birb.JS in `/dist`. This is what would be distributed on the NPM registry.

## Coding style
Everyone has their own coding style. However, this can become an issue when opening source code to contributions. As a general rule of thumb, you should try match the repository's coding style as much as possible. We ask that you take a few minutes to read over some of the files to get a sense of this.

## Dependencies
As a general rule of thumb, you should ensure any dependencies you add are licensed openly. *Personally*, I don't see the GPL and AGPL licenses as open-source promoting licenses, so dependencies that use these should be avoided. This is one of the main reasons I stayed well away from licensing this project under any GNU license, and instead opted for Mozilla's very permissive license that ensures developers can use Birb.JS without bottlenecks.

## Discussions
If you see something in a pull request that makes you go, "wait, what?", challenge it! We want to keep Birb.JS as community focused as possible. If you disagree with the way something's been done, **respectfully** talk about it in that pull request, preferably using comments on the line of code that's the issue.

## Trusted contributors
Once you've contributed enough, you may be added as a trusted contributor. This allows you to make decisions on whether or not to allow a pull request to be merged on to the main branch, along with 2 other users (or a repository admin). **Changes made to `/src` must be approved by a member of [@BirbJS/team](https://github.com/orgs/BirbJS/teams/team).** Some files are additionally protected, such as LICENSE, that must require approval from [@knokbak](https://github.com/knokbak) to update.

## Keeping Birb.JS open
Every source code file must including this at the top for licensing reasons:
```js
/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
```
If, when you're modifying a file, realise that the year in the copyright notice is incorrect, please update it. *Do not create pull requests just to update copyright notice years. It doesn't help.*
