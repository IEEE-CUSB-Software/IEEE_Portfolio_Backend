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

export const admin_create_committee_member_swagger = {
  operation: {
    summary: 'Create committee member',
    description: 'Create a new committee member. Admin only.',
  },
  responses: {
    success: {
      description: 'Committee member created successfully',
      schema: {
        example: {
          data: committee_member_example,
          count: 1,
          message: 'Committee member created successfully',
        },
      },
    },
  },
};

export const admin_update_committee_member_swagger = {
  operation: {
    summary: 'Update committee member',
    description: 'Update an existing committee member. Admin only.',
  },
  responses: {
    success: {
      description: 'Committee member updated successfully',
      schema: {
        example: {
          data: committee_member_example,
          count: 1,
          message: 'Committee member updated successfully',
        },
      },
    },
  },
};

export const admin_delete_committee_member_swagger = {
  operation: {
    summary: 'Delete committee member',
    description: 'Delete a committee member. Admin only.',
  },
  responses: {
    success: {
      description: 'Committee member deleted successfully',
      schema: {
        example: {
          data: { message: 'Committee member deleted successfully' },
          count: 1,
          message: 'Committee member deleted successfully',
        },
      },
    },
  },
};

export const admin_upload_committee_member_image_swagger = {
  body: {
    schema: {
      type: 'object',
      required: ['image'],
      properties: {
        image: { type: 'string', format: 'binary' },
      },
    },
  },
  operation: {
    summary: 'Upload committee member image',
    description:
      'Upload or replace committee member image by member id. Admin only.',
  },
  responses: {
    success: {
      description: 'Committee member image uploaded successfully',
      schema: {
        example: {
          data: {
            ...committee_member_example,
            image_url: 'https://example.com/images/jane-smith.jpg',
          },
          count: 1,
          message: 'Image uploaded successfully',
        },
      },
    },
  },
};

export const admin_delete_committee_member_image_swagger = {
  operation: {
    summary: 'Delete committee member image',
    description:
      'Delete committee member image only without deleting the member. Admin only.',
  },
  responses: {
    success: {
      description: 'Committee member image deleted successfully',
      schema: {
        example: {
          data: {
            ...committee_member_example,
            image_url: null,
            image_public_id: null,
          },
          count: 1,
          message: 'Image deleted successfully',
        },
      },
    },
  },
};
