## Mean: Share and Balance - Implementation Notes
@author Marla Schulz (PhET Interactive Simulations)

A Jira test

### Introduction

This document contains notes related to the implementation of Mean: Share and Balance. This is not an exhaustive description of the implementation. The intention is to provide a concise high-level overview, and to supplement the internal documentation (source code comments) and external documentation (design documents).

Before reading this document, please read:

- [model.md](https://github.com/phetsims/mean-share-and-balance/blob/master/doc/model.md), a high-level description of the simulation model.

### General Considerations

#### Model-View Transform
This sim uses one model-view transform to map model coordinates (0, 1) to view coordinates.

This transform is applied to both the 2D and 3D water cups and their water levels. The bottom of the cups is mapped to 0, and the top of the cups is mapped to 1. Any number in between is viewed as a percentage of water filled. 

#### Memory Management
- Static Allocation: All objects in this sim are allocated at startup and exist for the lifetime of the simulation. 
- Listeners: Unless otherwise noted in the code, all uses of link, addListener, etc. do NOT need a corresponding unlink, removeListener, etc.

#### Intro Screen

Currently, this sim is a single screen.

### Model

See [model.md](https://github.com/phetsims/mean-share-and-balance/blob/master/doc/model.md)

As a single screen, the central model is IntroModel. IntroModel tracks water levels across cups, ensures water levels change according to restrictions on space, and calculates mean across the data set.

### View
- In [IntroScreenView](https://github.com/phetsims/mean-share-and-balance/blob/master/js/intro/view/IntroScreenView.ts), `waterCupLayerNode` holds all of the cups (2D/3D) and pipes, which properly z-orders elements as they are allocated. This node also centers cups and pipes as they are activated/ deactivated by the numberSpinner.
- [WaterCup2DNode](https://github.com/phetsims/mean-share-and-balance/blob/master/js/intro/view/WaterCup2DNode.ts) and [WaterCup3DNode](https://github.com/phetsims/mean-share-and-balance/blob/master/js/intro/view/WaterCup3DNode.ts) implement the model-view transform described [above](#model-view-transform).
