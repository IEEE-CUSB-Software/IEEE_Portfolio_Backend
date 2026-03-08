const award_example = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: 'Excellence in Innovation',
  avatar_url: 'https://example.com/awards/excellence.png',
  description:
    'Award given to individuals who demonstrate outstanding innovation and creativity.',
  color: '#FFD700',
  won_count: 5,
  created_at: '2026-02-04T10:00:00Z',
  updated_at: '2026-02-04T10:00:00Z',
};

export const get_all_awards_swagger = {
  operation: {
    summary: 'Get all awards',
    description: 'Retrieve a list of all available awards.',
  },
  responses: {
    success: {
      description: 'Awards retrieved successfully',
      schema: {
        example: {
          data: [award_example],
          count: 1,
          message: 'Awards retrieved successfully',
        },
      },
    },
  },
};

export const create_award_swagger = {
  operation: {
    summary: 'Create a new award',
    description: 'Admin only: Create a new award in the system.',
  },
  responses: {
    success: {
      description: 'Award created successfully',
      schema: {
        example: {
          data: award_example,
          count: 1,
          message: 'Award created successfully',
        },
      },
    },
  },
};

export const delete_award_swagger = {
  operation: {
    summary: 'Delete an award',
    description: 'Admin only: Delete an award by its ID.',
  },
  responses: {
    success: {
      description: 'Award deleted successfully',
      schema: {
        example: {
          data: null,
          count: 0,
          message: 'Award deleted successfully',
        },
      },
    },
  },
};
