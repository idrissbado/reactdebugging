# Debugging the React App: Pilfering Pillbug

This document explains the steps taken to debug and fix issues in the React app for the Pilfering Pillbug component. Below is a detailed explanation of the changes made and the reasoning behind them.
![Uploading image.png…]()


## Table of Contents
- [Issues Identified](#issues-identified)
- [Changes Made](#changes-made)
- [How to Test](#how-to-test)
- [Key Learnings](#key-learnings) 


## Issues Identified

### Unused useEffect Import:
The `useEffect` hook was imported but never used in the code, leading to a linting warning.

### Incorrect Prop in PurchaseSummary:
The `PurchaseSummary` component expected a prop named `purchaseLikability`, but the parent component (`PilferingPillbug`) was passing `liked`. This caused the purchase summary text to display incorrectly.

### Inconsistent Prop Naming:
The `PurchaseSummary` component used `purchaseLevel`, but the parent component passed `level`. This inconsistency caused issues in rendering the correct purchase level.

### Missing bug Definition:
The `bug` object was used in the `Template` component but was not defined in the provided code.

## Changes Made

### 1. Removed Unused useEffect Import
- **Reason**: The `useEffect` hook was imported but not used, causing a linting warning.
- **Change**: Removed the unused import.

```javascript
// Before
import { useEffect, useState } from "react";

// After
import { useState } from "react";
### 2. Fixed Prop Naming in PurchaseSummary
- **Reason**: The `PurchaseSummary` component expected `purchaseLikability`, but the parent component passed `liked`.
- **Change**: Updated the `PurchaseSummary` component to use the `liked` prop instead of `purchaseLikability`.

```javascript
// Before
function PurchaseSummary({ purchaseLevel, purchaseLikability }) {
  return (
    <Text data-test="summary" color="text-weak">
      You are purchasing a level {purchaseLevel} {bug.name} that you{" "}
      {purchaseLikability ?? "haven't decided if you like or not"}
    </Text>
  );
}

// After
function PurchaseSummary({ level, liked }) {
  return (
    <Text data-test="summary" color="text-weak">
      You are purchasing a level {level} {bug.name} that you{" "}
      {liked === "like" ? "like" : liked === "dislike" ? "dislike" : "haven't decided if you like or not"}
    </Text>
  );
}

### 3. Ensured Consistent Prop Naming
- **Reason**: The `PurchaseSummary` component used `purchaseLevel`, but the parent component passed `level`.
- **Change**: Updated the `PurchaseSummary` component to use the `level` prop.

```javascript
// Before
function PurchaseSummary({ purchaseLevel, liked }) {
  return (
    <Text data-test="summary" color="text-weak">
      You are purchasing a level {purchaseLevel} {bug.name} that you{" "}
      {liked === "like" ? "like" : liked === "dislike" ? "dislike" : "haven't decided if you like or not"}
    </Text>
  );
}

// After
function PurchaseSummary({ level, liked }) {
  return (
    <Text data-test="summary" color="text-weak">
      You are purchasing a level {level} {bug.name} that you{" "}
      {liked === "like" ? "like" : liked === "dislike" ? "dislike" : "haven't decided if you like or not"}
    </Text>
  );
}
### 4. Added Missing Bug Definition
- **Reason**: The `bug` object was used in the `Template` component but was not defined.
- **Change**: Ensured the `bug` object was defined with the required properties.

```javascript
// Added the missing bug definition
export const bug = {
  title: "Passing Props",
  subtitle:
    "this pilfering pillbug can cause confusion and chaos when trying to modify props or state",
  name: "Pilfering Pillbug",
  price: "$7.99",
  route: "/bug/pilfering-pillbug",
  component: Bug,
};

