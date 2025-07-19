import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, MapPin, Clock, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { RootState, AppDispatch } from '../store';
import { fetchShipments, setFilters, type Shipment } from '../store/slices/shipmentSlice';
import { ShipmentTable } from './ShipmentTable';
import { CreateShipmentForm } from './CreateShipmentForm';
import { ShipmentMap } from './ShipmentMap';

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { shipments, loading, error, filters } = useSelector((state: RootState) => state.shipments);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');

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
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Delayed': return 'bg-red-100 text-red-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Departed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cargo Shipment Tracker</h1>
              <p className="text-gray-500">Monitor and manage your shipments</p>
            </div>
            <div className="flex space-x-4">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                onClick={() => setViewMode('table')}
              >
                Table View
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                onClick={() => setViewMode('map')}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Map View
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Shipment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Shipments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inTransit}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delayed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.delayed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {viewMode === 'table' ? (
              <ShipmentTable
                shipments={filteredShipments}
                onSelectShipment={setSelectedShipment}
                getStatusColor={getStatusColor}
              />
            ) : (
              <ShipmentMap
                shipments={filteredShipments}
                selectedShipment={selectedShipment}
                onSelectShipment={setSelectedShipment}
              />
            )}
          </div>
        </div>
      </div>

      {/* Create Shipment Modal */}
      {isCreateDialogOpen && (
        <CreateShipmentForm onSuccess={() => setIsCreateDialogOpen(false)} />
      )}
    </div>
  );
};
