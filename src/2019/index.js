import Reveal from "reveal.js";

import "reveal.js/dist/reset.css";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/white.css";

// install snippets styles
import "highlight.js/styles/monokai.css";

import "./deck.scss";

Reveal.addEventListener("ready", () => {
  const revealContainer = document.getElementById("js-reveal-container");
  const artichokeChrome = document.getElementById("js-artichoke-chrome");
  revealContainer.appendChild(artichokeChrome);
  artichokeChrome.classList.add("is-visible");

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
  plugins: [],
});
