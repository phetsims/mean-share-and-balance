# Mean: Share and Balance - Model Description

@author Marla Schulz (PhET Interactive Simulations)

This document is a high-level description of the model used in PhET's Mean: Share and Balance simulation.

This description currently pertains to the Intro Screen.

## Overview
The goal of this simulation is to provide users an understanding of mean as it relates to a data set. More specifically, how mean can be calculated, and how individual data values impact the mean. The Intro screen provides an experience of embodied math, allowing users to feel what the mean/average is in a qualitative sense, as water levels out among cups.

## Water Cup Data Set

The data set is represented by water levels in cups. There are two sets of cups: 3D cups, and 2D cups. The total amount of water on the screen is always equal between both sets of cups. 

In this sim, the 3D cups are treated as the "ground truth". Any calculations on mean, as well as reset or sync, are based off of the water levels in the 3D cups. 2D cups provide users with feedback on how the mean can change as changes to the 3D cups happen, as well as an opportunity to level out the water between cups. 

## Pipes

The pipes in the 2D cup representation are what allow users to share water across different cups. The pipes can be opened or closed so that students can "feel" the mean as the process of leveling out water.  

The pipes only allow water movement across 2D cups. Water will not flow between 3D cups.

### Restrictions

Several restrictions were placed on how users can interact with the water levels in the cups due to concerns about the physics of the simulation, data set integrity, and UX design. 
 
  - **Pipe State**
    - The pipes have two states: open and closed. They are synchronized to all be open or all be closed in order to reduce over complication of water distribution.
    - When pipes are closed, the 2D cup set will sync to match their 3D representations.

  - **Adding and Removing Cups**
    - The first cup's water level is 3/4 full. By default, the rest of the cups are added at 1/2 capacity.
    - When pipes are in their open state, a cup will add on with an open pipe, leveling out the water and providing automatic feedback on mean across the cups.
    - When a cup is removed, the 3D cup is the "ground truth". That is the amount of water removed from each set's water total.
    - When a cup is removed, 2D water levels reset to their corresponding 3D values. Pipe states remain the same, and water will level back out if the pipes remain open.
