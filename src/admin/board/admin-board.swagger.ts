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

export const admin_create_board_member_swagger = {
  operation: {
    summary: 'Create board member',
    description: 'Create a new board member. Admin only.',
  },
  responses: {
    success: {
      description: 'Board member created successfully',
      schema: {
        example: {
          data: board_member_example,
          count: 1,
          message: 'Board member created successfully',
        },
      },
    },
  },
};

export const admin_update_board_member_swagger = {
  operation: {
    summary: 'Update board member',
    description: 'Update an existing board member. Admin only.',
  },
  responses: {
    success: {
      description: 'Board member updated successfully',
      schema: {
        example: {
          data: board_member_example,
          count: 1,
          message: 'Board member updated successfully',
        },
      },
    },
  },
};

export const admin_delete_board_member_swagger = {
  operation: {
    summary: 'Delete board member',
    description: 'Delete a board member. Admin only.',
  },
  responses: {
    success: {
      description: 'Board member deleted successfully',
      schema: {
        example: {
          data: { message: 'Board member deleted successfully' },
          count: 1,
          message: 'Board member deleted successfully',
        },
      },
    },
  },
};

export const admin_upload_board_member_image_swagger = {
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
    summary: 'Upload board member image',
    description:
      'Upload or replace board member image by board member id. Admin only.',
  },
  responses: {
    success: {
      description: 'Board member image uploaded successfully',
      schema: {
        example: {
          data: {
            ...board_member_example,
            image_url: 'https://example.com/images/john-doe.jpg',
          },
          count: 1,
          message: 'Image uploaded successfully',
        },
      },
    },
  },
};

export const admin_delete_board_member_image_swagger = {
  operation: {
    summary: 'Delete board member image',
    description:
      'Delete board member image only without deleting the board member. Admin only.',
  },
  responses: {
    success: {
      description: 'Board member image deleted successfully',
      schema: {
        example: {
          data: {
            ...board_member_example,
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
