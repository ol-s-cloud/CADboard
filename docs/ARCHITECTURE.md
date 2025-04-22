# CNergy Platform Architecture

This document outlines the technical architecture of the CNergy platform, explaining the system design, component interactions, and technology choices.

## System Architecture Overview

CNergy follows a microservices-based architecture designed for scalability, maintainability, and extensibility. The platform is structured into several logical layers:

![CNergy Architecture Diagram]

```
┌───────────────────────────────────────────────────────────────────────┐
│                           User Interface Layer                         │
└───────────────┬───────────────────────────────────────┬───────────────┘
                │                                       │
┌───────────────▼───────────────┐       ┌───────────────▼───────────────┐
│        API Gateway Layer      │       │    Authentication Service      │
└───────────────┬───────────────┘       └───────────────────────────────┘
                │
┌───────────────┼───────────────┬───────────────┬───────────────┐
│               │               │               │               │
▼               ▼               ▼               ▼               ▼
┌─────────┐ ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ Project │ │Document │   │Document │   │   NLP   │   │Workflow │
│ Service │ │ Storage │   │Generator│   │ Service │   │ Service │
└─────────┘ └─────────┘   └─────────┘   └─────────┘   └─────────┘
     │           │             │             │             │
     └───────────┴─────────────┴─────────────┴─────────────┘
                               │
                  ┌────────────▼────────────┐
                  │        Data Layer        │
                  └─────────────────────────┘
```

## Layer Descriptions

### 1. User Interface Layer

The frontend of CNergy is built with React and provides the user-facing interfaces for:

- Project management and creation
- Document uploading and processing
- Generated document review and editing
- Workflow monitoring and management

**Key Technologies:**
- React.js with TypeScript for type safety
- Material UI for consistent design language
- React Query for data fetching and state management
- Formik for complex form handling
- Recharts for data visualization

**Implementation Pattern:**
```javascript
// Component structure example
function ProjectDashboard() {
  // Data fetching with React Query
  const { data: projects, isLoading } = useQuery('projects', fetchProjects);
  
  // State management for user interactions
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Component rendering with conditional states
  return (
    <DashboardLayout>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ProjectList 
          projects={projects}
          onSelectProject={setSelectedProject}
        />
      )}
      
      {selectedProject && (
        <ProjectDetails project={selectedProject} />
      )}
    </DashboardLayout>
  );
}
```

### 2. API Gateway Layer

The API Gateway serves as the entry point for all client requests, handling:

- Request routing to appropriate microservices
- Request/response transformation
- API documentation via OpenAPI
- Rate limiting and monitoring

**Key Technologies:**
- Express.js for API framework
- Swagger/OpenAPI for documentation
- JWT for authentication token validation

**Implementation Pattern:**
```javascript
// API Gateway route example
app.use('/api/projects', authenticate, async (req, res, next) => {
  try {
    // Route to Project Service
    const serviceResponse = await axios.get(
      `${PROJECT_SERVICE_URL}/projects`, 
      { headers: { 'x-user-id': req.user.id } }
    );
    
    // Transform response if needed
    res.json(serviceResponse.data);
  } catch (error) {
    next(error);
  }
});
```

### 3. Authentication Service

Handles user authentication, authorization, and account management:

- User registration and login
- JWT token generation and validation
- Role-based access control
- Profile management

**Key Technologies:**
- Node.js with Express
- JWT for token-based authentication
- bcrypt for password hashing
- Redis for token blacklisting

**Implementation Pattern:**
```javascript
// Authentication controller example
async function login(req, res) {
  const { email, password } = req.body;
  
  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
}
```

### 4. Project Service

Manages all aspects of carbon projects:

- Project creation and management
- Project metadata and configuration
- Project version control
- Access control and sharing

**Key Technologies:**
- Node.js with Express
- MongoDB for flexible document storage
- Mongoose for object modeling

**Implementation Pattern:**
```javascript
// Project model example
const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  projectType: {
    type: String,
    enum: ['afforestation', 'reforestation', 'renewable-energy', 'methane-capture', 'energy-efficiency', 'other'],
    required: true
  },
  location: {
    country: String,
    region: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  targetStandard: {
    type: String,
    enum: ['verra', 'gold-standard', 'acr', 'car', 'other'],
    required: true
  },
  methodologyId: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],
      default: 'viewer'
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'in-progress', 'submitted', 'verified'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
```

### 5. Document Storage Service

Handles document management and storage:

- Secure document upload and storage
- Document version control
- Document metadata management
- Access control and sharing

**Key Technologies:**
- Node.js with Express
- AWS S3 or compatible object storage
- MongoDB for metadata storage
- Multer for file upload handling

