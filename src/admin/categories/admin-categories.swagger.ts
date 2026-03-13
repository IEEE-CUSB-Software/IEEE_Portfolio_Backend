const category_example = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Technical',
  description: 'Technical committees focused on engineering and technology',
  created_at: '2026-02-04T10:00:00Z',
  updated_at: '2026-02-04T10:00:00Z',
};

export const admin_create_category_swagger = {
  operation: {
    summary: 'Create category',
    description: 'Create a new category. Admin only.',
  },
  responses: {
    success: {
      description: 'Category created successfully',
      schema: {
        example: {
          data: category_example,
          count: 1,
          message: 'Category created successfully',
        },
      },
    },
  },
};

export const admin_update_category_swagger = {
  operation: {
    summary: 'Update category',
    description: 'Update an existing category. Admin only.',
  },
  responses: {
    success: {
      description: 'Category updated successfully',
      schema: {
        example: {
          data: category_example,
          count: 1,
          message: 'Category updated successfully',
        },
      },
    },
  },
};

export const admin_delete_category_swagger = {
  operation: {
    summary: 'Delete category',
    description:
      'Delete a category. Cannot delete if category has committees. Admin only.',
  },
  responses: {
    success: {
      description: 'Category deleted successfully',
      schema: {
        example: {
          data: { message: 'Category deleted successfully' },
          count: 1,
          message: 'Category deleted successfully',
        },
      },
    },
  },
};
