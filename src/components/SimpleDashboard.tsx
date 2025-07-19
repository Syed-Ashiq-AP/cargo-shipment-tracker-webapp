import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, MapPin, Clock, Package, Plus, Map, List, Edit2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { CreateShipmentForm } from './CreateShipmentForm';
import { EditShipmentForm } from './EditShipmentForm';
import { ShipmentMap } from './ShipmentMap';
import type { RootState, AppDispatch } from '../store';
import { fetchShipments, setFilters, type Shipment } from '../store/slices/shipmentSlice';

export const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { shipments, loading, error, filters } = useSelector((state: RootState) => state.shipments);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editShipment, setEditShipment] = useState<Shipment | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  useEffect(() => {
    dispatch(fetchShipments());
  }, [dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  const handleStatusFilter = (status: string) => {
    dispatch(setFilters({ status: status === filters.status ? '' : status }));
  };

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch = shipment.shipmentId.toLowerCase().includes(filters.search.toLowerCase()) ||
                         shipment.containerId.toLowerCase().includes(filters.search.toLowerCase()) ||
                         shipment.origin.toLowerCase().includes(filters.search.toLowerCase()) ||
                         shipment.destination.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status || shipment.status === filters.status;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Transit': return 'bg-blue-500/20 text-blue-400 dark:bg-blue-400/20 dark:text-blue-300';
      case 'Delivered': return 'bg-green-500/20 text-green-400 dark:bg-green-400/20 dark:text-green-300';
      case 'Delayed': return 'bg-red-500/20 text-red-400 dark:bg-red-400/20 dark:text-red-300';
      case 'Processing': return 'bg-yellow-500/20 text-yellow-400 dark:bg-yellow-400/20 dark:text-yellow-300';
      case 'Departed': return 'bg-purple-500/20 text-purple-400 dark:bg-purple-400/20 dark:text-purple-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter(s => s.status === 'In Transit').length,
    delivered: shipments.filter(s => s.status === 'Delivered').length,
    delayed: shipments.filter(s => s.status === 'Delayed').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-destructive text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <p className="text-sm mt-2 text-muted-foreground">Make sure the backend server is running on port 5000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Cargo Shipment Tracker</h1>
              <p className="text-muted-foreground">Monitor and manage your shipments</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Shipment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto w-[90vw]">
                <DialogHeader>
                  <DialogTitle>Create New Shipment</DialogTitle>
                </DialogHeader>
                <CreateShipmentForm 
                  onSuccess={() => {
                    setIsCreateDialogOpen(false);
                    dispatch(fetchShipments());
                  }} 
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Edit Shipment Dialog */}
      <Dialog open={!!editShipment} onOpenChange={() => setEditShipment(null)}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto w-[90vw]">
          <DialogHeader>
            <DialogTitle>Edit Shipment</DialogTitle>
          </DialogHeader>
          {editShipment && (
            <EditShipmentForm 
              shipment={editShipment}
              onSuccess={() => {
                setEditShipment(null);
                dispatch(fetchShipments());
              }}
              onCancel={() => setEditShipment(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-card rounded-lg shadow p-6 border border-border">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Shipments</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow p-6 border border-border">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">In Transit</p>
                <p className="text-2xl font-bold text-foreground">{stats.inTransit}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow p-6 border border-border">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold text-foreground">{stats.delivered}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow p-6 border border-border">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Delayed</p>
                <p className="text-2xl font-bold text-foreground">{stats.delayed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg shadow mb-6 border border-border">
          <div className="p-6 border-b border-border">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by shipment ID, container ID, origin, or destination..."
                    value={filters.search}
                    onChange={handleSearchChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filters.status === '' ? 'default' : 'outline'}
                  onClick={() => handleStatusFilter('')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={filters.status === 'In Transit' ? 'default' : 'outline'}
                  onClick={() => handleStatusFilter('In Transit')}
                  size="sm"
                >
                  In Transit
                </Button>
                <Button
                  variant={filters.status === 'Delivered' ? 'default' : 'outline'}
                  onClick={() => handleStatusFilter('Delivered')}
                  size="sm"
                >
                  Delivered
                </Button>
                <Button
                  variant={filters.status === 'Delayed' ? 'default' : 'outline'}
                  onClick={() => handleStatusFilter('Delayed')}
                  size="sm"
                >
                  Delayed
                </Button>
              </div>
              <div className="flex gap-2 ml-4 border-l pl-4">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  onClick={() => setViewMode('table')}
                  size="sm"
                >
                  <List className="w-4 h-4 mr-1" />
                  Table
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  onClick={() => setViewMode('map')}
                  size="sm"
                >
                  <Map className="w-4 h-4 mr-1" />
                  Map
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {filteredShipments.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground text-lg">No shipments found</div>
                <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
              </div>
            ) : viewMode === 'map' ? (
              <div className="h-96">
                <ShipmentMap 
                  shipments={filteredShipments}
                  selectedShipment={selectedShipment}
                  onSelectShipment={setSelectedShipment}
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Shipment Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Route
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Current Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        ETA
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {filteredShipments.map((shipment) => (
                      <tr key={shipment._id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              {shipment.shipmentId}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Container: {shipment.containerId}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-foreground">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 text-green-500 mr-1" />
                              {shipment.origin}
                            </div>
                            <div className="flex items-center mt-1">
                              <MapPin className="w-4 h-4 text-red-500 mr-1" />
                              {shipment.destination}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-foreground">
                            {shipment.currentLocation.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {shipment.currentLocation.lat.toFixed(4)}, {shipment.currentLocation.lng.toFixed(4)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                            {shipment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-foreground">
                            <Clock className="w-4 h-4 mr-1" />
                            {new Date(shipment.eta).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditShipment(shipment)}
                          >
                            <Edit2 className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
