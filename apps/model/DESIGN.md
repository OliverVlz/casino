---
name: MODEL
description: An original product-studio world for a fictional casino comparison.
colors:
  ground: "#101112"
  surface: "#18191b"
  raised: "#202124"
  ink: "#f1eee8"
  muted: "#adaeaf"
  gold: "#d3b88c"
  gold-hover: "#e5cda7"
  rule: "#303134"
  violet: "#a794d1"
typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(3.2rem, 5.35vw, 5.3rem)"
    fontWeight: 500
    lineHeight: 1.065
    letterSpacing: "-.04em"
  headline:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(2rem, 3.1vw, 2.9rem)"
    fontWeight: 500
    lineHeight: 1.16
    letterSpacing: "-.035em"
  title:
    fontFamily: "Inter, sans-serif"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-.025em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "15px"
    lineHeight: 1.65
rounded:
  tag: "3px"
  button: "5px"
  panel: "10px"
spacing:
  compact: "20px"
  regular: "25px"
  generous: "35px"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "#171614"
    rounded: "{rounded.button}"
    padding: "12px 22px"
  button-primary-hover:
    backgroundColor: "{colors.gold-hover}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.gold}"
    rounded: "{rounded.button}"
    padding: "12px 22px"
  payment-tag:
    backgroundColor: "#222324"
    textColor: "#c0b9ad"
    rounded: "{rounded.tag}"
    padding: "3px 8px"
  offer-panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
    padding: "35px"
---

# Design System: MODEL

## Overview

**Creative North Star: "The MODEL product studio"**

An original product-studio object introduces a precise editorial comparison. Obsidian surfaces, champagne actions and ceramic typography keep the interface calm; violet belongs to the object material and restrained identity accents.

This system applies only to MODEL, the English Canadian demonstration. Visible fictional-content disclosures and clear comparison terms carry the product voice; the artwork supports discovery without delaying access to the directory.

**Key Characteristics:**
- Material depth in original objects; flat comparison surfaces.
- Large, medium-weight Inter headings and compact supporting text.
- Fine dividers, generous section spacing and explicit demo context.

## Colors

Champagne is the primary action colour against obsidian neutrals. Ceramic ink carries headings and important content; muted grey carries explanation. Fine grey rules organise comparison rows. Raised charcoal supports native select options. Violet is a material accent, not a second primary action colour. The `violet` CSS token records the direction; the rendered object uses its own Blender material.

## Typography

Inter is locally bundled at regular, medium, semibold and bold weights, with a sans-serif fallback. Medium-weight, tightly tracked headings set the hierarchy; paragraph widths stop at 70 characters. Supporting editorial text generally uses 12–14px, with compact metadata smaller. Do not inherit small metadata sizing for substantive new copy.

The mobile hero uses `clamp(45px, 11vw, 65px)`; common section headings settle near 31–32px. Detail-page headings and dense tables adapt separately to their content.

## Layout

The centred shell has a maximum width of 1328px including 56px side padding. Padding becomes 32px at 1100px and 22px at 767px. Section spacing steps from 100px to 80px to 62px at those breakpoints.

Desktop pairs copy with the hero object and places the directory immediately afterward. Mobile stacks copy before the object. Four-column comparison rows become stacked records with payment tags and an action sharing the final line. Filters become a single column. Editorial grids, methodology, FAQ and profile layouts collapse to one column. The bonus table retains its 680px minimum width inside a horizontal scrolling wrapper.

**The Direct Comparison Rule.** Keep the directory in normal document flow immediately after the introductory hero.

## Elevation & Depth

Depth comes from original obsidian, champagne, ceramic and violet 3D objects, soft object shadows and a restrained hero glow. Interface panels use tonal separation and fine borders rather than box shadows. The poster fades into one R3F canvas; desktop scroll drives a short unpinned movement across the hero. Reduced motion keeps the static poster and disables transitions. Loading failure and context loss also preserve the poster.

**The Material Depth Rule.** Reserve pronounced depth for the objects; keep comparison surfaces flat.

## Shapes

Buttons have lightly rounded corners; small rectangular payment tags stay compact. Filters use an 8px radius, journal images 6px, and profile offer panels and monograms 10px. Fine single-pixel dividers organise rows and editorial sections. Circles belong to the original token, orbit and age marker.

## Components

- **Buttons:** Champagne primary actions and transparent champagne-outline secondary actions. Standard minimum height is 48px; compact catalogue actions use 44px. Hover brightens the fill or warms the outline background; disabled buttons reduce opacity. Interactive keyboard focus uses a 2px champagne outline offset by 5px.
- **Fields:** Visible labels above native selects, transparent fill and a fine bottom border. The filter group supplies its charcoal background. Reset is a quiet text action; results use a live status announcement. No text-input or error-state visual system is implemented.
- **Tags:** Payment labels are informational, with subdued text on charcoal and no selected state.
- **Containers:** Offers use a tonal panel with 35px padding, reduced to 25px on mobile. Listings remain divided rows. Journal cards pair object imagery with plain text and a full-width underlined link.
- **Navigation:** A relative-positioned header, understated links and champagne current/hover states. At 767px, a Menu/Close button exposes a vertical navigation panel; the header is not sticky.
- **Disclosure:** The demo banner stays above navigation. Offer explanations and native FAQ details reveal supporting copy without changing the visual hierarchy.

## Do's and Don'ts

- Do keep the demo disclosure and offer conditions visible.
- Do place the hero object beside desktop copy and below mobile copy.
- Do retain keyboard focus, native controls and the static hero fallback.
- Don't replace original objects with operator or cryptocurrency logos.
- Don't pin the hero or intercept scrolling.
- Don't turn comparison rows into floating, heavily shadowed cards.
