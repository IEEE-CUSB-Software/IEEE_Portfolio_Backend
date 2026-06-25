export const instructor_example = {
  id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  name: 'Dr. Jane Doe',
  bio: 'Expert in Software Architecture with 10+ years of experience.',
  image_url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
  image_public_id: 'instructors/sample-id',
  created_at: '2026-06-24T12:00:00Z',
  updated_at: '2026-06-24T12:00:00Z',
};

export const workshop_example = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: 'IEEE Web Development Workshop',
  description: 'A comprehensive crash course on modern web development.',
  content: 'HTML, CSS, JavaScript, React, Node.js, Express, and Database basics.',
  location: 'Lab 3, Building C',
  start_time: '2026-04-10T10:00:00Z',
  end_time: '2026-04-10T14:00:00Z',
  capacity: 50,
  registration_deadline: '2026-04-05T23:59:59Z',
  image_url: 'https://res.cloudinary.com/demo/image/upload/sample-workshop.jpg',
  image_public_id: 'workshops-primary/sample-id',
  created_by: '3f0f3f98-7c7b-49b3-b17b-0d7b0d27f9e1',
  created_at: '2026-06-24T12:00:00Z',
  updated_at: '2026-06-24T12:00:00Z',
};

export const workshop_image_example = {
  id: '42f7f383-f8bb-4ef9-908c-197b667b4f80',
  workshop_id: '550e8400-e29b-41d4-a716-446655440000',
  image_url: 'https://res.cloudinary.com/demo/image/upload/sample-gallery.jpg',
  image_public_id: 'workshops/sample-gallery-id',
  sort_order: 0,
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

// Workshops Swagger
export const admin_create_workshop_swagger = {
  operation: {
    summary: 'Create a new workshop',
    description: 'Admins can create a new workshop. Requires title, description, content, times, capacity and location.',
  },
  responses: {
    success: {
      description: 'Workshop created successfully',
      schema: {
        example: {
          data: workshop_example,
          count: 1,
          message: 'Workshop created successfully',
        },
      },
    },
  },
};

export const admin_update_workshop_swagger = {
  operation: {
    summary: 'Update workshop details',
    description: 'Admins can update a workshop details.',
  },
  responses: {
    success: {
      description: 'Workshop updated successfully',
      schema: {
        example: {
          data: workshop_example,
          count: 1,
          message: 'Workshop updated successfully',
        },
      },
    },
  },
};

export const admin_delete_workshop_swagger = {
  operation: {
    summary: 'Delete workshop',
    description: 'Admins can delete a workshop and all its cover/gallery images from storage.',
  },
  responses: {
    success: {
      description: 'Workshop deleted successfully',
      schema: {
        example: {
          data: { success: true },
          count: 1,
          message: 'Workshop deleted successfully',
        },
      },
    },
  },
};

export const admin_upload_primary_workshop_image_swagger = {
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
    summary: 'Upload primary workshop cover image',
    description: 'Upload or replace the cover image of a workshop. Admin only.',
  },
  responses: {
    success: {
      description: 'Workshop cover image uploaded successfully',
      schema: {
        example: {
          data: workshop_example,
          count: 1,
          message: 'Image uploaded successfully',
        },
      },
    },
  },
};

export const admin_delete_primary_workshop_image_swagger = {
  operation: {
    summary: 'Delete primary workshop cover image',
    description: 'Delete only the cover image of a workshop. Admin only.',
  },
  responses: {
    success: {
      description: 'Workshop cover image deleted successfully',
      schema: {
        example: {
          data: {
            ...workshop_example,
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

export const admin_upload_workshop_images_swagger = {
  body: {
    schema: {
      type: 'object',
      required: ['images'],
      properties: {
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  },
  operation: {
    summary: 'Upload workshop gallery images',
    description: 'Upload one or more gallery images for a workshop. Admin only.',
  },
  responses: {
    success: {
      description: 'Workshop gallery images uploaded successfully',
      schema: {
        example: {
          data: [workshop_image_example],
          count: 1,
          message: 'Images uploaded successfully',
        },
      },
    },
  },
};

export const admin_delete_workshop_image_swagger = {
  operation: {
    summary: 'Delete workshop gallery image',
    description: 'Delete a single gallery image from the workshop by its image ID. Admin only.',
  },
  responses: {
    success: {
      description: 'Workshop gallery image deleted successfully',
      schema: {
        example: {
          data: { success: true },
          count: 1,
          message: 'Image deleted successfully',
        },
      },
    },
  },
};

export const workshop_registration_example = {
  id: 'b6a7b810-9dad-4c92-91a1-98e32ccaa999',
  user_id: '3f0f3f98-7c7b-49b3-b17b-0d7b0d27f9e1',
  workshop_id: '550e8400-e29b-41d4-a716-446655440000',
  status: 'pending',
  created_at: '2026-06-24T12:00:00Z',
  updated_at: '2026-06-24T12:00:00Z',
  user: {
    id: '3f0f3f98-7c7b-49b3-b17b-0d7b0d27f9e1',
    name: 'Visitor Name',
    email: 'visitor@ieee.org',
  },
};

export const admin_get_workshop_registrations_swagger = {
  operation: {
    summary: 'Get workshop registrations',
    description: 'Admins can view all registrations (pending, accepted, rejected, cancelled, attended) for a specific workshop.',
  },
  responses: {
    success: {
      description: 'Workshop registrations retrieved successfully',
      schema: {
        example: {
          data: [workshop_registration_example],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      },
    },
  },
};

export const admin_update_workshop_registration_status_swagger = {
  operation: {
    summary: 'Update workshop registration status',
    description: 'Admins can approve (accept) or reject a registration request. Capacity constraints are validated when status changes to accepted.',
  },
  responses: {
    success: {
      description: 'Registration status updated successfully',
      schema: {
        example: {
          data: {
            ...workshop_registration_example,
            status: 'accepted',
          },
          count: 1,
          message: 'Workshop registration status updated successfully',
        },
      },
    },
  },
};

export const admin_bulk_register_workshop_swagger = {
  operation: {
    summary: 'Bulk register users to workshop',
    description: 'Admins can register multiple users to a workshop. Registered users will have their status set to ACCEPTED automatically. This bulk flow does not re-check workshop capacity, so it may accept users even when the workshop is already full.',
  },
  responses: {
    success: {
      description: 'Users registered successfully',
      schema: {
        example: {
          data: [
            {
              ...workshop_registration_example,
              status: 'accepted',
            },
          ],
          count: 1,
          message: 'Users registered successfully',
        },
      },
    },
  },
};
