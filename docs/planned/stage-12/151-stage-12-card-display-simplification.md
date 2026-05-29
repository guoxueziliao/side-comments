# Stage 12: Card Display Simplification

Status: Confirmed

## Purpose

This document defines the Stage 12 simplification for card density and expand/collapse behavior.

Current compact/standard and expand/collapse concepts are easy to confuse.

## Problem

There are two overlapping display concepts:

- card density: standard or compact;
- card content state: expanded or collapsed.

Users can reasonably ask what the difference is, because both affect how much content a card shows.

This creates extra cognitive load without adding enough value.

## Confirmed Direction

Stage 12 should reduce these overlapping modes.

The UI should have one clear display strategy instead of asking users to understand both density and expand/collapse as separate ideas.

The exact implementation can be chosen during development, but it should follow these rules:

- jumping and card actions must work in every visible state;
- the default view should be understandable without changing settings;
- cards should show enough information to identify the annotation;
- long content can still be shortened visually;
- users should not need both a density selector and expand/collapse controls for normal use.

## Candidate Implementation

Preferred direction:

- remove or hide the compact/standard density toggle;
- keep one default card layout;
- use progressive disclosure only where a card has long note or context content;
- avoid global expand/collapse as a primary workflow.

This keeps the sidebar simpler while preserving readability.

## Settings Impact

If the density concept is removed from the user-facing UI, remove or replace the default card density setting.

If a compatibility setting remains internally, do not expose it as a primary setting unless it still has clear user value.

## Out Of Scope

Stage 12 should not:

- redesign the whole sidebar;
- add more display modes;
- add keyboard-driven card navigation;
- make compact and expanded states behave differently for jump or edit actions.
