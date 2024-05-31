import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import Header from '../Header.jsx';
import { deleteEvent, fetchEvent, queryClient } from '../../util/http.js';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EventDetails() {
  const navigate = useNavigate();

  const id = useParams();
  console.log(id);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['event'],
    queryFn: ({ signal }) => fetchEvent(id, { signal })
  });

  const { mutate } = useMutation({
    mutationFn: () => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event'] });
      navigate('/events');
    }
  });

  function handleDelete() {
    mutate();
  }

  if (isLoading) {
    <LoadingIndicator />;
  }

  if (isError) {
    <ErrorBlock
      title="An error occured"
      message={error.info?.message || 'Failed to fetch event.'}
    />;
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      {data && (
        <article id="event-details">
          <header>
            <h1>{data.title}</h1>
            <nav>
              <button onClick={handleDelete}>Delete</button>
              <Link to="edit">Edit</Link>
            </nav>
          </header>
          <div id="event-details-content">
            <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
            <div id="event-details-info">
              <div>
                <p id="event-details-location">{data.location}</p>
                <time dateTime={`Todo-DateT$Todo-Time`}>
                  {data.date} @ {data.time}
                </time>
              </div>
              <p id="event-details-description">{data.description}</p>
            </div>
          </div>
        </article>
      )}
    </>
  );
}
