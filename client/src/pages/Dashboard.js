import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
} from '@mui/material';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    documentsGenerated: 0,
    creditsEstimated: 0,
    projectsInProgress: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real implementation, this would fetch actual data from the API
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
          },
        ];
        
        setProjects(mockProjects);
        
        // Mock dashboard statistics
        setStats({
          totalProjects: mockProjects.length,
          documentsGenerated: 3,
          creditsEstimated: mockProjects.reduce((total, p) => total + (p.estimatedCredits || 0), 0),
          projectsInProgress: mockProjects.filter(p => p.status === 'in-progress').length,
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleViewProject = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleCreateProject = () => {
    navigate('/projects/new');
  };

  if (loading) {
    return <Typography>Loading dashboard data...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Typography variant="h6" sx={{ mb: 2 }}>
        Welcome, {user?.name || 'User'}!
      </Typography>
      
      {/* Stats overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: '#e8f5e9',
            }}
          >
            <Typography variant="h6">Total Projects</Typography>
            <Typography variant="h3">{stats.totalProjects}</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: '#e3f2fd',
            }}
          >
            <Typography variant="h6">Documents Generated</Typography>
            <Typography variant="h3">{stats.documentsGenerated}</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: '#f1f8e9',
            }}
          >
            <Typography variant="h6">Estimated Credits</Typography>
            <Typography variant="h3">{stats.creditsEstimated.toLocaleString()}</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: '#fce4ec',
            }}
          >
            <Typography variant="h6">Projects In Progress</Typography>
            <Typography variant="h3">{stats.projectsInProgress}</Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Recent projects */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Recent Projects
      </Typography>
      
      {projects.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You don't have any projects yet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateProject}
          >
            Create your first project
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} md={6} key={project._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {project.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {project.description}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" display="block">
                        Project Type:
                      </Typography>
                      <Typography variant="body2">
                        {project.projectType.charAt(0).toUpperCase() + project.projectType.slice(1)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" display="block">
                        Target Standard:
                      </Typography>
                      <Typography variant="body2">
                        {project.targetStandard === 'verra' ? 'Verra (VCS)' : 'Gold Standard'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" display="block">
                        Status:
                      </Typography>
                      <Typography variant="body2">
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" display="block">
                        Est. Credits:
                      </Typography>
                      <Typography variant="body2">
                        {project.estimatedCredits?.toLocaleString() || 'Not specified'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => handleViewProject(project._id)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/generate/${project._id}`)}
                  >
                    Generate Documents
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Action button */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleCreateProject}
        >
          Create New Project
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;