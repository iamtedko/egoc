# Bitcoin Microsite
#### IDEO Futures + IDEO Palo Alto

### Setup
Requires Node, NPM, Yo, Bower
```
npm install
bower install
node app
```

Served locally at http://localhost:3000/index.html

### CSS Compilation
```
sass main.scss:main.css
```
To update CSS, stop server, manually compile SASS, and restart server. 

### Heroku Deploy
```
git add .
git commit -m ""
git push heroku master
```
Point ```hellobtc``` to your git repository.

Deploys live to http://hellobtc.herokuapp.com/

### File organization
`/app`
Source files

`/scripts` includes js scripts

`/styles` SASS+CSS files

`/svgs` resources for story page,
`/imgs` resources for about page,
`/nodes` node images

All third party scripts are installed via bower where possible.

###Trello
https://trello.com/b/td6OiY2K/building-how-bitcoin-works

###Design Resources
https://www.dropbox.com/sh/2i32s1odzlsla43/AABvWfNZ2OoQtLcj7C-lxPmha?dl=0

### HTML/CSS Architecture
`main.scss` site-wide styles, 
`chapters.scss` scene-specific,
`fonts.scss` font styling

`index.html` main site page with scenes,
`medium.html` separate link for medium overview, 
`about.html` about Futures page + course

_Standard Definition of Scene 1_

```
<section id="#id" class="scene scene1">
    <div class="sectioncontainer">
            <div class="header">
              <h3>headline</h3>
            </div>
            <div class="body">subtext</div>
            <div class="visual">visible content</div>
    </div>
</section>
```

### JS Architecture
_Libraries: jQuery, Velocity, ScrollMagic, GSAP TweenMax_

`main.js` initiates site-wide logic, `scenes.js` runs story logic

```
// Scene Template: virtual class for scenes of the story
function Scene(index,title,theme,segue,init);
// Define scenes, setup ScrollMagic listeners
function generateScenes();
// Initiate tween listeners (animations that respond to scroll)
function generateTweens();
// Initiate click listeners and timers
function generateSceneListeners();
// Breadcrumbs object+operations
var breadcrumbs = {}
// Scene animations
var animations = {}
// Scene Interactions
var interactions = {}
// Background Helpers, e.g. for fading
var bg = {}
// SVG helpers
var svg = {}
```




MIT License?