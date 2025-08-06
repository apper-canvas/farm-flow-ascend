import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Farms", href: "/farms", icon: "Map" },
    { name: "Crops", href: "/crops", icon: "Sprout" },
    { name: "Tasks", href: "/tasks", icon: "CheckSquare" },
    { name: "Weather", href: "/weather", icon: "Cloud" },
    { name: "Inventory", href: "/inventory", icon: "Box" },
    { name: "Finances", href: "/finances", icon: "DollarSign" }
  ];

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
              <ApperIcon name="Wheat" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 font-display">FarmFlow</h1>
              <p className="text-sm text-gray-600">Agriculture Management</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-forest text-white shadow-md"
                  : "text-gray-700 hover:bg-forest/10 hover:text-forest"
              )}
            >
              {({ isActive }) => (
                <>
                  <ApperIcon 
                    name={item.icon} 
                    className={cn(
                      "w-5 h-5 mr-3 transition-colors",
                      isActive ? "text-white" : "text-gray-500 group-hover:text-forest"
                    )} 
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
              <ApperIcon name="Wheat" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 font-display">FarmFlow</h1>
              <p className="text-sm text-gray-600">Agriculture Management</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-forest text-white shadow-md"
                  : "text-gray-700 hover:bg-forest/10 hover:text-forest"
              )}
            >
              {({ isActive }) => (
                <>
                  <ApperIcon 
                    name={item.icon} 
                    className={cn(
                      "w-5 h-5 mr-3 transition-colors",
                      isActive ? "text-white" : "text-gray-500 group-hover:text-forest"
                    )} 
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;