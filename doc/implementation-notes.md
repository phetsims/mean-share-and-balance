## Mean: Share and Balance - Implementation Notes
@author Marla Schulz (PhET Interactive Simulations)

### Introduction

This document contains notes related to the implementation of Mean: Share and Balance. This is not an exhaustive description of the implementation. The intention is to provide a concise high-level overview, and to supplement the internal documentation (source code comments) and external documentation (design documents).

Before reading this document, please read:

- [model.md](), a high-level description of the simulation model

### General Considerations

#### Model View Transform
This sim uses one (1) model view transform to map model coordinates (0, 1) to view coordinates.

This transform is applied to both the 2D and 3D water cups and their water levels. The bottom of the cups is mapped to 0, and the top of the cups is mapped to 1. Any number in between is viewed as a percentage of water filled. 

#### Memory Management
- Dynamic Allocation:
  - All the cups and pipes are added and removed dynamically as cups are added and removed through the number spinner. 
  - Therefore, all cups and pipes must be disposed along with their links and listeners.

#### Intro Screen

Currently this sim is a single screen. 