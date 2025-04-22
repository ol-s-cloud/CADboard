# CNergy Documentation

This directory contains comprehensive documentation for the CNergy platform, organized to track the project's evolution over time.

## Documentation Structure

### Core Documentation
- [Architecture](architecture/README.md) - System design and technical implementation
- [Document Processing](document-processing/README.md) - Information extraction and analysis approach
- [Verification Standards](verification-standards/README.md) - Carbon credit standard implementation details

### Project Management
- [Project Status](project-status/README.md) - Current status and milestone tracking
- [Sprint Records](sprints/README.md) - Sprint planning and retrospectives
- [Change Logs](changelogs/README.md) - Detailed change history
- [Gap Analysis](gap-analysis/README.md) - Identified gaps and improvement plans

### Quality Assurance
- [Audit Frameworks](audit/README.md) - Security and compliance audit procedures
- [Test Frameworks](testing/README.md) - Testing strategies and implementation

### Integration
- [Integration Examples](integrations/README.md) - Examples of platform integrations
- [API Documentation](api/README.md) - API specifications and usage

## Documentation Standards

### Historical Format

Each documentation section maintains historical versions, organized by date:

```
docs/architecture/
  ├── README.md (current version)
  ├── 2025-04-22-initial.md
  ├── 2025-05-15-microservices-update.md
  └── ...
```

### File Naming Convention

Historical document files follow the pattern: `YYYY-MM-DD-brief-description.md`

### Document Header Standard

Each historical document includes a standard header:

```markdown
# [Document Title] - [Date]

**Status**: [Draft/Review/Approved/Superseded]
**Author**: [Author Name]
**Reviewed By**: [Reviewer Names]
**Supersedes**: [Previous Document Reference]
**Superseded By**: [Newer Document Reference]

## Change Summary
[Brief description of changes from previous version]
```

## Updating Documentation

When making significant changes to any documentation:

1. Copy the current version (README.md) to a dated file following the naming convention
2. Update the README.md with new content
3. Add appropriate cross-references between versions
4. Update the Change Logs section
