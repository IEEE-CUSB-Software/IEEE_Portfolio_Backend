import { SUCCESS_MESSAGES } from '../../constants/swagger-messages';

const vacancy_example = {
  id: 'v102dadc-0b17-4e83-812b-00103b606a1f',
  title: 'Backend Developer',
  description: 'Develop and maintain backend services.',
  is_open: true,
  created_at: '2025-12-03T10:30:00Z',
  updated_at: '2025-12-03T10:30:00Z',
};

const application_example = {
  id: 'a102dadc-0b17-4e83-812b-00103b606a1f',
  user_id: 'd102dadc-0b17-4e83-812b-00103b606a1f',
  vacancy_id: 'v102dadc-0b17-4e83-812b-00103b606a1f',
  status: 'PENDING',
  extra_data: { why_join: 'I want to learn', portfolio: 'link' },
  created_at: '2025-12-03T10:30:00Z',
  updated_at: '2025-12-03T10:30:00Z',
};

export const admin_create_vacancy_swagger = {
  operation: { 
    summary: 'Create a new vacancy',
    description: 'Admins can create a new vacancy.',
  },
  responses: {
    success: { 
      description: 'Vacancy successfully created.',
      schema: {
        example: {
          data: vacancy_example,
          count: 1,
          message: SUCCESS_MESSAGES.VACANCY_CREATED,
        },
      },
    },
  },
};

export const admin_update_vacancy_swagger = {
  operation: { 
    summary: 'Update a vacancy',
    description: 'Admins can update a vacancy and toggle its is_open status.',
  },
  responses: {
    success: { 
      description: 'Vacancy successfully updated.',
      schema: {
        example: {
          data: vacancy_example,
          count: 1,
          message: SUCCESS_MESSAGES.VACANCY_UPDATED,
        },
      },
    },
  },
};

export const admin_get_vacancies_swagger = {
  operation: { 
    summary: 'Get all vacancies',
    description: 'Admins can get all vacancies, both open and closed. Supports search by title or description.',
  },
  responses: {
    success: { 
      description: 'Vacancies successfully retrieved.',
      schema: {
        example: {
          data: [vacancy_example],
          count: 1,
          message: SUCCESS_MESSAGES.VACANCIES_RETRIEVED,
        },
      },
    },
  },
};

export const admin_get_applications_swagger = {
  operation: { 
    summary: 'Get applications for a specific vacancy',
    description: 'Admins can get a paginated list of applications for a specific vacancy, optionally filtered by date.',
  },
  responses: {
    success: { 
      description: 'Applications successfully retrieved.',
      schema: {
        example: {
          data: [application_example],
          total: 50,
          page: 1,
          limit: 10,
          totalPages: 5,
          message: SUCCESS_MESSAGES.APPLICATIONS_RETRIEVED,
        },
      },
    },
  },
};

export const admin_update_application_status_swagger = {
  operation: { 
    summary: 'Update application status',
    description: 'Admins can update the status of an application (e.g. ACCEPTED, REJECTED).',
  },
  responses: {
    success: { 
      description: 'Application status successfully updated.',
      schema: {
        example: {
          data: {
            ...application_example,
            status: 'ACCEPTED',
          },
          count: 1,
          message: SUCCESS_MESSAGES.APPLICATION_STATUS_UPDATED,
        },
      },
    },
  },
};

export const admin_export_applications_swagger = {
  operation: { 
    summary: 'Export applications as Excel',
    description: 'Admins can export applications for a specific vacancy to an Excel sheet.',
  },
  responses: {
    success: { 
      description: 'Excel file exported successfully.',
      schema: {
        type: 'string',
        format: 'binary',
      },
      headers: {
        'Content-Type': {
          description: 'The MIME type of the file (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)',
          schema: { type: 'string' },
        },
        'Content-Disposition': {
          description: 'Standard header indicating an attachment with a file name',
          schema: { type: 'string' },
        },
      },
    },
  },
};

export const admin_delete_vacancy_swagger = {
  operation: { 
    summary: 'Delete a vacancy',
    description: 'Admins can delete a vacancy and all associated applications.',
  },
  responses: {
    success: { 
      description: 'Vacancy successfully deleted.',
      schema: {
        example: {
          data: { success: true },
          count: 1,
          message: SUCCESS_MESSAGES.VACANCY_DELETED,
        },
      },
    },
  },
};

export const admin_view_application_cv_swagger = {
  operation: { 
    summary: 'View application CV',
    description: 'Stream the CV file directly to the browser.',
  },
  responses: {
    success: { 
      description: 'The CV file buffer.',
      content: {
        'application/pdf': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  },
};
