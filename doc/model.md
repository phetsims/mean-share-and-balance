# Mean: Share and Balance - Model Description

@author Marla Schulz (PhET Interactive Simulations)

This document is a high-level description of the model used in PhET's Mean: Share and Balance simulation.

This description currently pertains to the Intro Screen.

## Overview
The goal of this simulation is to provide users an understanding of mean as it relates to a data set. More specifically, how mean can be calculated, and how changing the data set affects the mean. The Intro screen provides an experience of embodied math, allowing users to feel what the mean/average is in a qualitative sense as water levels out among cups.

## Water Cup Data Set

The data set is represented by water levels in cups. There are two sets of cups: 3D cups, and 2D cups. Although the total amount of water on the screen is always equal between both sets of cups, a 2D cup may have more or less water than it's respective 3D cup. 

In this sim, the 3D cups are treated as the "ground truth". Any calculations on mean, as well as reset or sync, are based off of the water levels in the 3D cups. 2D cups provide users with feedback on how the different water levels in the 3D set can be leveled out evenly. 

## Pipes

The pipes in the 2D cup representation are what allow users to share water across different cups. The pipes can be opened or closed so that students can "feel" how the mean changes as the data set changes. 

The pipes only allow water movement across 2D cups. Water will not flow between 3D cups.

### Restrictions

Several restrictions were placed on how users can interact with the water levels in the cups due to concerns about the physics of the simulation, data set integrity, and UX design. 
 
  - **Water Level Sliders**
    - The water level slider on the 3D cups is restricted to only adding and removing water that its 2D representation will allow.
    - Ex 1. Water has been shared across multiple cups, and now the 2D cup has less water than its 3D counterpart. The slider is restricted so that no more water than what the 2D cup contains can be removed from the 3D representation.
    - Ex 2. Water has been shared across multiple cups, and now the 2D cup has more water than its 3D counterpart. The slider is restricted so that when a 2D cup has reached capacity, the corresponding 3D cup can no longer add water.
    
  - **Sync Data**
    - A "Sync" button was added to provide users a way to reset the 2D cups so that they match their 3D representations.
    - The pipes must all close to prevent water from flowing out. This ensures that users can easily go back to matching 2D and 3D representations.

  - **Adding and Removing Cups**
    - By default cups are added at 1/2 capacity.
    - When "Auto Share" is enabled, a cup will add on with an open pipe, leveling out the water and providing automatic feedback on mean across the cups.
    - When a cup is removed, the 3D cup is the "ground truth". That is the amount of water removed from each set's water total.
    - When a cup is removed, 2D water levels reset to their corresponding 3D values. Pipe states remain the same, and water will level back out if a pipe remains open.
