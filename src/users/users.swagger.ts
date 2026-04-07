const user_example = {
  id: 'd102dadc-0b17-4e83-812b-00103b606a1f',
  name: 'Ali Said',
  email: 'asaszizg1@gmail.com',
  phone: '+201001234567',
  image_url: 'https://example.com/images/AliSaid.jpg',
  bio: 'Computer Science student interested in AI and web development',
  faculty: 'Faculty of Engineering',
  university: 'Cairo University',
  academic_year: 3,
  major: 'Computer Engineering',
  role_id: '550e8400-e29b-41d4-a716-446655440000',
  created_at: '2025-12-03T10:30:00Z',
  updated_at: '2025-12-03T10:30:00Z',
};

export const get_user_by_id_swagger = {
  operation: {
    summary: 'Get user by ID',
    description: 'Retrieve a specific user by their unique ID.',
  },

  responses: {
    success: {
      description: 'User retrieved successfully',
      schema: {
        example: {
          data: {
            ...user_example,
          },
          count: 1,
          message: 'User retrieved successfully',
        },
      },
    },
  },
};

export const update_user_swagger = {
  operation: {
    summary: 'Update user',
    description: 'Update user profile information and details.',
  },

  responses: {
    success: {
      description: 'User updated successfully',
      schema: {
        example: {
          data: {
            ...user_example,
            updated_at: '2025-12-03T15:45:00Z',
          },
          count: 1,
          message: 'User updated successfully',
        },
      },
    },
  },
};

export const upload_user_image_swagger = {
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
    summary: 'Upload user image',
    description: 'Upload or replace user image. User can only upload own image.',
  },
  responses: {
    success: {
      description: 'User image uploaded successfully',
      schema: {
        example: {
          data: {
            ...user_example,
            image_url: 'https://example.com/images/AliSaid.jpg',
            image_public_id: 'users/images/ali-said',
          },
          count: 1,
          message: 'Image uploaded successfully',
        },
      },
    },
  },
};

export const delete_user_image_swagger = {
  operation: {
    summary: 'Delete user image',
    description: 'Delete user image only without deleting user account.',
  },
  responses: {
    success: {
      description: 'User image deleted successfully',
      schema: {
        example: {
          data: {
            ...user_example,
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
