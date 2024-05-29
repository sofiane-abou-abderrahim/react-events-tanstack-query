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
