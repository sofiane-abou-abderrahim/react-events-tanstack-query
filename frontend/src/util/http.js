import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export const url = window.location.origin;

export async function fetchEvents({ signal, searchTerm, max }) {
  let apiUrl = `${url}/api`;

  if (searchTerm && max) {
    apiUrl += `?search=${searchTerm}&max=${max}`;
  } else if (searchTerm) {
    apiUrl += `?search=${searchTerm}`;
  } else if (max) {
    apiUrl += `?max=${max}`;
  }

  const response = await fetch(apiUrl, { signal });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the events');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}

export async function createNewEvent(eventData) {
  const response = await fetch(`${url}/api`, {
    method: 'POST',
    body: JSON.stringify(eventData),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = new Error('An error occurred while creating the event');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}

export async function fetchSelectableImages({ signal }) {
  const response = await fetch(`${url}/api/images`, { signal });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the images');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { images } = await response.json();

  return images;
}

export async function fetchEvent({ id, signal }) {
  const response = await fetch(`${url}/api/${id}`, { signal });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the event');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}

export async function deleteEvent({ id }) {
  const response = await fetch(`${url}/api/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const error = new Error('An error occurred while deleting the event');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}

export async function updateEvent({ id, event }) {
  const response = await fetch(`${url}/api/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ event }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = new Error('An error occurred while updating the event');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}