**Implementation Pattern:**
```javascript
// Document upload controller example
async function uploadDocument(req, res) {
  try {
    // Get uploaded file from multer
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Upload to S3
    const s3Result = await s3Client.upload({
      Bucket: process.env.S3_BUCKET,
      Key: `projects/${req.params.projectId}/documents/${uuidv4()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype
    }).promise();
    
    // Create document record in database
    const document = new Document({
      name: file.originalname,
      description: req.body.description,
      projectId: req.params.projectId,
      fileType: file.mimetype,
      fileSize: file.size,
      filePath: s3Result.Location,
      uploadedBy: req.user.id,
      documentType: req.body.documentType
    });
    
    await document.save();
    
    // Submit for processing if requested
    if (req.body.processImmediately === 'true') {
      // Add to document processing queue
      await documentProcessingQueue.add({
        documentId: document._id,
        projectId: req.params.projectId
      });
    }
    
    res.json(document);
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ message: 'Error uploading document' });
  }
}
```

### 6. NLP Service

Provides natural language processing capabilities for document analysis:

- Document text extraction
- Entity recognition for project information
- Document classification
- Semantic understanding of methodology requirements

**Key Technologies:**
- Node.js or Python service
- TensorFlow.js or PyTorch for ML models
- Natural.js for basic NLP tasks
- Custom trained models for domain-specific tasks

**Implementation Pattern:**
```javascript
// Document text extraction and entity recognition
async function processDocument(req, res) {
  try {
    const { documentId } = req.params;
    
    // Get document metadata
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Download document from storage
    const fileContent = await downloadFileFromStorage(document.filePath);
    
    // Extract text based on file type
    let extractedText;
    if (document.fileType === 'application/pdf') {
      extractedText = await extractTextFromPDF(fileContent);
    } else if (document.fileType.includes('word')) {
      extractedText = await extractTextFromDOCX(fileContent);
    } else {
      // Handle other formats or return error
      return res.status(400).json({ message: 'Unsupported file format' });
    }
    
    // Perform entity recognition
    const entities = await recognizeEntities(extractedText);
    
    // Update document with extracted information
    document.extractedData = {
      entities,
      text: extractedText.substring(0, 1000) // Store preview text
    };
    
    await document.save();
    
    // Return processed results
    res.json({
      documentId,
      extractedData: document.extractedData
    });
  } catch (error) {
    console.error('Error processing document:', error);
    res.status(500).json({ message: 'Error processing document' });
  }
}
```

### 7. Document Generator Service

Creates standardized documentation based on project information:

- Template-based document generation
- Standard-specific document formatting
- Document versioning and history
- Validation against standard requirements

**Key Technologies:**
- Node.js with Express
- Template engine (custom or Handlebars-based)
- DocxTemplater or similar for DOCX generation
- PDF-lib for PDF generation

**Implementation Pattern:**
```javascript
// Document generation controller
async function generateDocument(req, res) {
  try {
    const { projectId } = req.params;
    const { documentType, standard, version } = req.body;
    
    // Get project data
    const project = await Project.findById(projectId)
      .populate('documents')
      .populate('owner');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Get appropriate template
    const template = await getTemplate(standard, documentType);
    if (!template) {
      return res.status(400).json({ message: 'Template not found' });
    }
    
    // Prepare data for template
    const templateData = await prepareTemplateData(project, standard, documentType);
    
    // Validate data against template requirements
    const validationResult = validateDataForTemplate(templateData, template);
    if (!validationResult.isValid) {
      return res.status(400).json({ 
        message: 'Insufficient project data for document generation',
        missingFields: validationResult.missingFields
      });
    }
    
    // Generate document
    const generatedDocument = await generateDocumentFromTemplate(template, templateData);
    
    // Save to storage
    const filename = `${project.name.replace(/\s+/g, '_')}_${documentType}_${version}.docx`;
    const s3Result = await s3Client.upload({
      Bucket: process.env.S3_BUCKET,
      Key: `projects/${projectId}/generated/${filename}`,
      Body: generatedDocument,
      ContentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }).promise();
    
    // Create document record
    const newDocument = new GeneratedDocument({
      name: filename,
      projectId,
      documentType,
      standard,
      version,
      filePath: s3Result.Location,
      status: 'draft'
    });
    
    await newDocument.save();
    
    // Add to project's generated documents
    project.generatedDocuments.push(newDocument._id);
    await project.save();
    
    res.json(newDocument);
  } catch (error) {
    console.error('Error generating document:', error);
    res.status(500).json({ message: 'Error generating document' });
  }
}
```

### 8. Workflow Service

Manages the carbon credit verification workflow:

- Status tracking for projects and documents
- Task management and assignments
- Notification generation
- Timeline and milestone tracking

**Key Technologies:**
- Node.js with Express
- State machine implementation for workflow states
- Redis for pub/sub notifications
- MongoDB for persistent state storage

**Implementation Pattern:**
```javascript
// Workflow state machine example
const workflowStates = {
  draft: {
    name: 'Draft',
    allowedTransitions: ['in-progress'],
    requiredDocuments: [] // No required docs for draft state
  },
  'in-progress': {
    name: 'In Progress',
    allowedTransitions: ['submitted', 'draft'],
    requiredDocuments: ['project-design-document'] // PDD required to move to in-progress
  },
  submitted: {
    name: 'Submitted for Validation',
    allowedTransitions: ['in-progress', 'validated'],
    requiredDocuments: ['project-design-document', 'supporting-documentation']
  },
  validated: {
    name: 'Validated',
    allowedTransitions: ['registered'],
    requiredDocuments: ['validation-report']
  },
  registered: {
    name: 'Registered',
    allowedTransitions: ['monitoring'],
    requiredDocuments: ['registration-proof']
  },
  monitoring: {
    name: 'Monitoring',
    allowedTransitions: ['verification'],
    requiredDocuments: ['monitoring-report']
  },
  verification: {
    name: 'Under Verification',
    allowedTransitions: ['verified', 'monitoring'],
    requiredDocuments: ['verification-report']
  },
  verified: {
    name: 'Verified',
    allowedTransitions: ['issuance', 'monitoring'],
    requiredDocuments: ['verification-statement']
  },
  issuance: {
    name: 'Issuance Requested',
    allowedTransitions: ['issued', 'verified'],
    requiredDocuments: ['issuance-request']
  },
  issued: {
    name: 'Credits Issued',
    allowedTransitions: ['monitoring'],
    requiredDocuments: ['issuance-confirmation']
  }
};

