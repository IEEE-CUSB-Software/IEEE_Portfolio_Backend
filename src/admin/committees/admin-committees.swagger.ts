const committee_example = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Robotics Committee',
  about:
    'The Robotics Committee focuses on building autonomous robots and promoting robotics education.',
  category_id: '3f0f3f98-7c7b-49b3-b17b-0d7b0d27f9e1',
  created_at: '2026-02-04T10:00:00Z',
  updated_at: '2026-02-04T10:00:00Z',
};

export const admin_create_committee_swagger = {
  operation: {
    summary: 'Create committee',
    description: 'Create a new committee. Admin only.',
  },
  responses: {
    success: {
      description: 'Committee created successfully',
      schema: {
        example: {
          data: committee_example,
          count: 1,
          message: 'Committee created successfully',
        },
      },
    },
  },
};

export const admin_update_committee_swagger = {
  operation: {
    summary: 'Update committee',
    description: 'Update an existing committee. Admin only.',
  },
  responses: {
    success: {
      description: 'Committee updated successfully',
      schema: {
        example: {
          data: committee_example,
          count: 1,
          message: 'Committee updated successfully',
        },
      },
    },
  },
};

export const admin_delete_committee_swagger = {
  operation: {
    summary: 'Delete committee',
    description:
      'Delete a committee. Committee members will be deleted automatically (cascade). Admin only.',
  },
  responses: {
    success: {
      description: 'Committee deleted successfully',
      schema: {
        example: {
          data: { message: 'Committee deleted successfully' },
          count: 1,
          message: 'Committee deleted successfully',
        },
      },
    },
  },
};
