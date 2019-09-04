# Thoughtful Slurp
![Thoughtful Slurp logo](https://i.imgur.com/x568fbD.png)

A personal pan front-end boilerplate/generator/working environment, based around Gulp 4, Sass, HTML5 Boilerplate, and minimal JS tooling. When you absolutely, positively, do not need anything as formally-scaffolded as a React/Webpack/Docker project.

"How quickly can I stop thinking about everything that isn't working on the front-end thing I had an idea for" is the specific question that this repository aims to answer.

---

## Requirements
1. Some flavor of Unix in a terminal, whether that's [MacOS Unix in iTerm2](https://medium.com/@grace.m.nolan/terminal-for-beginners-e492ba10902a), [Xenial Xerias over Windows 10's WSL subsystem in ConEmu](http://wsl-guide.org/en/latest/installation.html), or, like, [Debian](https://i.imgur.com/8b7BmRw.gif).
2. [nvm](https://github.com/nvm-sh/nvm)
3. This repository. That's it!

## First-time setup
1. Navigate to the empty folder that will house your project and clone this repo into it.
2. `nvm use`
3. `npm install`
4. You're done! Write your code in `src` and use the command-line tools to compile to `htdocs`.

## Using the command-line tools
- `gulp` - Clears and rebuilds `htdocs` directory; watches directory for changes
- `gulp build` - Clears and rebuilds `htdocs` directory.

## Developing within the codebase
- Run `gulp` from the command-line, in the root directory of your project folder.
- Open `/src` in your code editor of choice, pick your favorite file, and begin working.
- Gulp will watch the non-vendor contents of `/src`, and recompile and reload the page when a change is detected.
  - Vendor libraries and site media should be placed in `/src` as well.
- Code in `/src` is compiled into `/htdocs`; [BrowserSync](https://www.browsersync.io/) then serves that code to your browser.
  - The compilation process is destructive. Be safe! When not actively cutting a release, __*treat the contents of `/htdocs` as ephemeral data.*__
  - (This is why vendor libraries and site media lives in `src.` `;-)` )

## FAQ
**Q:** How did this repo come about?  
**A:** I tried to start working on an idea that I'd had, and within an hour I was once again infuriated by how many disparate half-solutions there are in TYOOL 2019 to the common problem of "spinning up a sane working environment." No I do not need Webpack, no I do not need a virtualization layer, _holy mother of PASV_ do I not want to deploy anything to Heroku as a required measure.

**Q:** Who's the mascot? It's cute!  
**A:** That is my friend [Gooey](https://kirby.fandom.com/wiki/Gooey), who has kindly agreed to pose _pro bono_ for this repository's logo for the time being. While the rest of the repository is covered under the GPL3, Gooey is most decidedly not. (At least not until something profoundly wild happens to the corpus of the Game Boy library, anyway.) If Gooey is yours, let me know and I will get off my keister and figure out a real logo.  
The font, thematically, is an early [Future Fonts](https://medium.com/future-fonts/introducing-futurefonts-xyz-8c0569777db6) release of [Very Cool Studio](https://www.verycoolstudio.com/)'s [Gooper](https://www.futurefonts.xyz/very-cool-studio/gooper).

**Q:** Do you plan to support hot reloading, JS modules, Coffeescript, et al?  
**A:** If it's not in my TODO, not unless you can convince me that my bare-minimum front-end development process is suffering without it. 

**Q:** What if I need a database layer?  
**A:** I'm not sure I plan to address this use case.

**Q:** \[clearly not listening\] What if I need an entire full-stack Node application that has a database _and_ a server _and_ a front-end?  
**A:** Weirdly enough, that question wraps all the way around "I don't plan to address that use case" to "this is now an entirely new use case that I also want a solution for". No promises or anything but it is something I am also working on.

**Q:** Despite your best efforts, this is still (too much/not enough/a waste of time/the wrong idea entirely).  
**A:** I am literally begging you to link me to something superior in this vein _which addresses my specific needs_ so that I can shut this repo down and start contributing to something mature and battle-tested. I have a personal rule of thumb about creating general-purpose repos like this, namely, _"my involvement is a sign that things have gotten dire."_

**Q:** The code seems alright, I just think the name is unneccesarily gross.  
**A:** This is NOT a question

## TODO
- Expose compile-time options (target folder name, for example)
- Think through needs of pages (HTML & JS)
- Should explore partials as a way to keep chaff out of HTML working files (intra-`<head>` content; JS CDN includes; etc.)
- Needs opinionated responsive grid system as part of SASS defaults
- Needs responsive typography defaults as part of same
- Research to justify approaches to above items

Please report any bugs, and thank you for your time.

---

#### _BONUS: GOOEY'S FAQ_
**Q:** What has it been like being the extremely-unofficial mascot of a software project?  
**A:** “Hello!!!!!!! I'M Gooey!!!!!!!!!!”

**Q:** How do you feel about your logo?  
**A:** “It tastes...... good!!!!!!!!!!!!!!”

**Q:** Is there anything else you'd like to say?  
**A:** “I'm Gooey!!!!! Hello!!!!!!!!!!!!!”
