import { instructor_example } from 'src/admin/workshops/admin-workshops.swagger';

export const get_all_instructors_swagger = {
  operation: {
    summary: 'Get all instructors',
    description: 'Retrieve a list of all instructors in the directory.',
  },
  responses: {
    success: {
      description: 'Instructors retrieved successfully',
      schema: {
        example: {
          data: [instructor_example],
          count: 1,
          message: 'Success',
        },
      },
    },
  },
};

export const get_instructor_by_id_swagger = {
  operation: {
    summary: 'Get instructor by ID',
    description: 'Retrieve detailed information of a specific instructor, including their associated workshops.',
  },
  responses: {
    success: {
      description: 'Instructor retrieved successfully',
      schema: {
        example: {
          data: {
            ...instructor_example,
            workshops: [],
          },
          count: 1,
          message: 'Success',
        },
      },
    },
  },
};
