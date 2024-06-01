# Data Fetching With Tanstack Query (formerly React Query)

## Sending HTTP Requests With Ease

- What Is Tanstack Query?

  1. A library that helps with sending HTTP requests
  2. & helps with keeping your frontend UI in sync with your backend data

- Why Would You Use It?

  1. You don't need Tanstack Query, but
  2. it can simplify your code (and your life as a developer)
     1. it is able to get rid of a bunch of code like state management or some other code as well
     2. it gives you some advanced features, like caching, behind the scenes data fetching, etc

- Fetching & Mutating Data
- Configuring Tanstack Query
- Advanced Concepts: Cache Invalidation, Optimistic Updating & More

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Steps

## 0. Project Setup

2. in your terminal, run `cd backend` & `npm install` & `npm start`
1. open a new terminal & run `npm install` & `npm run dev`

## 1. Installing & Using Tanstack Query - And Seeing Why It's Great!

1. in the terminal, run `npm install @tanstack/react-query`
2. in `src\components\Events\NewEventsSection.jsx`, use Tanstack Query:
   1. cut the `fetchEvents()` function inside the `useEffect()` & paste it in a new file in `src/util/http.js`
   2. export this function so that you can use it outside of that file with Tanstack Query
   3. go back to `NewEventsSection.jsx` and get rid of the state management code & the useEffect() code
   4. import the `{useQuery}` hook from `@tanstack/react-query`
   5. use this `useQuery` hook inside the `NewEventsSection` component to send a HTTP request behind the scenes, etc
   6. you must configure it by adding inside of it an object with:
      1. first step:
         1. a `queryFn` property which is a function that defines the actual code that will send the actual request because:
            - Tanstack Query doesn't send HTTP requests, at least not on its own
            - you have to write the code that sends the actual HTTP request
            - Tanstack Query then manages the data, errors, caching & much more!
         2. import the outsourced `fetchEvents()` & point at it as a value of the `queryFn` property
      2. second step:
         1. a `queryKey` property
         2. as a value to it, set an array of values that are internally stored by React Query so that it can reuse existing data
   7. you get an object back from `useQuery` from where you can pull out the elements you need, like:
      1. the `data` property which holds the actual response data as a value, so the data that is returned by `fetchEvents()`
      2. the `isPending` property
      3. the `isError` property
      4. the `error` property
      5. & more
   8. use now `isPending` instead of the old `isLoading` state to show the `LoadingIndicator` whilst you're waiting for a response
   9. check for `isError` instead of the old `error` used with the state management to show the `ErrorBlock`
   10. and in that `ErrorBlock` instead of just hardcoding the `message`, use the `error` object & its `info` & its `message`
   11. output the `data` if we did successfully fetch the events
   12. in `App.js`, wrap the components that use React Query with `QueryClientProvider` & `QueryClient` imported from `@tanstack/react-query`

## 2. Understanding & Configuring Query Behaviors - Cache & Stale Data

1. you can control the behaviour of React Query, for example by setting a `staleTime` on your queries
   - this controls after which time React Query will send the behind the scenes request to get updated data if it found data in your cache
   - the default value is `0`, which means it will use `data` from the cache, but always send this behind the scenes request to get updated data
   - if you set it to `5000`, it will wait for 5 seconds before sending another request
2. you can also set the `gcTime` property
   - this controls how long the `data` in the cache will be kept around
   - the default value is 5 minutes

## 3. Dynamic Query Functions & Query Keys

1. in `src\components\Events\FindEventSection.jsx` import `{useQuery}` from `@tanstack/react-query`
2. executes `useQuery()`
3. in `http.js`, tweak a little bit the `fetchEvents()` function by adding a query parameter to the request
4. go back to `FindEventSection.jsx` and configure the `useQuery` object & manage some state to update the query when the `searchTerm` changes
5. get back the object from `useQuery()` & in there get back the `data`, `isPending`, `isError` & `error`
6. use this pieces of information to dynamically & conditionally output the `content` in this component

## 4. The Query Configuration Object & Aborting Requests

1. React Query & the `useQuery()` hook passes some default data to the query function when assigned to `queryFn`
   1. in `http.js`, `console.log(searchTerm)` to see that data
   2. this is an object that gives information about:
      - the `queryKey`
      - a `signal` needed for aborting the request if you navigate away from the page before the request was finished
2. therefore, in `http.js`, we should accept in `fetchEvents()` such an object and pull out for example
   1. the `signal` then pass this `signal` to the `fetch()` function as a second argument
   2. `searchTerm`
3. now, in `FindEventSection.jsx`, make sure you:
   1. pass an object to `fetchEvents()` & set a property named `searchTerm`
   2. forward that `signal` from `http.js` via a `signal` object to the anonymous function & set it as an argument of `fetchEvents()`

