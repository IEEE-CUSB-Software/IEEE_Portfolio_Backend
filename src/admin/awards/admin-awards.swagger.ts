const award_example = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  image_url: 'https://example.com/images/ieee-award.jpg',
  title: 'Best Technical Chapter',
  description: 'Awarded for outstanding chapter performance and activities.',
  won_count: 3,
  created_at: '2026-03-15T10:00:00Z',
  updated_at: '2026-03-15T10:00:00Z',
};

export const admin_create_award_swagger = {
  operation: {
    summary: 'Create award',
    description: 'Create a new award. Admin only.',
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

export const admin_update_award_swagger = {
  operation: {
    summary: 'Update award',
    description: 'Update an existing award. Admin only.',
  },
  responses: {
    success: {
      description: 'Award updated successfully',
      schema: {
        example: {
          data: award_example,
          count: 1,
          message: 'Award updated successfully',
        },
      },
    },
  },
};

export const admin_delete_award_swagger = {
  operation: {
    summary: 'Delete award',
    description: 'Delete an award. Admin only.',
  },
  responses: {
    success: {
      description: 'Award deleted successfully',
      schema: {
        example: {
          data: { message: 'Award deleted successfully' },
          count: 1,
          message: 'Award deleted successfully',
        },
      },
    },
  },
};
