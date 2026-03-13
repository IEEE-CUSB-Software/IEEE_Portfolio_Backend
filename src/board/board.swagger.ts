const board_member_example = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'John Doe',
  email: 'john.doe@ieee.org',
  role: 'President',
  image_url: 'https://example.com/images/john-doe.jpg',
  display_order: 1,
  created_at: '2026-02-04T10:00:00Z',
  updated_at: '2026-02-04T10:00:00Z',
};

export const get_all_board_members_swagger = {
  operation: {
    summary: 'Get all board members',
    description:
      'Retrieve all board members ordered by display_order (ascending) and name (ascending).',
  },
  responses: {
    success: {
      description: 'Board members retrieved successfully',
      schema: {
        example: {
          data: {
            members: [board_member_example],
            count: 1,
          },
          count: 1,
          message: 'Board members retrieved successfully',
        },
      },
    },
  },
};
