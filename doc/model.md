# Mean: Share and Balance - Model Description

@author Marla Schulz (PhET Interactive Simulations)

This document is a high-level description of the model used in PhET's *Mean: Share and Balance* simulation.

## Overview

The goal of this simulation is to provide users an understanding of mean as it relates to a data set. More specifically,
how mean can be calculated and how individual data values impact the mean. The screens provide an experience of
embodied math, allowing users to feel what the mean/average is in various qualitative scenarios, such as water
levelling out among cups, evenly distributing candy bars across peers, or finding the balance point of a beam.

## Data Representations

All screens have a "notepad" representation and a "real world" representation. The total of the data set will always be
equal between both representations. The real world representation is visualized by a lab table in the Level Out Screen,
a party table in the Distribute and Fair Share Screens, and a soccer field in the Balance Point screen. The real world
representations are the ground truth, determining the data set that users can interact with in the notepad
representation.

The notepad representation allows users to interact with the data set in order to gain a stronger understanding of the
mean. In the "Level Out" screen users can add or remove cups and open or close pipes to level out the water. In the
"Distribute" screen users can move candy bars from one plate to another. In the "Fair Share" screen users can collect
and split apples into slices. In the "Balance Point" screen users can move the balance beam fulcrum to find the balance
point across the data set.

## Level Out

### Pipes

The pipes in the notepad representation are what allow users to share water across all the cups. The pipes can be opened
or closed so that students can "feel" the mean as the process of leveling out water.

The pipes only allow water movement across notepad cups. Water will not flow between table cups.

### Restrictions

Several restrictions were placed on how users can interact with the water levels in the cups due to concerns about the
physics of the simulation, data set integrity, and UX design.

- **Pipe State**
  - The pipes have two states: open and closed. They are synchronized to all be open or all be closed in order to reduce over-complication of water distribution.
  - When pipes are closed, the notepad cup set will sync to match their table representations.

- **Adding and Removing Cups**
  - When pipes are in their open state, a cup will add on with an open pipe, leveling out the water and providing automatic feedback on mean across the cups.
  - When a cup is removed, the table cup is the "ground truth". That is the amount of water removed from each set's water total.
  - When a cup is removed, notepad water levels reset to their corresponding table values. Pipe states remain the same, and water will level back out if the pipes remain open.

## Distribute

### Candy Bars

The candy bars in the notepad representation can be dragged from one plate to another, allowing users to evenly
distribute candy bars across the plates. Since the candy bars cannot be broken into pieces, this screen allows users to
interact with a remainder.

As candy bars are added or removed from the table representations the notepad representation will update accordingly. If
a notepad plate has reached max capacity the candy bar will be added to the plate with the least candy bars, while if a
notepad plate has no candy bars to remove the candy bar will be removed from the notepad plate with the most candy bars.

### Plates

All the plates have the same maximum and minimum capacity. As plates are added and removed from the table representation
the notepad representation will update accordingly so that the total number of candy bars is always equal between the
two representations.

## Fair Share

### Distribution Modes

The Fair Share screen has three distribution modes: 'Sync', 'Collect', and 'Share'. The mode is selected by the user and
determines the visual arrangement of the apples in the notepad. In some cases, apples will animate between the different
modes to demonstrate the distribution process. Apples will not animate when switching between 'Share' and 'Sync'.

**Sync:**
The notepad representation will match the table representation. This mode is used when the user wants to see the apples
in the same arrangement as the table.

**Collect:**
All the apples are gathered into a central area in the notepad. This mode allows users to see all the apples as a total
collection instead of on individual plates.

**Share:**
The apples are evenly distributed across the plates in the notepad. The Fair Share screen explores the mean as a mixed
fraction where we see Apples split into fractional pieces if needed. In share mode all the plates will have the exact
same number of apples.

## Balance Point

## Soccer Balls

Each soccer ball represents a data point along a number line, with the distance the ball was kicked being the value of
the data point. Soccer ball kick distance is measured in meters, and a soccer ball can only land or be dragged to an
integer position. As soccer balls are dragged across the field, their notepad representations will adjust accordingly.

Balls are removed in the reverse order they were added. 

## Balance Beam

A balance beam is used to demonstrate the mean as a balance point. The beam's fulcrum can be moved along a number line
to find the balance point across the data set. The beam will tilt as the fulcrum is adjusted, with it becoming
completely level when the data set is evenly distributed across the beam. This screen does not accurately represent the
physics of a balance beam, opting for an experience that provides more context for students aligned to the pedagogical
goals of the sim.

The balance beam fulcrum adjusts discretely along the number line, snapping to the nearest tenth. This allows users to
explore the mean as a decimal, with mean values always rounding to the nearest tenth.