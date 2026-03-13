const committee_example = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Robotics Committee',
  about:
    'The Robotics Committee focuses on building autonomous robots and promoting robotics education.',
  category_id: '3f0f3f98-7c7b-49b3-b17b-0d7b0d27f9e1',
  category: {
    id: '3f0f3f98-7c7b-49b3-b17b-0d7b0d27f9e1',
    name: 'Technical',
    description: 'Technical committees focused on engineering and technology',
  },
  created_at: '2026-02-04T10:00:00Z',
  updated_at: '2026-02-04T10:00:00Z',
};

const committee_with_members_example = {
  ...committee_example,
  members: [
    {
      id: 'b6a7b810-9dad-4c92-91a1-98e32ccaa999',
      committee_id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Jane Smith',
      email: 'jane.smith@ieee.org',
      role: 'head',
      image_url: 'https://example.com/images/jane-smith.jpg',
      created_at: '2026-02-04T10:00:00Z',
      updated_at: '2026-02-04T10:00:00Z',
    },
  ],
};

export const get_all_committees_swagger = {
  operation: {
    summary: 'Get all committees',
    description:
      'Retrieve all committees with their category. Optionally filter by category_id query parameter.',
  },
  responses: {
    success: {
      description: 'Committees retrieved successfully',
      schema: {
        example: {
          data: {
            committees: [committee_example],
            count: 1,
          },
          count: 1,
          message: 'Committees retrieved successfully',
        },
      },
    },
  },
};

export const get_committee_by_id_swagger = {
  operation: {
    summary: 'Get committee by ID',
    description:
      'Retrieve a specific committee by ID with category and members included.',
  },
  responses: {
    success: {
      description: 'Committee retrieved successfully',
      schema: {
        example: {
          data: committee_with_members_example,
          count: 1,
          message: 'Committee retrieved successfully',
        },
      },
    },
  },
};
