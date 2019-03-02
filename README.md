# Genetic Flappy Bird

Genetic Flappy Bird implementation using Tensorflow.js for the learning part and p5.js for game design.

The birds learn to fly using a simple Neural Network with a single hidden layer. The NN takes as input:

-   Distance between the bird and the ground.
-   Distance between the bird and the center of the next gap between pipes. The distance is 0 if the bird is on the same line with the center of the gap.

The fitness of a bird is its traveled distance until death.

The birds from the future generations are born using mutations are cross breeding between the best birds of the last generation.
