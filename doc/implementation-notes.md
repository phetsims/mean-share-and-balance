## Mean: Share and Balance - Implementation Notes

@author Marla Schulz (PhET Interactive Simulations)

A Jira test

### Introduction

This document contains notes related to the implementation of Mean: Share and Balance. This is not an exhaustive
description of the implementation. The intention is to provide a concise high-level overview, and to supplement the
internal documentation (source code comments) and external documentation (design documents).

Before reading this document, please read:

- [model.md](https://github.com/phetsims/mean-share-and-balance/blob/main/doc/model.md), a high-level description of the
  simulation model.

### General Considerations

#### Terminology

In all screens, there is a notepad shown towards the top of the screen that contains "sketches" of things shown towards
the bottom of the screen. The term "sketch" is used in the comments and in class/variable names to indicate items that
appear in this notepad.

#### Model-View Transform

This sim uses one model-view transform to map model coordinates (0, 1) to view coordinates.

This transform is applied to both the 2D and 3D water cups and their water levels. The bottom of the cups is mapped to
0, and the top of the cups is mapped to 1. Any number in between is viewed as a percentage of water filled.

#### Memory Management

- Static Allocation: All objects in this sim are allocated at startup and exist for the lifetime of the simulation.
- Listeners: Unless otherwise noted in the code, all uses of link, addListener, etc. do NOT need a corresponding unlink,
  removeListener, etc.

#### Intro Screen

Currently, this sim is a single screen.

### Model

See [model.md](https://github.com/phetsims/mean-share-and-balance/blob/main/doc/model.md)

As a single screen, the central model is LevelingOutModel. LevelingOutModel tracks water levels across cups, ensures water levels
change according to restrictions on space, and calculates mean across the data set.

### View

- In
  [LevelingOutScreenView](https://github.com/phetsims/mean-share-and-balance/blob/main/js/intro/view/IntroScreenView.ts), `waterCupLayerNode`
  holds all of the cups (2D/3D) and pipes, which properly z-orders elements as they are allocated. This node also
  centers cups and pipes as they are activated/ deactivated by the numberSpinner.
- [NotepadCupNode](https://github.com/phetsims/mean-share-and-balance/blob/main/js/intro/view/WaterCup2DNode.ts)
  and [TableCupNode](https://github.com/phetsims/mean-share-and-balance/blob/main/js/intro/view/WaterCup3DNode.ts)
  implement the model-view transform described [above](#model-view-transform).

#### Sharing Screens ( Distribute and Fair Share )

TODO: ObservableArrays in the Plate class are in charge of setting the positionProperty, isActiveProperty, and
fractionProperty of the snacks when they are added. numberOfTableSnacksProperty and notepadModeProperty listeners are in
charge of assigning snacks to the correct array, and animation.


