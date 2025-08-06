import React from 'react';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { format, isAfter, isBefore, addDays } from 'date-fns';

const InventoryRow = ({ item, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getExpirationStatus = (dateString) => {
    if (!dateString) return { variant: 'secondary', text: 'No expiration' };
    
    try {
      const expirationDate = new Date(dateString);
      const now = new Date();
      const warningDate = addDays(now, 7); // 7 days warning
      
      if (isBefore(expirationDate, now)) {
        return { variant: 'destructive', text: 'Expired' };
      } else if (isBefore(expirationDate, warningDate)) {
        return { variant: 'warning', text: 'Expiring soon' };
      } else {
        return { variant: 'success', text: 'Fresh' };
      }
    } catch (error) {
      return { variant: 'secondary', text: 'Invalid date' };
    }
  };

  const expirationStatus = getExpirationStatus(item.expiration_date_c);

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <div className="text-sm font-medium text-gray-900">
            {item.item_name_c || item.Name || 'Unnamed Item'}
          </div>
          {item.Tags && (
            <div className="text-xs text-gray-500 mt-1">
              {item.Tags.split(',').map((tag, index) => (
                <Badge key={index} variant="secondary" className="mr-1 text-xs">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {item.quantity_c || 0} {item.unit_of_measure_c || 'units'}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {item.farm_id_c?.Name || 'No farm assigned'}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <div className="text-sm text-gray-900">
            {formatDate(item.expiration_date_c)}
          </div>
          <Badge variant={expirationStatus.variant} className="mt-1 w-fit text-xs">
            {expirationStatus.text}
          </Badge>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="p-2"
            title="Edit item"
          >
            <ApperIcon name="Edit" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50"
            title="Delete item"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default InventoryRow;