// Workflow transition controller
async function transitionProjectStatus(req, res) {
  try {
    const { projectId } = req.params;
    const { newStatus, comment } = req.body;
    
    // Get project
    const project = await Project.findById(projectId)
      .populate('documents');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if transition is allowed
    const currentState = workflowStates[project.status];
    if (!currentState.allowedTransitions.includes(newStatus)) {
      return res.status(400).json({ 
        message: `Cannot transition from ${project.status} to ${newStatus}` 
      });
    }
    
    // Check if required documents exist
    const targetState = workflowStates[newStatus];
    const missingDocuments = [];
    
    for (const requiredDoc of targetState.requiredDocuments) {
      const hasDocument = project.documents.some(doc => doc.documentType === requiredDoc);
      if (!hasDocument) {
        missingDocuments.push(requiredDoc);
      }
    }
    
    if (missingDocuments.length > 0) {
      return res.status(400).json({
        message: 'Missing required documents for this transition',
        missingDocuments
      });
    }
    
    // Update project status
    project.status = newStatus;
    project.statusHistory.push({
      status: newStatus,
      timestamp: new Date(),
      updatedBy: req.user.id,
      comment
    });
    
    await project.save();
    
    // Create notification
    await createNotification({
      type: 'status-change',
      projectId,
      userId: project.owner,
      message: `Project status changed to ${workflowStates[newStatus].name}`,
      data: { newStatus, previousStatus: currentState.name }
    });
    
    res.json({
      status: project.status,
      statusHistory: project.statusHistory
    });
  } catch (error) {
    console.error('Error transitioning project status:', error);
    res.status(500).json({ message: 'Error updating project status' });
  }
}
```

### 9. Data Layer

Provides persistent storage for all platform data:

- Document database for flexible schema storage
- Relational database for structured data
- Object storage for document files
- Cache for performance optimization

**Key Technologies:**
- MongoDB for document storage
- PostgreSQL for relational data (optional)
- Amazon S3 or compatible object storage
- Redis for caching and queues

## Cross-Cutting Concerns

### 1. Security

Security measures implemented across all layers:

- HTTPS for all communications
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Document encryption at rest
- Regular security audits

### 2. Logging and Monitoring

Comprehensive logging and monitoring:

- Centralized logging with ELK stack
- Application performance monitoring
- User activity auditing
- Error tracking and alerting
- Usage analytics

### 3. Error Handling

Robust error handling strategy:

- Standardized error responses
- Detailed internal logging
- Graceful degradation
- User-friendly error messages
- Automatic retry for transient failures

## Deployment Architecture

CNergy is deployed using containerization for consistency and scalability:

- Docker containers for all services
- Kubernetes for orchestration
- Helm charts for deployment management
- CI/CD pipeline for automated testing and deployment
- Multiple environment support (dev, staging, production)

## Scalability Considerations

The architecture is designed to scale with growing usage:

- Stateless microservices for horizontal scaling
- Database sharding for data growth
- CDN for static content delivery
- Load balancing across service instances
- Caching strategy for frequent operations

## Future Architectural Enhancements

Planned enhancements to the architecture:

1. **AI-Powered Document Analysis**: Enhanced ML capabilities for deeper document understanding
2. **Blockchain Integration**: Optional blockchain verification of document authenticity and timeline
3. **Real-time Collaboration**: WebSocket-based collaboration features for multi-user editing
4. **Advanced Analytics**: Business intelligence dashboard for carbon project insights
5. **API Marketplace**: Extensibility through third-party API integrations and plugins

## Conclusion

The CNergy platform architecture is designed with scalability, maintainability, and security at its core. The microservices approach allows for independent scaling and development of system components, while the comprehensive security and monitoring ensure reliable operation.

The modular design enables the addition of new carbon credit standards and methodologies without significant architectural changes, positioning CNergy as an adaptable solution for the evolving carbon market.
