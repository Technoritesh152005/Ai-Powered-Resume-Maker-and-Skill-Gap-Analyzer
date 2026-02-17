module.exports = {
    // User roles
    ROLES: {
      USER: 'user',
      ADMIN: 'admin',
    },
  
    // File types
    FILE_TYPES: {
      PDF: 'application/pdf',
      DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      TXT: 'text/plain',
    },
  
    // Analysis status
    ANALYSIS_STATUS: {
      PENDING: 'pending',
      PROCESSING: 'processing',
      COMPLETED: 'completed',
      FAILED: 'failed',
    },
  
    // Job role categories
    JOB_CATEGORIES: {
      SOFTWARE_ENGINEERING: 'Software Engineering',
      DATA_SCIENCE: 'Data Science',
      PRODUCT: 'Product',
      DESIGN: 'Design',
      MARKETING: 'Marketing',
      BUSINESS: 'Business',
    },
  
    // Experience levels
    EXPERIENCE_LEVELS: {
      ENTRY: 'Entry Level',
      MID: 'Mid Level',
      SENIOR: 'Senior Level',
      LEAD: 'Lead/Principal',
    },
  
    // Skill gap categories
    GAP_CATEGORIES: {
      CRITICAL: 'critical',
      IMPORTANT: 'important',
      NICE_TO_HAVE: 'nice-to-have',
    },
  
    // Learning resource types
    RESOURCE_TYPES: {
      COURSE: 'course',
      BOOK: 'book',
      TUTORIAL: 'tutorial',
      PROJECT: 'project',
      CERTIFICATION: 'certification',
      DOCUMENTATION: 'documentation',
    },
  
    // Cache TTL (in seconds)
    CACHE_TTL: {
      SHORT: 300,        // 5 minutes
      MEDIUM: 1800,      // 30 minutes
      LONG: 3600,        // 1 hour
      VERY_LONG: 86400,  // 24 hours
    },
  
    // Pagination
    PAGINATION: {
      DEFAULT_PAGE: 1,
      DEFAULT_LIMIT: 10,
      MAX_LIMIT: 100,
    },
  };