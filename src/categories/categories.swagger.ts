const category_example = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Technical',
  description: 'Technical committees focused on engineering and technology',
  created_at: '2026-02-04T10:00:00Z',
  updated_at: '2026-02-04T10:00:00Z',
};

export const get_all_categories_swagger = {
  operation: {
    summary: 'Get all categories',
    description:
      'Retrieve categories ordered by name (ascending), paginated. Supports search by name/description and page/limit query parameters. `count` is the total number of matched categories, not the size of the current page.',
  },
  responses: {
    success: {
      description: 'Categories retrieved successfully',
      schema: {
        example: {
          data: {
            categories: [category_example],
            count: 6,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
          count: 1,
          message: 'Categories retrieved successfully',
        },
      },
    },
  },
};
