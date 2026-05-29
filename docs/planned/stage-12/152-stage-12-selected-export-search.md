# Stage 12: Selected Export Search

Status: Confirmed

## Purpose

This document defines the Stage 12 improvement for selected-document export.

The selected export modal must support large vaults.

## Problem

The current selected export flow lists all Markdown files with checkboxes.

This does not scale when the vault has thousands or tens of thousands of notes.

Users need a search bar before selecting documents.

## Confirmed Behavior

Add search to `Export selected note annotations`.

The search should:

- filter the displayed Markdown file list by path or file name;
- preserve already selected files even when they are hidden by the current search;
- show selected count;
- allow exporting selected files after search filtering;
- not scan Markdown file body content;
- remain responsive in large vaults.

## Selection Rules

Search filtering should affect visibility, not selection state.

If a user selects a file, then changes the search query, the selected file should remain selected.

The export action should export all selected files, not only currently visible search results.

## Empty States

The modal should show clear empty states for:

- no Markdown files;
- no search matches;
- no files selected when export is pressed.

## Settings Impact

The settings page should make the selected export flow understandable.

The `Export selected note annotations` row can stay in settings, but the modal needs search because settings is the entry point for this flow.

## Out Of Scope

Stage 12 should not:

- add full-vault Markdown body search;
- add saved export sets;
- add tag-based document selection;
- add folder-tree selection unless separately confirmed;
- change the export file formats.
