# Funhouse

A little house of fun: nine tiny browser games that load instantly. No build step, no dependencies, no tracking — plain HTML, CSS and JavaScript served by GitHub Pages.

**Play: https://mobiclawtest-cell.github.io/funhouse/**

## The games

| Game | What it is |
| --- | --- |
| Reaction Time | Click the moment the screen turns green |
| Snake | Classic snake on a 20×20 grid |
| Memory Grid | Watch a pattern, then repeat it |
| Whack-a-Mole | Bonk moles before they hide |
| Stack | Drop blocks and build a tower |
| Aim Trainer | Click targets before they vanish |
| Flappy | One-button pipe dodging |
| Typing Race | Words per minute, with accuracy |
| Bubble Wrap | Pop every bubble |

Controls are keyboard **and** touch/mouse throughout.

## Layout

```
index.html          hub page
style.css           shared styles (light + dark via prefers-color-scheme)
games/<slug>/index.html   thin page wrapper
 games/<slug>/game.js     the whole game
```

## Adding a game

1. Create `games/<slug>/index.html` — copy any existing one, change the title and markup.
2. Put the logic in `games/<slug>/game.js`.
3. Add a card to `index.html`.

No registration list to update — the hub links straight to the paths.

## Running locally

Any static server works, e.g. `python3 -m http.server` in the repo root, then open the printed URL. Opening `index.html` from the filesystem also works.
