const committee_member_example = {
  id: 'b6a7b810-9dad-4c92-91a1-98e32ccaa999',
  committee_id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Jane Smith',
  email: 'jane.smith@ieee.org',
  role: 'head',
  image_url: 'https://example.com/images/jane-smith.jpg',
  created_at: '2026-02-04T10:00:00Z',
  updated_at: '2026-02-04T10:00:00Z',
};

export const get_committee_members_swagger = {
  operation: {
    summary: 'Get committee members',
    description:
      'Retrieve all members of a committee ordered by role (head, vice_head, member) and then by name.',
  },
  responses: {
    success: {
      description: 'Committee members retrieved successfully',
      schema: {
        example: {
          data: {
            members: [committee_member_example],
            count: 1,
          },
          count: 1,
          message: 'Committee members retrieved successfully',
        },
      },
    },
  },
};
