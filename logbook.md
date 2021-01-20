# Log

## Approach

1. Get a solid grasp on the data / structure used in the graph
2. Get some inspiration from other graphs
   - Highlight great / missing features
   - Get some inspiration from non-lightning graphs
   - Decide on home-grown graphing library or existing one
3. Think of a single new thing that is exciting to learn / to integrate
   - Identified -- Let's try and use `fp-ts` and see how ergonomic the use of 
     functional paradigms is within TS
4. Scaffold (Separate PR)
5. Build (Separate PR)

Some goals would be
- Not memory-hogging / bringing my PC to a grinding halt... (unlike others)

## Data
Right now, the full dataset is 41MB. That's pretty substantial, so it might be 
worth looking into how we can make that a bit less, or find a smarter way
to do this. Perhaps we can stream the data in via websockets, or we can find
a format that makes a bit more sense by removing the data that is not needed.
JSON also have the problem that it needs to re-describe the same fields 
over-and-over again, so perhaps we can make a contract that uses tuples, 
encoded as fixed size arrays to fetch the data. Then write a small BE app.
that serves the transformed data.
We could have that BE also split out the features from individual nodes, and
store the whole thing in a hashmap with the pub_key as key. Then we will 
remove the features from the initial fetch, but add the ability to fetch it 
later on. That will eliminate 36 lines of JSON per node.

### Node
```json
{
            "last_update": 1609940345,
            "pub_key": "020001adff0bf354e4174a9ced69da4d0addffeb78f1a1ba4bc8ff31a3edc1b8b8",
            "alias": "papamange",
            "addresses": [
                {
                    "network": "tcp",
                    "addr": "gsoi633f6wxa5gl5owaao6ixcyv7vu22rullorktzhfafvxgnxhnqpyd.onion:9735"
                }
            ],
            "color": "#68f442",
            "features": {
                "0": {
                    "name": "data-loss-protect",
                    "is_required": true,
                    "is_known": true
                },
                "5": {
                    "name": "upfront-shutdown-script",
                    "is_required": false,
                    "is_known": true
                },
                "7": {
                    "name": "gossip-queries",
                    "is_required": false,
                    "is_known": true
                },
                "9": {
                    "name": "tlv-onion",
                    "is_required": false,
                    "is_known": true
                },
                "13": {
                    "name": "static-remote-key",
                    "is_required": false,
                    "is_known": true
                },
                "15": {
                    "name": "payment-addr",
                    "is_required": false,
                    "is_known": true
                },
                "17": {
                    "name": "multi-path-payments",
                    "is_required": false,
                    "is_known": true
                }
            }
        },
```

### Edge
```json
{
            "channel_id": "565024731940061184",
            "chan_point": "3b4cc434e62c1739e79171c7c1641bf9ac0e32d8530c68aca08a33557af8a285:0",
            "last_update": 1609937390,
            "node1_pub": "02d97e94cfeedca2a3da47acb400bc6836e671b3cb3fc05bdd6993acd64483d09a",
            "node2_pub": "03fab7f8655169ea77d9691d4bd359e97782cb6177a6f76383994ed9c262af97a5",
            "capacity": "50000",
            "node1_policy": {
                "time_lock_delta": 144,
                "min_htlc": "1000",
                "fee_base_msat": "1000",
                "fee_rate_milli_msat": "1",
                "disabled": false,
                "max_htlc_msat": "0",
                "last_update": 1521522116
            },
            "node2_policy": {
                "time_lock_delta": 144,
                "min_htlc": "1000",
                "fee_base_msat": "1000",
                "fee_rate_milli_msat": "1",
                "disabled": true,
                "max_htlc_msat": "50000000",
                "last_update": 1609937390
            }
        },
```
I think the best approach for now would be to convert the data to the following;

### Node
```typescript
type node = {
  id: string, // pub_key -- unique
  alias: string, // name -- hovering the name instantly might be nice
}
type node = [id, alias]; // for even more compaction
```

### Edge
```typescript
type edge = {
  id: string // channel_id -- unique
  from: string, // node_pub_key
  to: string, // node_pub_key
}
or;
type edge = [id, from, to]; // for even more compaction
```
We might change naming slightly if we decide to use some fancy graph library
that gives most of the stuff for free.

Using an array / tuple based contract might seem brittle at first, but by 
leveraging something like `yarn workspaces` and a shared folder with api 
contracts, we should be able to enforce these things at compile time. ReasonML
will work great with these sort of setups as it has proper tuple types. I'm
unsure wether Typescript will do the same. We'll have to see.

We'll make a working example out of that. If there is time, we'll build a 
tiny Node app that allows us to fetch node / edge details by their respective
id's. The Node app will take the JSON and turn it into a hashmap of nodes
and edges with those id's so we can do `O(1)` lookup on those. That will
make it the best of both worlds. Probably a bit of overhead from the call-out
to the server, but it will be a lot less data than before.