## 5. Enabled & Disabled Queries

1. in `FindEventSection.jsx`, disable the query until a search term has been entered with help of the `enabled` property
   1. initially, show no events
   2. but, if a user searched something then clear the input, show all the events
2. the `searchTerm` set should be initially undefined by not passing any value at all to `useState()`
3. set `searchTerm !== undefined` as a value of `enabled`
   1. so if if `searchTerm` is `undefined`, which is the initial value, the query will be disabled
   2. but, if it's anything else, including `''` (which would be the case if the user cleared the input field manually), the query will be enabled
4. use `isLoading` instead of `isPending` to get rid of the initial loading spinner which displayed because when a query is disabled, React treats it as `isPending`

## 6. Changing Data with Mutations

1. in `NewEvent.jsx`, use `useQuery()`:
   1. to send data
   2. to collect that data
2. the data is already collected in `EventForm.jsx`
3. to send the data, in `NewEvent.jsx`, use the `useMutation` hook which:
   1. is optimized for such data changing queries
   2. for example, by making sure that those requests are not sent instantly when the component renders unlike `useQuery`
   3. but, that instead requests are only sent when you want to send them, for example, from inside the `handleSubmit` function
4. use `useMutation()` & configure its object:
   1. set a `mutationFn` function
   2. for that, add a new `createNewEvent` function in `http.js`
   3. set this function as a value for the `mutationFn` property
5. `useMutation` returns an object that you can destructure to pull out some useful properties, like the:
   1. `mutate` property which is a function that you can call anywhere in this component to send this request
   2. `isPending` property
   3. `isError` property
   4. `error` property
6. therefore, inside the `handleSumbit()` function, call `mutate()` & pass the `formData` to it as a value
7. handle errors & show some loading text whilst the request is on its way with help of the returned `useMutation` object properties

## 7. Fetching More Data & Testing the Mutation

1. in `NewEvent.jsx`, display a list of images in the `<EventForm>` component
2. so, in `EventForm.jsx`, you need to fetch that list of images from the backend
3. to do that, use `useQuery()` & configure it
4. in `http.js`, add a new `fetchSelectableImages` function
5. in `EventForm.jsx`, set this `fetchSelectableImages` function as a value for the `queryFn` property
6. set a value of `['events-images']` for the `queryKey` property
7. use that object returned by `useQuery()` to get hold `data`, `isPending` & `isError`
8. set the `data` (so, that list of images) as a value for the `images` prop on the `<ImagePicker>` component
9. show conditionally the list of images if we have `data`
10. show a loading text if `isPending` is true
11. show an the `<ErrorBlock>` component if `isError` is true

## 8. Acting on Mutation Success & Invalidating Queries

1. in `NewEvent.jsx`, when creating a new event, wait for this mutation to be finished until navigating away
   1. to do that, add a new `onSuccess` property to the `useQuery()` configuration object
   2. it wants a function as a value that will be executed once this `mutationFn` succeeded
   3. inside of this method, call `navigate('/events')`
