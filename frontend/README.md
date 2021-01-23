# Frontend 

## Intro
This is build using Next.js, but it's not really using any of the features.
Firstly, so because the rendering uses Canvas, and requires to be rendered
on the Client. Secondly because rendering on the server and pushing it down
the line would actually yield in more data being sent than when sending 
'just' the data.

Below are some things I'd like to point out / explain.

## Async
Generally in web applications there is some form of IO with a backend / server.
That IO is not synchronous most of the time and it the process of fetching and
displaying is something that is fairly similar most of the time.
1. Initialize component with empty state
2. Fetch from server, show loading state
3. Show either the result, rendering some component that takes the data, or
render an error.

The empty state and the result is often unique to the component. The others are
not. Generally, the pattern I've started using abstracts most of this away. 
This is usually done in the form of an `Async` component, that takes a URL, an
optional callback function, and a render function. The callback and the render
function both receive the same data, but the callback happens from within a 
`useEffect` and as such, will trigger before the actual update / rendering the
component. This makes it quite ergonomic to do some state updates before 
actually rendering the component. I hadn't build one in TS before, but use the
same generic form in JS and ReasonML, so it was relatively easy to setup. 

## FP-TS
Coming from a pure function programming language (ReasonML), and being very
comfortable with using monads, up to the point of really missing an ergonomic
way to use them in plain JS, I decided to see how ergonomic it would be to use
a similar implementation in TS. Most noteably is the use of the `option` monad.
It encapsulates the idea of an optional value in a more explicit way than for
instance `null` or `undefined`. The 
[wikipedia article](https://en.wikipedia.org/wiki/Option_type) does a pretty 
good job of explaining.

I think I did not go all the way though. In ReasonML, you can't *just* use any
old bit of JSON. You have to parse it into your types. Which might fail. But,
if it succeeds, you are then 100% sure that whichever is in your type, is in 
your type. Adding `IO-TS` would have done something similar, and would have 
possibly been a good idea from the start. Right now, there is a gaping hole
in that if we call out to the server and it responds with some malformed data,
we'll just try and render as we would normally, resulting in unforseeable 
runtime crashes.

## Next Steps 
Things that are missing:
- Tests
- Better error handling
- Generic loading component (instead of just "loading...")
