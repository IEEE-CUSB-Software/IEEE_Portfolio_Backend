const registration_example = {
  id: 'b6a7b810-9dad-4c92-91a1-98e32ccaa999',
  user_id: '3f0f3f98-7c7b-49b3-b17b-0d7b0d27f9e1',
  event_id: '550e8400-e29b-41d4-a716-446655440000',
  status: 'registered',
  created_at: '2026-02-04T10:05:00Z',
  updated_at: '2026-02-04T10:05:00Z',
};

const event_example = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: 'IEEE AI Workshop',
  image_url: "https://res.cloudinary.com/dgmdresu7/image/upload/v1777051798/events-primary/kcllgsm0imlbanhw5ska.png",
  image_public_id: "events-primary/kcllgsm0imlbanhw5ska",
  description: 'A hands-on workshop on AI fundamentals and applications.',
  category: 'Technical',
  location: 'Main Auditorium, Building B',
  start_time: '2026-03-15T10:00:00Z',
  end_time: '2026-03-15T12:00:00Z',
  capacity: 100,
  registration_deadline: '2026-03-10T23:59:59Z',
  images: [],
  created_by: '3f0f3f98-7c7b-49b3-b17b-0d7b0d27f9e1',
  created_at: '2026-02-04T10:00:00Z',
  updated_at: '2026-02-04T10:00:00Z',
  remainingSpots: 45,
  is_full: false,
  is_registered: true,
  registration: registration_example,
};


export const get_all_events_swagger = {
  operation: {
    summary: 'Get all events',
    description:
      'Retrieve a paginated list of all events. Includes capacity information (remainingSpots, is_full). If authenticated, also includes user registration status (is_registered, registration_id).',
  },
  responses: {
    success: {
      description: 'Events retrieved successfully',
      schema: {
        example: {
          data: [event_example],
          count: 1,
          message: 'Events retrieved successfully',
        },
      },
    },
  },
};

export const get_event_by_id_swagger = {
  operation: {
    summary: 'Get event by ID',
    description:
      'Retrieve a specific event by its ID. Includes capacity information (remainingSpots, is_full). If authenticated, also includes user registration status (is_registered, registration_id).',
  },
  responses: {
    success: {
      description: 'Event retrieved successfully',
      schema: {
        example: {
          data: {
            ...event_example,
          },
          count: 1,
          message: 'Event retrieved successfully',
        },
      },
    },
  },
};

export const register_event_swagger = {
  operation: {
    summary: 'Register for an event',
    description:
      'Users can register for an event. Registration is only allowed if spots are available.',
  },
  responses: {
    success: {
      description: 'Registered successfully',
      schema: {
        example: {
          data: {
            ...registration_example,
          },
          count: 1,
          message: 'Event registration created successfully',
        },
      },
    },
  },
};

export const cancel_event_registration_swagger = {
  operation: {
    summary: 'Cancel event registration',
    description: 'Users can cancel their event registration.',
  },
  responses: {
    success: {
      description: 'Registration cancelled successfully',
      schema: {
        example: {
          data: {
            ...registration_example,
            status: 'cancelled',
          },
          count: 1,
          message: 'Event registration cancelled successfully',
        },
      },
    },
  },
};
