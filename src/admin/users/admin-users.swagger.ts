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

export const admin_delete_user_swagger = {
  operation: {
    summary: 'Delete user',
    description: 'Admins can delete a user account and all associated data.',
  },

  responses: {
    success: {
      description: 'User deleted successfully',
      schema: {
        example: {
          data: {
            id: user_example.id,
          },
          count: 1,
          message: 'User deleted successfully',
        },
      },
    },
  },
};
