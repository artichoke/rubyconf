import $ from "jquery";

import Reveal from "reveal.js";
import "reveald3/reveald3";
import "reveal_external";

import "reveal.js/css/reset.css";
import "reveal.js/css/reveal.css";
import "reveal.js/css/print/paper.css";
import "reveal.js/css/theme/white.css";

import "reveal.js/plugin/markdown/markdown";
import "reveal.js/plugin/markdown/marked";
import "reveal.js/plugin/notes/notes";

import hljs from "highlight.js";
import "highlight.js/styles/monokai-sublime.css";

import "../artichoke.css";
import "../learnxinyminutes.txt";

document.addEventListener("DOMContentLoaded", () => {
  Reveal.addEventListener("ready", () => {
    // event.currentSlide, event.indexh, event.indexv
    $("div.artichoke-chrome").appendTo("div.reveal");
    $("div.artichoke-chrome").show();

    window.twttr = ((d, s, id) => {
      const fjs = d.getElementsByTagName(s)[0];
      const t = window.twttr || {};
      if (d.getElementById(id)) return t;
      const js = d.createElement(s);
      js.id = id;
      js.src = "https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);

      t._e = [];
      t.ready = f => t._e.push(f);

      return t;
    })(document, "script", "twitter-wjs");
  });
  Reveal.initialize({
    width: 960,
    // margin: 0.05, // Factor of the display size that should remain empty around the content
    controls: false, // Display controls in the bottom right corner
    progress: true, // Display a presentation progress bar
    slideNumber: false, // Display the page number of the current slide
    history: true, // Push each slide change to the browser history
    keyboard: true, // Enable keyboard shortcuts for navigation
    overview: true,
    transition: "slide", // Transition style: none/fade/slide/convex/concave/zoom
    transitionSpeed: "default" // Transition speed: default/fast/slow
  });

  // callback function needed for syntax highlithging to work
  hljs.initHighlightingOnLoad();
});
