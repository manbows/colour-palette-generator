# Colour Palette Generator

A browser-based colour palette generator built with vanilla HTML, CSS and JavaScript. Generate up to 20 random colours, lock your favourites, and copy hex or RGB values to your clipboard with a single click.

## Preview

![Colour Palette Generator](https://raw.githubusercontent.com/manbows/Colour-Palette-Generator/main/static/images/dashboard1.png)
![Colour Palette Generator](https://raw.githubusercontent.com/manbows/Colour-Palette-Generator/main/static/images/dashboard2.png)
![Colour Palette Generator](https://raw.githubusercontent.com/manbows/Colour-Palette-Generator/main/static/images/dashboard3.png)

## Features

- Generate between 1 and 20 random hex colours
- Lock individual colours to preserve them across regenerations
- Copy colours to clipboard in HEX or RGB format
- Double click two colours to generate a CSS gradient preview
- Save palettes to localStorage — they persist between sessions
- Click a saved palette to expand it and copy individual colour codes
- Press **G** to generate a new palette without touching the mouse
- Responsive layout with smooth hover animations

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript

## How to Use

1. Enter a number between 1 and 20
2. Click **Generate Colour** or press **G**
3. Click a colour card to copy its value to clipboard
4. Switch between HEX and RGB using the Copy Format dropdown
5. Click the 🔓 button on any colour to lock it in place
6. Double click two colours then click **Generate Gradient** to preview a CSS gradient
7. Click **Save Palette** to save the current palette
8. Click any saved palette to expand it and copy individual codes

## Project Structure
```
colour-palette-generator/
├── index.html
├── style.css
├── script.js
└── static/
    └── images/
        ├── dashboard1.png
        ├── dashboard2.png
        └── dashboard3.png
```

## Author

Emma Bowman — [github.com/manbows](https://github.com/manbows)