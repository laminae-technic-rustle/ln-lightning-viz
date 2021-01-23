# Shared 

## Intro
By leveraging yarn workspaces, we can load this shared module into both the FE
and BE as an npm module. This allows for some types to be shared and can make 
sure sure the BE and FE both check wether they're using the same ones at 
compile time. This, in theory, gives a binding contract between FE and BE.

## Shared Types
The shared types here are normal JSON objects as one would expect, but there is 
also the graph, which consists of two arrays of an array of nodeId's and an
array of tuples with a from / to nodeId. Since we're sharing the type 
definitions, it doesn't make any sense to make both of these objects, as we 
would have to push a bunch of extra characters over the line. Doing it this way
makes for the most data compaction given we're still using JSON over REST.
