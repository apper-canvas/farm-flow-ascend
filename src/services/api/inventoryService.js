class InventoryService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'inventory_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "item_name_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "unit_of_measure_c" } },
          { field: { Name: "farm_id_c" } },
          { field: { Name: "expiration_date_c" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching inventory:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async getById(recordId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "item_name_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "unit_of_measure_c" } },
          { field: { Name: "farm_id_c" } },
          { field: { Name: "expiration_date_c" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, recordId, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching inventory with ID ${recordId}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async create(inventoryData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: inventoryData.Name || inventoryData.item_name_c,
          item_name_c: inventoryData.item_name_c,
          quantity_c: parseInt(inventoryData.quantity_c) || 0,
          unit_of_measure_c: inventoryData.unit_of_measure_c,
          farm_id_c: parseInt(inventoryData.farm_id_c),
          expiration_date_c: inventoryData.expiration_date_c,
          Tags: inventoryData.Tags || ""
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create inventory ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords.map(result => result.data);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating inventory:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async update(recordId, inventoryData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(recordId),
          Name: inventoryData.Name || inventoryData.item_name_c,
          item_name_c: inventoryData.item_name_c,
          quantity_c: parseInt(inventoryData.quantity_c) || 0,
          unit_of_measure_c: inventoryData.unit_of_measure_c,
          farm_id_c: parseInt(inventoryData.farm_id_c),
          expiration_date_c: inventoryData.expiration_date_c,
          Tags: inventoryData.Tags || ""
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update inventory ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates.map(result => result.data);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating inventory:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async delete(recordIds) {
    try {
      const params = {
        RecordIds: Array.isArray(recordIds) ? recordIds : [recordIds]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete inventory ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length === params.RecordIds.length;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting inventory:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
}

export default new InventoryService();