const event_example = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: 'IEEE AI Workshop',
  description: 'A hands-on workshop on AI fundamentals and applications.',
  category: 'Technical',
  location: 'Main Auditorium, Building B',
  start_time: '2026-03-15T10:00:00Z',
  end_time: '2026-03-15T12:00:00Z',
  capacity: 100,
  registration_deadline: '2026-03-10T23:59:59Z',
  created_by: '3f0f3f98-7c7b-49b3-b17b-0d7b0d27f9e1',
  created_at: '2026-02-04T10:00:00Z',
  updated_at: '2026-02-04T10:00:00Z',
};

const registration_example = {
  id: 'b6a7b810-9dad-4c92-91a1-98e32ccaa999',
  user_id: '3f0f3f98-7c7b-49b3-b17b-0d7b0d27f9e1',
  event_id: '550e8400-e29b-41d4-a716-446655440000',
  status: 'registered',
  created_at: '2026-02-04T10:05:00Z',
  updated_at: '2026-02-04T10:05:00Z',
};

export const admin_create_event_swagger = {
  operation: {
    summary: 'Create a new event',
    description: 'Admins can create a new event.',
  },
  responses: {
    success: {
      description: 'Event created successfully',
      schema: {
        example: {
          data: {
            ...event_example,
          },
          count: 1,
          message: 'Event created successfully',
        },
      },
    },
  },
};

export const admin_update_event_swagger = {
  operation: {
    summary: 'Update event',
    description: 'Admins can update an event.',
  },
  responses: {
    success: {
      description: 'Event updated successfully',
      schema: {
        example: {
          data: {
            ...event_example,
            updated_at: '2026-02-04T12:00:00Z',
          },
          count: 1,
          message: 'Event updated successfully',
        },
      },
    },
  },
};

export const admin_delete_event_swagger = {
  operation: {
    summary: 'Delete event',
    description: 'Admins can delete an event.',
  },
  responses: {
    success: {
      description: 'Event deleted successfully',
      schema: {
        example: {
          data: {},
          count: 1,
          message: 'Event deleted successfully',
        },
      },
    },
  },
};

export const admin_get_event_registrations_swagger = {
  operation: {
    summary: 'Get event registrations',
    description: 'Admins can view all registrations for a specific event.',
  },
  responses: {
    success: {
      description: 'Event registrations retrieved successfully',
      schema: {
        example: {
          data: [registration_example],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      },
    },
  },
};

export const admin_update_registration_status_swagger = {
  operation: {
    summary: 'Update registration status',
    description: 'Admins can update a user registration status.',
  },
  responses: {
    success: {
      description: 'Registration status updated successfully',
      schema: {
        example: {
          data: {
            ...registration_example,
            status: 'attended',
          },
          count: 1,
          message: 'Event registration status updated successfully',
        },
      },
    },
  },
};

export const admin_bulk_register_swagger = {
  operation: {
    summary: 'Bulk register users to event',
    description:
      'Admins can register multiple users to an event. Event capacity will be automatically increased if needed.',
  },
  responses: {
    success: {
      description: 'Users registered successfully',
      schema: {
        example: {
          data: [registration_example],
          count: 1,
          message: 'Users registered successfully',
        },
      },
    },
  },
};
