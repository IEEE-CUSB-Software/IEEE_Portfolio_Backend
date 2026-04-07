const user_example = {
  id: 'd102dadc-0b17-4e83-812b-00103b606a1f',
  name: 'Ali Said',
  email: 'asaszizg1@gmail.com',
  phone: '+201001234567',
  avatar_url: 'https://example.com/avatars/AliSaid.jpg',
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

export const upload_user_avatar_swagger = {
  body: {
    schema: {
      type: 'object',
      required: ['avatar'],
      properties: {
        avatar: { type: 'string', format: 'binary' },
      },
    },
  },
  operation: {
    summary: 'Upload user avatar',
    description: 'Upload or replace user avatar. User can only upload own avatar.',
  },
  responses: {
    success: {
      description: 'User avatar uploaded successfully',
      schema: {
        example: {
          data: {
            ...user_example,
            avatar_url: 'https://example.com/avatars/AliSaid.jpg',
            avatar_public_id: 'users/avatars/ali-said',
          },
          count: 1,
          message: 'Image uploaded successfully',
        },
      },
    },
  },
};

export const delete_user_avatar_swagger = {
  operation: {
    summary: 'Delete user avatar',
    description: 'Delete user avatar only without deleting user account.',
  },
  responses: {
    success: {
      description: 'User avatar deleted successfully',
      schema: {
        example: {
          data: {
            ...user_example,
            avatar_url: null,
            avatar_public_id: null,
          },
          count: 1,
          message: 'Image deleted successfully',
        },
      },
    },
  },
};