**Note** - this approach will encounter some data loss. We don't know how
'fat' the edge is between nodes for instance. But this can be added later on
relatively easy.


## Graphs
Graph-wise. There is a lot of crud out there at the moment. Most of the 
implementations use some form of force-directed graph. While that's pretty, it
is not necessarily the clearest way to portay this data. But that should
be rather quick to verify. So the game-plan would be:
1. Try to get existing force-directed graph to work
 -- See how it looks. If it looks good, and is quick, fine. If no good UX, 
    step 2. If too slow, but actually decent, step 3.
2. Try to see if a circular node-graph works
3. See if there are faster solutions, using WebGL / Canvas perhaps.

Bonus: use 2, but when clicking on either a node or edge, open a new
window that shows 3.



## Logs
### Arrow / Graphistry?
Since we're dealing with quite a lot of data. Perhaps it's worth looking into
better representations than JSON. Added bonus would be that it could be 
possible to use something like https://github.com/graphistry/graphistry-js .
That would involve setting up a server as well, which might be beyond the 
scope of this specific project. Let's see.

### TS
I like using things like the `maybe` / `option` monad and `result` monads. 
In ReasonML this is really natural, due to the extremely strong module system.
In TS, this seems really weird. The namespace seems odd;
```typescript
import FP from "fp-ts";

type r<A> = FP.option.Option<A>;
let makeOption<A> = (x: A): r<A> => FP.option.some(x);
let mapX = FP.option.map(x => x);
```
The capital / non-capital naming seems rather cumbersome. Same thing in Reason;

```reason
// idiomatic
let makeOption = x => Some(x);

// explicit types
type a;
type r(a) = option('a)
let makeOption(a) = (x: a): r(a) => Some(x);

let mapX = Belt.Option.map(x => x);
```

This is consistent. Type names are lowercase, variants start uppercase, modules
start uppercase, functions lowercase.
In TS, the `option` module is lowercase, as are the functions, and the 
constructors, but the type itself starts uppercase... Some examples show the
following code, deconstructing the option straigt away, to capital `O`. Not
sure how I feel about that. That might mean I'll springle single letter 
modules all over the place. Not where I'd want to be...

```typescript
import {option as O} from "fp-ts";

type r<A> = O.Option<A>;
let makeOption<A> = (x: A): r<A> => O.some(x);
let mapX = O.map(x => x);
```

For now, and for lack of an idiomatic alternative, let's just resort to 
individual imports to what we need. I think that will lead to the cleanest code.

```typescript
import {Option, map, some} from "fp-ts";

type r<A> = Option<A>;
let makeOption<A> = (x: A): r<A> => some(x);
let mapX = map(x => x);
```

### Next.js
I'm trying to generate the conversion semi-dynamically. ie. once upon startup.
There are ~7000 nodes in the file and ~33000 edges. It should not take a long
time to dynamically add those. Unfortunately, it seems some Next.js magic is 
getting in my way. Calling the api with `getServerSideProps` works, I get
back my parsed data, but it takes forever on first render. That is not nice.

Since there is no easy way to initialize server state other than a custom 
server, I'll split out the app to FE / BE.

### Recapping first stretch
#### TS vs Reason
I think there are some things that I overlooked, possibly jamming too much of
functional stuff into something. Ie, I have a hammer and I'll use it dammit. 
TS might not be the perfect candidate for that. I feel the type system is
a bit to flexible for that. In ReasonML, if `x` is type `x`, then it's of `x`, 
not `x | y`. One place that was very interesting was the `query` endpoint.
Take the following code:
```javascript
export default function handler(req, res) {
  const {
    query: { pid },
  } = req

  res.end(`Post: ${pid}`)
}
```
Apart from their horrible deconstructing (in what universe is the above better
than the below?
```javascript
 const { pid } = req.query;
```
What is the type of `pid`? I would expect `string`, but TS errored on that, and
told me it's `string | Array<string>`. The only way to then go about checking
which it is, is to typecheck, and then you're right back to the `Array.isArray`
days. Worst of all, it's not even correct, because it can be `null`, and it can
be `undefined`. So I still have to check wether the thing TS says it is, is 
actually what it is... Wet?

In ReasonML you'd type it like:
```reason
type queryPid = | String(string) | StringArray(array(string))

// and query

type req = {
  query: option(queryPid);
}
```
How is this better?
- I can pattern match
- I can map over my optional value, and get it out with a default, it's 
extremely explicit that I should not presume it's always there.
- My value is optional, so when it's there, I know it is. No null checks;

```Reason
let doSomethingWithQueryPid = x =>
  switch(x) {
    | String(x) => x // My string
    | StringArray(xs) => xs // My list
  };
```

/endrant. 
Perhaps this is all just Next.js's fault for not encoding types properly...

#### Next steps
I did some research into graphs. Will add that to the top section of 
[Graph](#graph). I also did not do much FE work. So let's start by abstracting
away the async logic into an async component, and properly encode the 
optionality of the fetched graph.
