2. when creating a new event, the new event must be rendered straight away in the UI without switching to a different page then coming back to refetch data behind the scenes
   1. React Query should immediately refetch data & update your data in the UI
   2. in `NewEventsSection.jsx`, the `data` in the query should be marked as stale & refetch is triggered
   3. you can achieve this by calling a method provided by React Query that allows us to invalidate one or more queries
   4. before that, in `App.jsx`, with help of the `QueryClient` object, you will force this invalidation of a query
   5. therefore, cut `QueryClient` & add it in `http.js` so that you can import it from multiple files
   6. now, in `App.jsx`, import this `queryClient` constant from `http.js`
   7. now, in `NewEvent.jsx`, in the `onSuccess` method before navigating away, call `queryClient.invalidateQueries()`
   8. to target specific queries, `invalidateQueries()` takes an object as an input where you have to define the `queryKey` which you want to target
   9. set `queryKey: ['events']` to invalidate all queries that include the `events` key even if it is not exactly the same key (if you don't use `exact: true`)

## 9. A Challenge! The Problem

1. update the `util/http.js` file so that you add to it the `fetchEvent()` & `deleteEvent()` functions
2. use the `fetchEvent()` function together with React Query's `useQuery()` hook to fetch the event details in `EventDetails.jsx` & output the event details, like the event title, the image
   1. in order to fetch the data for a single event, you'll need the ID of that event
   2. you can get that in the `EventDetails` component via React Router's `useParams` hook
3. make the delete button work by using the `deleteEvent()` function together with React Query's `useMutation()` in `EventDetails.jsx` so that you get a mutation which you can execute when this button is clicked

## 10. A Challenge! The Solution

1. use React Query's `useQuery()` hook to fetch data:
   1. in `EventDetails.jsx`, import `useQuery` & execute it in the `EventDetails` component function
   2. configure the query by adding:
      1. `queryFn` which has `fetchEvent()` as a value & get access to the `id` with `useParams()` & pass it to the function
      2. `queryKey` which has `['events', params.id]` as a value
   3. get the object from `useQuery()` & pull out from it `data`, `isPending`, `isError` & `error` properties
   4. use this pieces of data to output different content on the screen depending on the current state of this query
   5. formate the `date` in a nice way
2. use ReactQuery's `useMutation()` hook to delete data:
   1. in `EventDetails.jsx`, import `useMutation()` & execute it in the `EventDetails` component function
   2. configure the query by adding `mutationFn` & setting `deleteEvent` to it as a value
   3. get the object from `useMutation()` & pull out from it the `mutate` property
   4. trigger the `mutate()` fonction when the `delete` button is pressed by callig it inside a `handleDelete()` function
      1. pass an object to `mutate()`
      2. add an `id` property which has the id of that to be deleted event (`params.id`) as a value
   5. connect the `handleDelete()` function to this `delete` button with help of the `onClick` prop
   6. define what should happen after the mutation succeeds
      1. add the `onSuccess` property to the mutation configuration object
      2. set to it an anonymous function & inside of it navigate away with the React Router DOM's `useNavigate()` hook
      3. invalidate your event related queries because
         1. the data should be marked as outdated after deletion of the event with `queryClient` & `invalidateQueries`
         2. and React Query should be forced to fetch data again

## 11. Disabling Automatic Refetching After Invalidations

1. in `EventDetails.jsx`, since we invalidate all queries, React Query immediately triggers a refetch for this details query & provokes an error in the console
2. to avoid this behaviour, you must:
   1. add a second `refetchType` property to this configuration object for `queryClient.invalidateQueries()`
   2. and set its value to `'none'`
   3. which makes sure that when you call `invalidateQueries()`, these existing queries (`queryKey: ['events]`) will not automatically be triggered again immediately
   4. instead they will just be invalidated & the next time they will be required, they will run again

## 12. Enhancing the Demo App & Repeating Mutation Concepts

1. in `EventDetails.jsx`, add a confirmation modal before we trigger this deletion mutation
   1. manage some `isDeleting` state with the `useState()` hook initially set to `false` that tells us whether the user started the deletion process or not
   2. change this to `true` once the user clicks this `Delete` button
   3. open up a modal where the user has to click another button to start this deletion mutation
   4. add a new `handleStartDelete()` function in which you set `setIsDeleting` to `true`
   5. add a new `handleStopDelete()` function in which you set `setIsDeleting` to `true` (if the user cancels this delete process)
   6. connect `handleStartDelete` to the `Delete` button in this UI instead of `handleDelete`
   7. but, now this UI should also contain another component that can be displayed
      1. in your `return` statement, add the `<Modal>` component
      2. inside this component, show some confirmation text and `Cancel` & `Delete` buttons
      3. this `Delete` button, when is clicked, should trigger the `handleDelete` function you used before to delete the event
      4. this `Cancel` button should trigger the `handleStopDelete` function to stop the deletion mutation & close this modal again
      5. because this modal should be display conditionally if `isDeleting` is `true`
      6. this `<Modal>` component takes an `onClose` prop which triggers `handleStopDelete` when this modal is closed
2. having to wait for a short while before the event is being deleted is not ideal because you should give the user some feedback that this deletion was initiated
   1. in the `useMutation` object, pull out:
      1. `isPending` property & set it to `isPendingDeletion` to avoid a name clash
      2. `isError` & name it `isErrorDeleting`
      3. `error` & name it `deleteError`
   2. use these properties to show
      1. some loading text whilst the request is on its way
      2. and some error output if the deletion should fail

## 13. React Query Advantages In Action

1. when clicking on the `Edit` button from the `EventDetails` page and the modal is opened, prepopulate the modal with the event data to which it belongs
2. in `EditEvent.jsx`, load the data that should be filled into this form as a default & pass it to the `inputData` prop in the `<EventForm>` component with help of `useQuery`
3. execute `useQuery()` & configure it
4. get back the object from `useQuery()` & pull out the needed properties from it, like `data`, `isPending`, `isEror` & `error`
5. use `data` to prepopulate this form by setting `inputData={data}`
6. use `isPending` to show a loading indicator (`LoadingIndicator`) if we're still waiting for a response
7. use `isError` & `error` to show an error block (`<ErrorBlock>`) if we get an error
8. use `data` to show the `<EventForm>`

## 14. Updating Data with Mutations

work on this update functionality so that you can update an event from the modal after clicking the `Edit` button

1. update the `http.js` file which now includes an `updateEvent` function
2. in `EditEvent.jsx`, you need a mutation to send a request to the backend that changes the event data
   1. create a mutation with `useMutation()`
   2. trigger it by calling the `mutate()` property & targetting the `updateEvent` function from inside the `handleSubmit()`
   3. in `mutate()`, pass this object with the to be forwarded data to `updateEvent` to this `mutate()` function
      1. an object that has `id` & `event` properties
      2. hence pass `{id: params.id, event: formData}`
   4. call `navigate()` right after `mutate()` inside `handleSubmit()`

## 15. Optimistic Updating

- Do optimistic updating so that, when you press the `Update` button, the UI is updated instantly without waiting for the response of the backend
- & if the update fails, roll back the optimistic update you performed

1. in `EditEvent.jsx`, add a new `onMutate` property to this `useMutation()` configuration object
   1. this property wants a function as a value which will be executed right when you call `mutate()`, so before this process is done & before you got back a response
   2. in this function, update the data that is cached by React Query, this event data that is stored behind the scenes so to say
      1. import `queryClient` from `http.js` to change the cached data (and not to invalidate queries this time)
      2. inside the `onMutate` function, get the currently stored data so that we can manipulate it & edit it without waiting for a response with help of `queryClient.setQueryData()`
         1. `setQueryData()` needs 2 arguments
         2. the key of the query that you want to edit `['events', params.id]`
         3. the new `data` you want to store under that query key, which is, in this case, that updated event data `formData` which you also sent to your backend that you can store in a `newEvent` constant
      3. inside `onMutate()`, use `queryClient.cancelQueries()` to cancel all active queries for a specific key
2. to make sure you can roll back your optimistic update if it fails on the backend
   1. you also need to get the old data & store it somewhere so that you can roll back to that old data
      1. do that before you update the data (`queryClient.setQueryData()`) with help of `queryClient.getQueryData()` which gives you the currently stored query data
      2. store it in a `previousEvent` constant
   2. roll back to `prevousEvent` if your update mutation failed by adding a new `onError` property to this`useMutation()` configuration object
      1. this property wants a function which will be executed if this `mutationFn: updateEvent` function fails
      2. it receives a couple of inputs that are passed in automatically by React Query
         1. `error`, `data` & `context` objects
         2. this `context` object can contain this `previousEvent`
      3. in order for this `previousEvent` to be part of this `context`,
         1. you should return an object in this `onMutate` function, because this object will be this `context`
         2. and store this `previousEvent` inside of this object
      4. on `onError`, call `queryClient.setQueryData()` again,
         1. to again manually update the stored data for this query with this key `['events', params.id]`
         2. but now, set it back to that old event `previousEvent` which was previously stored with `context.previousEvent`
3. make sure that whenever this mutation finished you still fetch the latest data from the backend and the data are always into sync by forcing React Query to refetch the data behind the scenes
   1. add a `onSettled` property to this `useMutation()` configuration object
   2. this property also wants a function as a value
   3. this function will be called whenever this `mutationFn: updateEvent` function is done no matter if it failed or succeeded
   4. in that case, to be sure that you got the same data in your frontend as you have in your backend,
      1. you should use `queryClient.invalidateQueries(['events'], params.id)`
      2. to invalidate all the `events` queries that use this specific `params.id`

## 16. Using the Query Key As Query Function Input

It would be better if we would only see some events below "Recently added events" instead of all events

1.  in the backend `app.js` file, the backend code supports already this feature thanks to the `max` query parameter inside the get `/events` route
    1. so you must set such a `max` query parameter on that ongoing URL to limit the number of items you're retrieving & to get the most recent items
    2. therefore, in the frontend `http.js`, you have to tweak this `fetchEvents()` function
       1. pull out a `max` property
       2. tweak the URL depending on whether `max` & `searchTerm` are set, or one of the two, or none of them
2.  in `NewEventsSection.jsx`, tweak that query so that it doesn't fetch all events but instead just some events
    1. set this `max` property in the `queryFn: fetchEvents` function & abort `signal`
    2. update the `queryKey` by adding to it `{max: 3}` so you have a dedicated query key for this query (like you did in `FindEventSection.jsx` with the `searchTerm`)
    3. but, you can also use an alternative approach to avoid repetition which is
       1. passing `queryKey` as an argument to the `queryFn` anonymous function
       2. and using the spread operator as an argument of `fetchEvents()` to spread the object `{max: 3}` from the `queryKey` property, like this `...queryKey[1]`
3.  use this alternative approach in `FindEventSection.jsx` for the `searchTerm`
