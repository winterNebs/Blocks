﻿namespace NAV {

    export function init() {
        document.body.insertAdjacentHTML("beforebegin",
            `
<style>.topnav {
  background-color: #333;
  overflow: hidden;
}

/* Style the links inside the navigation bar */
.topnav a {
  float: left;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
}

/* Change the color of links on hover */
.topnav a:hover {
  background-color: #ddd;
  color: black;
}

/* Add a color to the active/current link */
.topnav a.active {
  background-color: #4CAF50;
  color: white;
}</style>
<div class="topnav">
  <a href="index.html">Home</a>
  <a href="game.html">Game</a>
  <a href="designer.html">Map Editor</a>
    </div>`);
    }
}