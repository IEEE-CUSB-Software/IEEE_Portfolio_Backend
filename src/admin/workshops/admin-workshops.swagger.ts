export const instructor_example = {
  id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  name: 'Dr. Jane Doe',
  bio: 'Expert in Software Architecture with 10+ years of experience.',
  image_url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
  image_public_id: 'instructors/sample-id',
  created_at: '2026-06-24T12:00:00Z',
  updated_at: '2026-06-24T12:00:00Z',
};

export const admin_create_instructor_swagger = {
  operation: {
    summary: 'Create a new instructor',
    description: 'Admins can create a new instructor profile.',
  },
  responses: {
    success: {
      description: 'Instructor created successfully',
      schema: {
        example: {
          data: instructor_example,
          count: 1,
          message: 'Instructor created successfully',
        },
      },
    },
  },
};

export const admin_update_instructor_swagger = {
  operation: {
    summary: 'Update instructor details',
    description: 'Admins can update an instructor profile description or name.',
  },
  responses: {
    success: {
      description: 'Instructor updated successfully',
      schema: {
        example: {
          data: {
            ...instructor_example,
            bio: 'Updated bio for Jane Doe',
          },
          count: 1,
          message: 'Instructor updated successfully',
        },
      },
    },
  },
};

export const admin_delete_instructor_swagger = {
  operation: {
    summary: 'Delete instructor',
    description: 'Admins can delete an instructor profile.',
  },
  responses: {
    success: {
      description: 'Instructor deleted successfully',
      schema: {
        example: {
          data: { success: true },
          count: 1,
          message: 'Instructor deleted successfully',
        },
      },
    },
  },
};

export const admin_upload_instructor_image_swagger = {
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
    summary: 'Upload instructor avatar image',
    description: 'Upload or replace the profile picture of an instructor. Admin only.',
  },
  responses: {
    success: {
      description: 'Instructor image uploaded successfully',
      schema: {
        example: {
          data: instructor_example,
          count: 1,
          message: 'Image uploaded successfully',
        },
      },
    },
  },
};

export const admin_delete_instructor_image_swagger = {
  operation: {
    summary: 'Delete instructor avatar image',
    description: 'Delete only the profile picture of an instructor. Admin only.',
  },
  responses: {
    success: {
      description: 'Instructor image deleted successfully',
      schema: {
        example: {
          data: {
            ...instructor_example,
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
