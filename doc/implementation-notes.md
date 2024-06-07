# Mean: Share and Balance - Implementation Notes

@author Marla Schulz (PhET Interactive Simulations)

## Introduction

This document contains notes related to the implementation of the "Mean: Share and Balance" simulation. This is not an
exhaustive description of the implementation. The intention is to provide a concise high-level overview, and to
supplement the internal documentation (source code comments) and external documentation (design documents).

Before reading this document, please read:

- [model.md](https://github.com/phetsims/mean-share-and-balance/blob/main/doc/model.md), a high-level description of the
  simulation model.

## General Considerations

### Terminology

In all screens, there is a notepad shown towards the top of the screen that contains "sketches" of things shown towards
the bottom of the screen. The term "sketch" is used in the comments and in class/variable names to indicate items that
appear in this notepad.  The term "table" is often used in comments and class names for things that appear on or relate
to the table at the bottom of the screen, and the term "notepad" is used similarly for things relating to the notepad.

### Model-View Transform

This sim uses multiple model-view transform to map model coordinates (0, 1) to view coordinates.

In the "Level Out" screen, a transform is applied to both the notepad and table water cups and their water levels. The
bottom of the cups is mapped to 0, and the top of the cups is mapped to 1. Any number in between is viewed as a
percentage of water filled.

In the "Distribute" and "Fair Share" screens a transform is used to map the bottom of the plate and the center of the
play area. This allows us to stack snacks with greater ease in both screens. Additionally, in the "Distribute" screen a
transform is created for the prediction tool that maps 0 to the plate, and 10 to the top of the possible candy bar
stack.

In "Balance Point" a transform is created to map the soccer ball model values in meters (horizontally) to view
coordinates. This allows us to ensure that soccer balls in the field representation and data points in the notepad
representation are in the same location horizontally. Along the vertical axis the transform converts the number of data
points to view coordinates. This vertical transform is different between the notepad and the field representations since
the diameter (in view coordinates) of a data point is different in each.

### Memory Management

- Static Allocation: All objects in this sim are allocated at startup and exist for the lifetime of the simulation.
- Listeners: Unless otherwise noted in the code, all uses of link, `addListener`, etc. do NOT need a corresponding `unlink`, `removeListener`, etc.

## Level Out Screen

### Model
See [model.md](https://github.com/phetsims/mean-share-and-balance/blob/main/doc/model.md)

The central model for the "Level Out" screen is `LevelOutModel`. `LevelOutModel` tracks water levels across cups,
ensures water levels change according to restrictions on space, and calculates the mean across the data set.

### View

- In
  [LevelOutScreenView](https://github.com/phetsims/mean-share-and-balance/blob/main/js/intro/view/IntroScreenView.ts), `waterCupLayerNode`
  holds all the cups (notepad/table) and pipes, which properly z-orders elements as they are allocated. This node also
  centers cups and pipes as they are activated/ deactivated by the numberSpinner.
- [NotepadCupNode](https://github.com/phetsims/mean-share-and-balance/blob/main/js/intro/view/WaterCup2DNode.ts)
  and [TableCupNode](https://github.com/phetsims/mean-share-and-balance/blob/main/js/intro/view/WaterCup3DNode.ts)
  implement the model-view transform described [above](#model-view-transform).

## Sharing Screens ( Distribute and Fair Share )

### Model
See [model.md](https://github.com/phetsims/mean-share-and-balance/blob/main/doc/model.md)

`SharingModel` is the central model for the "Distribute" and "Fair Share" screens. It tracks the number of plates, the
total number of snacks, and any snacks that are not currently active in the model. It also calculates the mean for the
data set.

The `Plate` model uses an `ObservableArray` to track the current snacks on the plate. These `ObservableArray`s are in
charge of setting the `positionProperty`, `isActiveProperty`, and `fractionProperty` (if applicable) of the snacks when
they are added or removed. `numberOfTableSnacksProperty` and `notepadModeProperty` listeners are in charge of assigning
snacks to the correct array, and determining whether animation should be triggered or not.

## Balance Point Screen
The "Balance Point" screen uses soccer-common as a base for the model and the view.

### Model
See [model.md](https://github.com/phetsims/mean-share-and-balance/blob/main/doc/model.md)

The central model for the "Balance Point" screen is `BalancePointModel` which extends `SoccerModel`. `BalancePointModel`
tracks the position of the soccer balls, the tilt of the balance beam, the position of the fulcrum, and the mean of the
data set.

The majority of the model relies on common code logic from soccer-common that at the time of this writing is also used
in Center and Variability. More information about soccer-common can be
found [here](https://github.com/phetsims/soccer-common/blob/main/doc/implementation-notes.md).

## PhET-iO

The PhET-iO instrumentation of this simulation is relatively straightforward. Everything is created at startup, and
exists for the lifetime of the sim, so there is no sim-specific use of `PhetioGroup` or `PhetioCapsule`. Another
important part of the phet-io instrumentation is the use of `ObservableArray`s in the Sharing Screens ("Distribute"
and "Fair Share"). The `ObservableArray`s are a critical part of state setting and tracking for both of those screens. 
