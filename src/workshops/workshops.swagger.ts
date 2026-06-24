import { instructor_example, workshop_example } from 'src/admin/workshops/admin-workshops.swagger';

export const get_all_instructors_swagger = {
  operation: {
    summary: 'Get all instructors',
    description: 'Retrieve a list of all instructors in the directory.',
  },
  responses: {
    success: {
      description: 'Instructors retrieved successfully',
      schema: {
        example: {
          data: [instructor_example],
          count: 1,
          message: 'Success',
        },
      },
    },
  },
};

export const get_instructor_by_id_swagger = {
  operation: {
    summary: 'Get instructor by ID',
    description: 'Retrieve detailed information of a specific instructor, including their associated workshops.',
  },
  responses: {
    success: {
      description: 'Instructor retrieved successfully',
      schema: {
        example: {
          data: {
            ...instructor_example,
            workshops: [],
          },
          count: 1,
          message: 'Success',
        },
      },
    },
  },
};

export const get_all_workshops_swagger = {
  operation: {
    summary: 'Get all workshops',
    description: 'Retrieve a paginated list of all workshops. Includes capacity information (remainingSpots, is_full). If authenticated, also includes user registration status (is_registered, registration_id, registration_status).',
  },
  responses: {
    success: {
      description: 'Workshops retrieved successfully',
      schema: {
        example: {
          data: [
            {
              ...workshop_example,
              remainingSpots: 45,
              is_full: false,
              is_registered: false,
              registration_id: null,
              registration_status: null,
              instructors: [instructor_example],
              images: [],
            },
          ],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      },
    },
  },
};

export const get_workshop_by_id_swagger = {
  operation: {
    summary: 'Get workshop by ID',
    description: 'Retrieve details of a specific workshop by ID. Includes capacity information (remainingSpots, is_full). If authenticated, also includes user registration status (is_registered, registration_id, registration_status).',
  },
  responses: {
    success: {
      description: 'Workshop retrieved successfully',
      schema: {
        example: {
          data: {
            ...workshop_example,
            remainingSpots: 45,
            is_full: false,
            is_registered: false,
            registration_id: null,
            registration_status: null,
            instructors: [instructor_example],
            images: [],
          },
          count: 1,
          message: 'Workshop retrieved successfully',
        },
      },
    },
  },
};

export const register_workshop_swagger = {
  operation: {
    summary: 'Register for a workshop (request to join)',
    description: 'Users can register for a workshop. All registrations are placed in a PENDING state and must be accepted by an admin. Note that only users who have uploaded their CV (cv_file_key is not null) can register.',
  },
  responses: {
    success: {
      description: 'Workshop registration request created',
      schema: {
        example: {
          data: {
            id: 'b6a7b810-9dad-4c92-91a1-98e32ccaa999',
            user_id: '3f0f3f98-7c7b-49b3-b17b-0d7b0d27f9e1',
            workshop_id: '550e8400-e29b-41d4-a716-446655440000',
            status: 'pending',
            created_at: '2026-06-24T12:00:00Z',
            updated_at: '2026-06-24T12:00:00Z',
          },
          count: 1,
          message: 'Workshop registration created successfully',
        },
      },
    },
  },
};

export const cancel_workshop_registration_swagger = {
  operation: {
    summary: 'Cancel workshop registration request',
    description: 'Users can cancel their workshop registration request.',
  },
  responses: {
    success: {
      description: 'Workshop registration request cancelled successfully',
      schema: {
        example: {
          data: {
            id: 'b6a7b810-9dad-4c92-91a1-98e32ccaa999',
            user_id: '3f0f3f98-7c7b-49b3-b17b-0d7b0d27f9e1',
            workshop_id: '550e8400-e29b-41d4-a716-446655440000',
            status: 'cancelled',
            created_at: '2026-06-24T12:00:00Z',
            updated_at: '2026-06-24T12:00:00Z',
          },
          count: 1,
          message: 'Workshop registration cancelled successfully',
        },
      },
    },
  },
};
