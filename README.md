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
