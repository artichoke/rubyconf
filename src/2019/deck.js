import $ from "jquery";

import Reveal from "reveal.js";

import "reveal.js/dist/reset.css";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/white.css";

import RevealMarkdown from "reveal.js/plugin/markdown/markdown";
import RevealHighlight from "reveal.js/plugin/highlight/highlight";
import "reveal.js/plugin/highlight/monokai.css";

import "../artichoke.css";

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
      t.ready = (f) => t._e.push(f);

      return t;
    })(document, "script", "twitter-wjs");
  });
  Reveal.initialize({
    width: 960,
    controls: false,
    progress: true,
    slideNumber: false,
    history: true,
    keyboard: true,
    overview: true,
    transition: "slide",
    transitionSpeed: "default",
    plugins: [RevealMarkdown, RevealHighlight],
  });
});
