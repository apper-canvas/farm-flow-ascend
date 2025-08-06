import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import { farmService } from '@/services/api/farmService';

const InventoryForm = ({ item, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    item_name_c: '',
    quantity_c: '',
    unit_of_measure_c: '',
    farm_id_c: '',
    expiration_date_c: '',
    Tags: ''
  });
  
  const [farms, setFarms] = useState([]);
  const [farmsLoading, setFarmsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Common units of measure options
  const unitOptions = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'lb', label: 'Pounds (lb)' },
    { value: 'tons', label: 'Tons' },
    { value: 'liters', label: 'Liters' },
    { value: 'gallons', label: 'Gallons' },
    { value: 'pieces', label: 'Pieces' },
    { value: 'boxes', label: 'Boxes' },
    { value: 'bags', label: 'Bags' },
    { value: 'bottles', label: 'Bottles' },
    { value: 'rolls', label: 'Rolls' }
  ];

  useEffect(() => {
    loadFarms();
    
    // Populate form if editing
    if (item) {
      setFormData({
        item_name_c: item.item_name_c || '',
        quantity_c: item.quantity_c || '',
        unit_of_measure_c: item.unit_of_measure_c || '',
        farm_id_c: item.farm_id_c?.Id || '',
        expiration_date_c: item.expiration_date_c || '',
        Tags: item.Tags || ''
      });
    }
  }, [item]);

  const loadFarms = async () => {
    try {
      setFarmsLoading(true);
      const data = await farmService.getAll();
      setFarms(data);
    } catch (err) {
      console.error('Error loading farms:', err);
      setFarms([]);
    } finally {
      setFarmsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.item_name_c.trim()) {
      newErrors.item_name_c = 'Item name is required';
    }
    
    if (!formData.quantity_c || formData.quantity_c <= 0) {
      newErrors.quantity_c = 'Quantity must be greater than 0';
    }
    
    if (!formData.unit_of_measure_c) {
      newErrors.unit_of_measure_c = 'Unit of measure is required';
    }
    
    if (!formData.farm_id_c) {
      newErrors.farm_id_c = 'Farm selection is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Prepare data for submission
      const submitData = {
        ...formData,
        Name: formData.item_name_c, // Use item name as the Name field
        quantity_c: parseInt(formData.quantity_c),
        farm_id_c: parseInt(formData.farm_id_c)
      };
      
      onSubmit(submitData);
    }
  };

const farmOptions = farms.map(farm => ({
    value: farm.Id.toString(),
    label: farm.name
  }));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 font-display">
          {item ? 'Edit Inventory Item' : 'Add New Inventory Item'}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="p-2"
        >
          <ApperIcon name="X" size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Name *
          </label>
          <Input
            type="text"
            name="item_name_c"
            value={formData.item_name_c}
            onChange={handleChange}
            placeholder="Enter item name"
            error={errors.item_name_c}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity *
            </label>
            <Input
              type="number"
              name="quantity_c"
              value={formData.quantity_c}
              onChange={handleChange}
              placeholder="Enter quantity"
              min="0"
              step="0.01"
              error={errors.quantity_c}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit of Measure *
            </label>
            <Select
              name="unit_of_measure_c"
              value={formData.unit_of_measure_c}
              onChange={handleChange}
              options={unitOptions}
              placeholder="Select unit"
              error={errors.unit_of_measure_c}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Farm *
          </label>
          <Select
            name="farm_id_c"
            value={formData.farm_id_c}
            onChange={handleChange}
            options={farmOptions}
            placeholder={farmsLoading ? "Loading farms..." : "Select a farm"}
            disabled={farmsLoading}
            error={errors.farm_id_c}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiration Date
          </label>
          <Input
            type="date"
            name="expiration_date_c"
            value={formData.expiration_date_c}
            onChange={handleChange}
            error={errors.expiration_date_c}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <Input
            type="text"
            name="Tags"
            value={formData.Tags}
            onChange={handleChange}
            placeholder="Enter tags separated by commas"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate multiple tags with commas (e.g., fertilizer, organic, bulk)
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
type="submit"
            loading={Boolean(loading)}
            disabled={Boolean(loading)}
          >
            {loading ? 'Saving...' : (item ? 'Update Item' : 'Add Item')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InventoryForm;