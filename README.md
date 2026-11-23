# Frontend Mentor - Tic Tac Toe solution

This is a solution to the [Tic Tac Toe challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/tic-tac-toe-game-Re7ZF_E2v). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the game depending on their device's screen size
- See hover states for all interactive elements on the page
- Play the game either solo vs the computer or multiplayer against another person
- **Bonus 1**: Save the game state in the browser so that it’s preserved if the player refreshes their browser
- **Bonus 2**: Instead of having the computer randomly make their moves, try making it clever so it’s proactive in blocking your moves and trying to win

### Screenshot

![](./screenshot.jpg)

### Links

- Solution URL: [Github](https://github.com/artemkotko14/body-mass-index-calculator)
- Live Site URL: [Website](https://artemkotko14.github.io/body-mass-index-calculator/)

## My process

### Built with

- Semantic HTML5 markup
- SCSS (Sass)
- Flexbox
- CSS Grid
- Mobile-first workflow
- Responsive design
- Vanilla JavaScript (ES6+)
- DOM manipulation and event handling
- localStorage for game state persistence

### What I learned

`viewBox` controls what part of the drawing is visible; CSS width and height control how large the SVG appears on the page.

```html
<svg class="menu__mark-image" viewBox="0 0 64 64"></svg>
```

0 0 64 64 means: show a 64 × 64 area starting from the top-left corner (0, 0). The four numbers mean:

```
viewBox="x y width height"
```

The inset keyword changes a CSS box-shadow from an outer drop shadow to an inner shadow.

```css
box-shadow: inset 0px -8px 0px 0px #cc8b13;
```

`aspect-ratio: 1 / 1` means the element's width and height have the same proportion.In other words, it keeps the element a perfect square.

```css
aspect-ratio: 1 / 1;
```

classList.toggle() with a second argument adds or removes a class based on a condition.

```js
gameBoard.classList.toggle("game__board--x-turn", currentTurn === "x");
```

If currentTurn === "x" is true, the class is added (or kept).
If it's false, the class is removed (or stays absent).

## Author

- Github - [Artem Kotko](https://github.com/artemkotko14)
- Frontend Mentor - [@artemkotko14](https://www.frontendmentor.io/profile/artemkotko14)
