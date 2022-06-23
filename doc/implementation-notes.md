## Mean: Share and Balance - Implementation Notes
@author Marla Schulz (PhET Interactive Simulations)

### Introduction

This document contains notes related to the implementation of Mean: Share and Balance. This is not an exhaustive description of the implementation. The intention is to provide a concise high-level overview, and to supplement the internal documentation (source code comments) and external documentation (design documents).

Before reading this document, please read:

- [model.md](https://github.com/phetsims/mean-share-and-balance/blob/master/doc/model.md), a high-level description of the simulation model.

### General Considerations

#### Model View Transform
This sim uses one model view transform to map model coordinates (0, 1) to view coordinates.

This transform is applied to both the 2D and 3D water cups and their water levels. The bottom of the cups is mapped to 0, and the top of the cups is mapped to 1. Any number in between is viewed as a percentage of water filled. 

#### Memory Management
- Dynamic Allocation:
  - All the cups and pipes are added and removed dynamically as cups are added and removed through the number spinner. 
  - Therefore, all cups and pipes must be disposed along with their links and listeners.

All other items are allocated at startup.

#### Intro Screen

Currently, this sim is a single screen.

### Model

See [model.md](https://github.com/phetsims/mean-share-and-balance/blob/master/doc/model.md)

As a single screen the central model is IntroModel. IntroModel tracks waterlevels across cups, ensures water levels change according to restrictions on space, and calculates mean across the data set.

### View
- Pipes and Cups (2d/3D) are all created dynamically so must be disposed of properly ( unlink, dispose, removeListener). 
- waterCupLayerNode holds all of the cups (2D/3D) and pipes, which properly z-orders elements as they are created and disposed. This node also centers cups and pipes as they are created and disposed.
- WaterCup2DNode and WaterCup3DNOde implement the model view transform described [above](#model-view-transform)

### PhET-iO

**PhetioGroup** is used to manage the dynamic elements in the sim. The dynamic elements are: 2D cups, 3D cups, and pipes.