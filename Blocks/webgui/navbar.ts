namespace NAV {

    export function init() {
        document.head.insertAdjacentHTML("afterend", `
<style>
.topnav {
  background-color: #333;
  overflow: hidden;
  font-size: 1.2em;
}

/* Style the links inside the navigation bar */
.topnav a {
  float: left;
  color: #f2f2f2;
  text-align: center;
  padding: 0.8em 1em;
  text-decoration: none;
}

/* Change the color of links on hover */
.topnav a:hover {
  background-color: #ddd;
  color: #777;
}

/* Add a color to the active/current link */
.topnav a.active {
  background-color: #555;
  color:  #fcbf75;
  font-weight: bold;
}</style>`);
        document.body.insertAdjacentHTML("beforebegin",
            `
<div class="topnav">
  <a class="active" href="index.html">ASCENSION</a>
  <a href="game.html">Game</a>
  <a href="designer.html">Map Editor</a>
    </div>`);
    }
}