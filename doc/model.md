# Mean: Share and Balance - Model Description

@author Amanda McGarry (PhET Interactive Simulations), Marla Schulz (PhET Interactive Simulations) 

This document is a high-level description of the model used in PhET's *Mean: Share and Balance* simulation.

## Overview

The goal of this simulation is to provide users an opportunity to explore and develop a conceptual understanding of arithmetic mean
within two standard paradigms: fair share and balance point. To illustrate fair share, the first three screens lean on context of water leveling out 
between cups, evenly distributing discrete candy bars across stacks, and collecting and dividing apples across plates. To illustrate balance point, 
the fourth screen has a beam, fulcrum, and stacks of soccer balls. These contexts provide an embodied math experience so users can "feel" the mean before 
being introduced to a standard algorithm. 

## Data Representations

All screens have a "notepad" representation in the top half and a "real world" representation in the bottom half of each screen. The total of the data set will always be
equal between both representations. The real world representation is visualized by a lab table in the Level Out Screen,
a party table in the Distribute and Fair Share Screens, and a soccer field in the Balance Point screen. The real world
representations are the ground truth, determining the data set that users can interact with in the notepad
representation.

The notepad representation allows users to interact with the data in order to gain a stronger understanding of the
mean. In the "Level Out" screen users can open or close pipes to level out the water. In the
"Distribute" screen users can move candy bars from one plate to another. In the "Fair Share" screen users can collect
and split apples into slices. In the "Balance Point" screen users can move the balance beam fulcrum to find the balance
point of the dot plot.

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
  - When a cup is removed from the lab table, that cup's water is removed from the set's water total, which is reflected in the notepad water cups.
  - When a cup is removed from the lab table, notepad cup water levels reset to their corresponding table values. Pipe states remain the same, and water will level back out if the pipes remain open.

## Distribute

### Candy Bars

The candy bars in the notepad representation can be dragged from one plate to another, allowing users to evenly
distribute candy bars across the plates. Since the candy bars cannot be broken into pieces, this screen allows users to 
approximate the mean as a whole number plus a remainder.

As candy bars are added or removed from the table representations the notepad representation will update accordingly. If
a notepad plate has reached max capacity the candy bar will be added to the plate with the least candy bars, while if a
notepad plate has no candy bars to remove the candy bar will be removed from the notepad plate with the most candy bars.

### Plates

All the plates have the same maximum and minimum capacity. As plates are added and removed from the table representation
the notepad representation will update accordingly so that the total number of candy bars is always equal between the
two representations. 

### Info Dialog
The info dialog displays the calculation of the mean as a whole number plus a remainder.

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
collection.

**Share:**
The apples are evenly shared across the plates in the notepad, first by equally distributing the whole apples, 
then evenly sharing frational pieces of apples. In share mode all the plates will have the exact
same number of apples.

### Info Dialog
The info dialog displays the calculation of the mean as a mixed number. 

## Balance Point

### Soccer Balls

Each soccer ball is kicked onto the field, and the distance the ball was kicked is represented by a data point on the dot plot on the notepad. 
Soccer ball kick distance is measured in meters, and a soccer ball can only land or be dragged to an
integer position. As soccer balls are dragged across the field, the notepad dot plot representation will adjust accordingly.

Balls are removed in the reverse order they were added. 

### Balance Beam

A balance beam is used to demonstrate the mean as a balance point. The beam's fulcrum can be moved along a number line
to find the balance point of the dot plot. The beam will tilt as the fulcrum is adjusted, with it becoming
completely level when the deviations are equal on both sides of the fulcrum. This screen does not accurately represent the
physics of a balance beam, opting for an experience that provides more context for students aligned to the pedagogical
goals of the sim.

The balance beam fulcrum is intended to feel continuous, but it is technically discrete as it snaps to the nearest tenth. This allows users to
"feel" the mean as the balancing point, while ensuring that the balance point is always possible to locate.

### Info Dialog
The info dialog displays the calculation of the mean as a decimal rounded to the nearest tenth. 
