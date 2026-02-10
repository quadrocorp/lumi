# 2. simple structured MVP

Date: 2026-02-06

## Status

Accepted

## Context

We have the lumiKit in progress of building, but it slows down the development.

## Decision

Comment the complicated components and focus on functionality and foundation of the Lumi's UI and stuff, opt for simpler style if needed.

**backup** `style.css` file in `src` directory to save the already styled glass components, instead using simpler style to further define the visual hierarchy of the dashboard and other features.

## Consequences
Positive:
- Faster development with less focus on visual style and UI complexity
- Focus on building the enhanced functionality first, adapting for lumiKit later
- Separation of Lumi's UI and lumiKit for the foundation development stage.

Negative:
- Will require the adaption of components and possible rebuilding of components to fit lumiKit or vice versa (adapting lumiKit to serve lumi's UI)