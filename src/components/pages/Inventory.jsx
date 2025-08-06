import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import InventoryRow from '@/components/molecules/InventoryRow';
import InventoryForm from '@/components/organisms/InventoryForm';
import ApperIcon from '@/components/ApperIcon';
import inventoryService from '@/services/api/inventoryService';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Load inventory items
  useEffect(() => {
    loadInventory();
  }, []);

  // Filter inventory based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredInventory(inventory);
    } else {
      const filtered = inventory.filter(item =>
        item.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.item_name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.farm_id_c?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.unit_of_measure_c?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInventory(filtered);
    }
  }, [inventory, searchTerm]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryService.getAll();
      setInventory(data);
    } catch (err) {
      setError('Failed to load inventory');
      console.error('Error loading inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteItem = async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.item_name_c || item.Name}"?`)) {
      try {
        await inventoryService.delete(item.Id);
        toast.success('Inventory item deleted successfully');
        loadInventory();
      } catch (err) {
        toast.error('Failed to delete inventory item');
        console.error('Error deleting inventory item:', err);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      if (editingItem) {
        await inventoryService.update(editingItem.Id, formData);
        toast.success('Inventory item updated successfully');
      } else {
        await inventoryService.create(formData);
        toast.success('Inventory item created successfully');
      }
      
      setShowForm(false);
      setEditingItem(null);
      loadInventory();
    } catch (err) {
      toast.error(editingItem ? 'Failed to update inventory item' : 'Failed to create inventory item');
      console.error('Error saving inventory item:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadInventory} />;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">Inventory Management</h1>
            <p className="text-gray-600 mt-1">Manage your farm inventory and supplies</p>
          </div>
          <Button 
            onClick={handleAddItem}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={16} />
            Add Item
          </Button>
        </div>

        <div className="mt-4">
          <Input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
            icon="Search"
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        {filteredInventory.length === 0 ? (
          searchTerm ? (
            <Empty 
              icon="Search" 
              title="No inventory found" 
              description={`No inventory items match "${searchTerm}"`} 
            />
          ) : (
            <Empty 
              icon="Box" 
              title="No inventory items" 
              description="Start by adding your first inventory item" 
              action={
                <Button onClick={handleAddItem} className="mt-4">
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Add First Item
                </Button>
              }
            />
          )
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Farm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInventory.map((item) => (
                  <InventoryRow
                    key={item.Id}
                    item={item}
                    onEdit={() => handleEditItem(item)}
                    onDelete={() => handleDeleteItem(item)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Inventory Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <InventoryForm
              item={editingItem}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              loading={formLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;