import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent, CardActions,
  Button, Paper, Skeleton, Chip
} from '@mui/material';
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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockProjects = [
          {
            _id: '1',
            name: 'Reforestation Project A',
            description: 'Reforestation of degraded land in Region X1',
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

        setStats({
          totalProjects: mockProjects.length,
          documentsGenerated: mockProjects.length * 2,
          creditsEstimated: mockProjects.reduce((sum, p) => sum + (p.estimatedCredits || 0), 0),
          projectsInProgress: mockProjects.filter(p => p.status === 'in-progress').length,
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleViewProject = (projectId) => navigate(`/projects/${projectId}`);
  const handleCreateProject = () => navigate('/projects/new');

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton height={50} />
        <Skeleton height={30} width="60%" />
        <Skeleton variant="rectangular" height={200} sx={{ my: 2 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>Retry</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>Welcome, {user?.name || 'User'}!</Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Stat cards (same as before) */}
      </Grid>

      <Typography variant="h5" sx={{ mb: 2 }}>Recent Projects</Typography>

      <Grid container spacing={3}>
        {projects.map(project => (
          <Grid item xs={12} md={6} key={project._id}>
            <Card sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>{project.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {project.description}
                </Typography>

                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="caption">Type:</Typography>
                    <Typography variant="body2">{project.projectType}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption">Standard:</Typography>
                    <Typography variant="body2">
                      {project.targetStandard === 'verra' ? 'Verra (VCS)' : 'Gold Standard'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption">Credits:</Typography>
                    <Typography variant="body2">
                      {project.estimatedCredits.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption">Created:</Typography>
                    <Typography variant="body2">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Status chip */}
                <Chip
                  label={project.status.replace('-', ' ').toUpperCase()}
                  color={project.status === 'in-progress' ? 'primary' : 'default'}
                  size="small"
                  sx={{ mt: 2 }}
                />
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleViewProject(project._id)}>View</Button>
                <Button size="small" color="primary" onClick={() => navigate(`/generate/${project._id}`)}>
                  Generate Docs
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button variant="contained" size="large" onClick={handleCreateProject}>Create New Project</Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
