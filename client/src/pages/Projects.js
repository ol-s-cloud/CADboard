import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // In a real implementation, this would fetch from the API
        // For now, we'll use placeholder data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock projects data
        const mockProjects = [
          {
            _id: '1',
            name: 'Reforestation Project A',
            description: 'Reforestation of degraded land in Region X',
            projectType: 'reforestation',
            status: 'in-progress',
            targetStandard: 'verra',
            estimatedCredits: 5000,
            createdAt: '2023-04-01T12:00:00Z',
            location: {
              country: 'Brazil',
              region: 'Amazon'
            }
          },
          {
            _id: '2',
            name: 'Solar Energy Project B',
            description: 'Grid-connected solar PV installation',
            projectType: 'renewable-energy',
            status: 'draft',
            targetStandard: 'gold-standard',
            estimatedCredits: 8000,
            createdAt: '2023-03-15T10:30:00Z',
            location: {
              country: 'India',
              region: 'Maharashtra'
            }
          },
          {
            _id: '3',
            name: 'Methane Capture Project C',
            description: 'Landfill methane capture and utilization',
            projectType: 'methane-capture',
            status: 'submitted',
            targetStandard: 'verra',
            estimatedCredits: 12000,
            createdAt: '2023-02-20T14:15:00Z',
            location: {
              country: 'Mexico',
              region: 'Jalisco'
            }
          },
          {
            _id: '4',
            name: 'Energy Efficiency Project D',
            description: 'Industrial energy efficiency improvements',
            projectType: 'energy-efficiency',
            status: 'verified',
            targetStandard: 'gold-standard',
            estimatedCredits: 3500,
            createdAt: '2023-01-10T09:45:00Z',
            location: {
              country: 'South Africa',
              region: 'Western Cape'
            }
          },
        ];
        
        setProjects(mockProjects);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewProject = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleEditProject = (projectId) => {
    navigate(`/projects/${projectId}/edit`);
  };

  const handleDeleteProject = (projectId) => {
    // In a real implementation, this would call the API to delete the project
    console.log(`Delete project ${projectId}`);
  };

  const handleGenerateDocuments = (projectId) => {
    navigate(`/generate/${projectId}`);
  };

  const handleCreateProject = () => {
    navigate('/projects/new');
  };

  // Get status color based on project status
  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'in-progress':
        return 'primary';
      case 'submitted':
        return 'warning';
      case 'verified':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) {
    return <Typography>Loading projects...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Projects</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateProject}
        >
          Create New Project
        </Button>
      </Box>
      
      {projects.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You don't have any projects yet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateProject}
          >
            Create your first project
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader aria-label="projects table">
              <TableHead>
                <TableRow>
                  <TableCell>Project Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Target Standard</TableCell>
                  <TableCell>Est. Credits</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((project) => (
                    <TableRow hover key={project._id}>
                      <TableCell component="th" scope="row">
                        {project.name}
                      </TableCell>
                      <TableCell>
                        {project.projectType.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </TableCell>
                      <TableCell>
                        {project.location?.country}, {project.location?.region}
                      </TableCell>
                      <TableCell>
                        {project.targetStandard === 'verra' ? 'Verra (VCS)' : 'Gold Standard'}
                      </TableCell>
                      <TableCell>
                        {project.estimatedCredits?.toLocaleString() || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          color={getStatusColor(project.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View">
                          <IconButton
                            onClick={() => handleViewProject(project._id)}
                            size="small"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleEditProject(project._id)}
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDeleteProject(project._id)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Generate Documents">
                          <IconButton
                            onClick={() => handleGenerateDocuments(project._id)}
                            size="small"
                            color="primary"
                          >
                            <AssignmentIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={projects.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
  );
};

export default Projects;