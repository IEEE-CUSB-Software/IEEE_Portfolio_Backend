// admin-users.swagger.ts
import { RoleName } from 'src/roles/entities/role.entity';

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

export const admin_download_cv_swagger = {
  operation: {
    summary: 'Download user CV (Admin)',
    description:
      "Admin endpoint to download a specific user's CV binary file directly by their user ID.",
  },
  responses: {
    success: {
      description: 'File downloaded successfully',
      schema: {
        type: 'string',
        format: 'binary',
      },
      headers: {
        'Content-Type': {
          description: 'The MIME type of the file (e.g., application/pdf)',
          schema: { type: 'string' },
        },
        'Content-Disposition': {
          description:
            'Standard header indicating an attachment with a file name',
          schema: { type: 'string' },
        },
        'X-User-Name': {
          description: 'The name of the user who owns the CV',
          schema: { type: 'string' },
        },
        'X-User-Email': {
          description: 'The email of the user who owns the CV',
          schema: { type: 'string' },
        },
      },
    },
  },
};

export const admin_get_all_users_swagger = {
  operation: {
    summary: 'Get all users (Paginated)',
    description:
      'Admins can retrieve a paginated list of all registered users. Supports search by name, and filtering by email or username.',
  },
  responses: {
    success: {
      description: 'Users retrieved successfully',
      schema: {
        example: {
          data: [user_example],
          meta: {
            total: 50,
            page: 1,
            limit: 10,
            totalPages: 5,
          },
          message: 'Users retrieved successfully',
        },
      },
    },
  },
};

export const admin_get_user_swagger = {
  operation: {
    summary: 'Get specific user details',
    description:
      'Admins can retrieve a specific user by ID along with all their related data (foreign keys loaded).',
  },
  responses: {
    success: {
      description: 'User retrieved successfully',
      schema: {
        example: {
          data: {
            ...user_example,
            role: {
              id: '550e8400-e29b-41d4-a716-446655440000',
              name: 'Visitor',
            },
          },
          message: 'User retrieved successfully',
        },
      },
    },
  },
};

export const admin_update_user_role_swagger = {
  operation: {
    summary: 'Update user role (Super Admin only)',
    description: 'Super Admins can update the role of a user.',
  },
  responses: {
    success: {
      description: 'User role updated successfully',
      schema: {
        example: {
          data: {
            ...user_example,
            role: {
              id: '550e8400-e29b-41d4-a716-446655440000',
              name: RoleName.ADMIN,
            },
          },
          message: 'User role updated successfully',
        },
      },
    },
  },
};
