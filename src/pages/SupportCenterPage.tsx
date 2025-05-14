import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Badge,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  ChatBubble as ChatBubbleIcon,
  Person as PersonIcon,
  SmartToy as AiIcon,
  MoreVert as MoreVertIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  AddCircle as AddCircleIcon,
} from '@mui/icons-material';

// Types for external libraries, add these if not automatically imported
declare module '@mui/material';
declare module '@mui/icons-material';

// Types
interface Ticket {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  updatedAt: string;
  assignedTo: string | null;
  isAIHandled: boolean;
  attachments: Attachment[];
  responses: Response[];
}

interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

interface Response {
  id: string;
  ticketId: string;
  content: string;
  createdAt: string;
  responder: string;
  isAIGenerated: boolean;
}

interface TicketStats {
  total: number;
  byStatus: {
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  byHandler: {
    ai: number;
    human: number;
    unassigned: number;
  };
  averageResponseTime: string;
}

const SupportCenterPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTicketDialogOpen, setNewTicketDialogOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    isAIHandled: '',
  });
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium',
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.isAIHandled) queryParams.append('isAIHandled', filters.isAIHandled);

      const response = await axios.get(`/api/support?${queryParams.toString()}`);
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      // For demo purposes, use the mock data if API fails
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/support/stats/summary');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching ticket stats:', error);
      // Set some demo stats if API fails
      setStats(null);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    let status = '';
    switch (newValue) {
      case 0: // All
        status = '';
        break;
      case 1: // Open
        status = 'open';
        break;
      case 2: // In Progress
        status = 'in-progress';
        break;
      case 3: // Resolved
        status = 'resolved';
        break;
      case 4: // Closed
        status = 'closed';
        break;
    }
    setFilters({ ...filters, status });
    fetchTickets();
  };

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const name = event.target.name as string;
    const value = event.target.value as string;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    setFilterOpen(false);
    fetchTickets();
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      priority: '',
      category: '',
      isAIHandled: '',
    });
    setFilterOpen(false);
    fetchTickets();
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setResponseText('');
  };

  const addResponse = async () => {
    if (!selectedTicket || !responseText.trim()) return;

    try {
      await axios.post(`/api/support/${selectedTicket.id}/responses`, {
        content: responseText,
      });

      // Refresh ticket data
      const response = await axios.get(`/api/support/${selectedTicket.id}`);
      setSelectedTicket(response.data);
      setResponseText('');
    } catch (error) {
      console.error('Error adding response:', error);
    }
  };

  const createNewTicket = async () => {
    try {
      await axios.post('/api/support', newTicket);
      setNewTicketDialogOpen(false);
      setNewTicket({
        title: '',
        description: '',
        category: 'general',
        priority: 'medium',
      });
      fetchTickets();
      fetchStats();
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'error';
      case 'in-progress':
        return 'warning';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'info';
      case 'medium':
        return 'success';
      case 'high':
        return 'warning';
      case 'urgent':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatCategory = (category: string) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateString: string) => {
    return moment(dateString).format('MMM D, YYYY h:mm A');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Support Center
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={() => setNewTicketDialogOpen(true)}
        >
          New Ticket
        </Button>
      </Box>

      {stats && (
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Tickets
                </Typography>
                <Typography variant="h3">{stats.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Open Tickets
                </Typography>
                <Typography variant="h3">{stats.byStatus.open}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  AI Handled
                </Typography>
                <Typography variant="h3">{stats.byHandler.ai}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {stats.total > 0 ? Math.round((stats.byHandler.ai / stats.total) * 100) : 0}% of
                  total
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Avg. Response Time
                </Typography>
                <Typography variant="h5">{stats.averageResponseTime}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="ticket status tabs">
          <Tab label="All Tickets" />
          <Tab
            label={
              <Badge badgeContent={stats?.byStatus.open || 0} color="error">
                Open
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={stats?.byStatus.inProgress || 0} color="warning">
                In Progress
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={stats?.byStatus.resolved || 0} color="success">
                Resolved
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={stats?.byStatus.closed || 0} color="default">
                Closed
              </Badge>
            }
          />
        </Tabs>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={() => setFilterOpen(!filterOpen)}
        >
          Filters
        </Button>
        <Box>
          <Button startIcon={<RefreshIcon />} onClick={fetchTickets} sx={{ mr: 1 }}>
            Refresh
          </Button>
        </Box>
      </Box>

      {filterOpen && (
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="priority-filter-label">Priority</InputLabel>
                <Select
                  labelId="priority-filter-label"
                  name="priority"
                  value={filters.priority}
                  onChange={handleFilterChange}
                  label="Priority"
                >
                  <MenuItem value="">All Priorities</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="category-filter-label">Category</InputLabel>
                <Select
                  labelId="category-filter-label"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="refund">Refund</MenuItem>
                  <MenuItem value="booking_change">Booking Change</MenuItem>
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="billing">Billing</MenuItem>
                  <MenuItem value="loyalty_program">Loyalty Program</MenuItem>
                  <MenuItem value="special_request">Special Request</MenuItem>
                  <MenuItem value="insurance">Insurance</MenuItem>
                  <MenuItem value="transfers">Transfers</MenuItem>
                  <MenuItem value="booking_add_on">Booking Add-on</MenuItem>
                  <MenuItem value="online_check_in">Online Check-in</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="ai-handled-filter-label">Handler</InputLabel>
                <Select
                  labelId="ai-handled-filter-label"
                  name="isAIHandled"
                  value={filters.isAIHandled}
                  onChange={handleFilterChange}
                  label="Handler"
                >
                  <MenuItem value="">All Handlers</MenuItem>
                  <MenuItem value="true">AI Agent</MenuItem>
                  <MenuItem value="false">Human Agent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" onClick={applyFilters} fullWidth>
                  Apply Filters
                </Button>
                <Button variant="outlined" onClick={resetFilters} fullWidth>
                  Reset
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : tickets.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No tickets found
          </Typography>
          <Typography variant="body1" color="textSecondary">
            No support tickets match your current filters. Try adjusting your filters or create a
            new ticket.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="tickets table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Handler</TableCell>
                <TableCell>Last Update</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map(ticket => (
                <TableRow
                  key={ticket.id}
                  hover
                  onClick={() => handleTicketClick(ticket)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        ticket.status.charAt(0).toUpperCase() +
                        ticket.status.slice(1).replace('-', ' ')
                      }
                      color={getStatusColor(ticket.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      color={getPriorityColor(ticket.priority) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatCategory(ticket.category)}</TableCell>
                  <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                  <TableCell>
                    {ticket.assignedTo ? (
                      <Chip
                        icon={ticket.isAIHandled ? <AiIcon /> : <PersonIcon />}
                        label={ticket.isAIHandled ? 'AI Agent' : 'Human Agent'}
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      <Chip label="Unassigned" variant="outlined" size="small" />
                    )}
                  </TableCell>
                  <TableCell>{formatDate(ticket.updatedAt)}</TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Ticket Detail Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        {selectedTicket && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{selectedTicket.title}</Typography>
                <Box>
                  <Chip
                    label={
                      selectedTicket.status.charAt(0).toUpperCase() +
                      selectedTicket.status.slice(1).replace('-', ' ')
                    }
                    color={getStatusColor(selectedTicket.status) as any}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={
                      selectedTicket.priority.charAt(0).toUpperCase() +
                      selectedTicket.priority.slice(1)
                    }
                    color={getPriorityColor(selectedTicket.priority) as any}
                    size="small"
                  />
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Ticket #{selectedTicket.id} • Created {formatDate(selectedTicket.createdAt)}
                </Typography>
                <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                  {selectedTicket.description}
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  <Typography variant="subtitle2" sx={{ mr: 1 }}>
                    Handler:
                  </Typography>
                  {selectedTicket.assignedTo ? (
                    <Chip
                      icon={selectedTicket.isAIHandled ? <AiIcon /> : <PersonIcon />}
                      label={selectedTicket.isAIHandled ? 'AI Agent' : 'Human Agent'}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Chip label="Unassigned" variant="outlined" size="small" />
                  )}
                </Box>
              </Box>

              {selectedTicket.attachments.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Attachments
                  </Typography>
                  {selectedTicket.attachments.map(attachment => (
                    <Chip
                      key={attachment.id}
                      label={attachment.fileName}
                      onClick={() => {}}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              )}

              <Typography variant="subtitle1" gutterBottom>
                Conversation
              </Typography>
              <Box sx={{ mb: 3 }}>
                {selectedTicket.responses.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    No responses yet.
                  </Typography>
                ) : (
                  selectedTicket.responses.map(response => (
                    <Paper
                      key={response.id}
                      elevation={1}
                      sx={{
                        p: 2,
                        mb: 2,
                        backgroundColor: response.responder === 'user1' ? '#E8F4FD' : '#F5F5F5',
                        borderRadius: 2,
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Box display="flex" alignItems="center">
                          {response.isAIGenerated ? (
                            <AiIcon fontSize="small" sx={{ mr: 1 }} />
                          ) : (
                            <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                          )}
                          <Typography variant="subtitle2">
                            {response.isAIGenerated
                              ? 'AI Agent'
                              : response.responder === 'user1'
                                ? 'You'
                                : 'Support Agent'}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="textSecondary">
                          {formatDate(response.createdAt)}
                        </Typography>
                      </Box>
                      <Typography variant="body1">{response.content}</Typography>
                    </Paper>
                  ))
                )}
              </Box>

              <TextField
                fullWidth
                label="Add a response"
                multiline
                rows={4}
                value={responseText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setResponseText(e.target.value)
                }
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Close</Button>
              <Button
                variant="contained"
                onClick={addResponse}
                disabled={!responseText.trim()}
                startIcon={<ChatBubbleIcon />}
              >
                Send Response
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* New Ticket Dialog */}
      <Dialog
        open={newTicketDialogOpen}
        onClose={() => setNewTicketDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Support Ticket</DialogTitle>
        <DialogContent dividers>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Ticket Title"
              name="title"
              value={newTicket.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewTicket({ ...newTicket, title: e.target.value })
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              rows={4}
              name="description"
              label="Description"
              id="description"
              value={newTicket.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewTicket({ ...newTicket, description: e.target.value })
              }
            />
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    value={newTicket.category}
                    label="Category"
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                      setNewTicket({ ...newTicket, category: e.target.value as string })
                    }
                  >
                    <MenuItem value="general">General</MenuItem>
                    <MenuItem value="refund">Refund</MenuItem>
                    <MenuItem value="booking_change">Booking Change</MenuItem>
                    <MenuItem value="technical">Technical</MenuItem>
                    <MenuItem value="billing">Billing</MenuItem>
                    <MenuItem value="loyalty_program">Loyalty Program</MenuItem>
                    <MenuItem value="special_request">Special Request</MenuItem>
                    <MenuItem value="insurance">Insurance</MenuItem>
                    <MenuItem value="transfers">Transfers</MenuItem>
                    <MenuItem value="booking_add_on">Booking Add-on</MenuItem>
                    <MenuItem value="online_check_in">Online Check-in</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="priority-label">Priority</InputLabel>
                  <Select
                    labelId="priority-label"
                    id="priority"
                    name="priority"
                    value={newTicket.priority}
                    label="Priority"
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                      setNewTicket({ ...newTicket, priority: e.target.value as string })
                    }
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewTicketDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={createNewTicket}
            disabled={!newTicket.title.trim() || !newTicket.description.trim()}
          >
            Create Ticket
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SupportCenterPage;
