import { useState } from "react";
import type { StudentDiscount, PopulatedStudentDiscount } from "~/types/studentFee";
import { CalendarDays, Clock, Tag, Percent, BookOpen, AlertTriangle, FileText } from "lucide-react";
import { useFeeCategories } from "~/hooks/useFeeCategoryQueries";
import { formatCurrency } from "~/utils/currencyUtils";

interface DiscountDetailViewProps {
  discount: StudentDiscount | PopulatedStudentDiscount;
  onClose: () => void;
  onEdit: (discount: StudentDiscount) => void;
}

export function DiscountDetailView({ discount, onClose, onEdit }: DiscountDetailViewProps) {
  const { data: feeCategories = [] } = useFeeCategories();
  
  // Get category names for display
  const getCategoryNames = () => {
    if (!discount.applicableCategories || discount.applicableCategories.length === 0) {
      return "All Categories";
    }
    
    // Handle both populated and unpopulated discounts
    if (typeof discount.applicableCategories[0] === 'string') {
      // Map IDs to names using the fee categories data
      return (discount.applicableCategories as string[])
        .map(categoryId => {
          const category = feeCategories.find(c => c._id === categoryId);
          return category ? category.name : categoryId;
        })
        .join(", ");
    } else {
      // Already populated
      return (discount.applicableCategories as any[])
        .map(category => category.name)
        .join(", ");
    }
  };
  
  // Calculate current status
  const getDiscountStatus = () => {
    const now = new Date();
    const startDate = new Date(discount.startDate);
    const endDate = discount.endDate ? new Date(discount.endDate) : null;
    
    if (!discount.isActive) {
      return {
        status: 'Inactive',
        className: 'bg-gray-100 text-gray-700'
      };
    }
    
    if (startDate > now) {
      return {
        status: 'Scheduled',
        className: 'bg-blue-100 text-blue-700'
      };
    }
    
    if (endDate && endDate < now) {
      return {
        status: 'Expired',
        className: 'bg-yellow-100 text-yellow-700'
      };
    }
    
    return {
      status: 'Active',
      className: 'bg-green-100 text-green-700'
    };
  };
  
  const statusInfo = getDiscountStatus();
  
  // Format discount type for display
  const formatDiscountType = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {formatDiscountType(discount.discountType)} Details
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(discount as StudentDiscount)}
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className={`px-3 py-1 rounded-full text-sm ${statusInfo.className}`}>
            {statusInfo.status}
          </span>
          <span className="text-gray-500 text-sm">
            Created: {new Date(discount.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex items-start space-x-3">
            <Tag className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Discount Type</h3>
              <p className="text-gray-800">{formatDiscountType(discount.discountType)}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Percent className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Discount Value</h3>
              <p className="text-gray-800">
                {discount.discountValueType === 'PERCENTAGE'
                  ? `${discount.discountValue}%`
                  : formatCurrency(discount.discountValue)}
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <CalendarDays className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
              <p className="text-gray-800">{new Date(discount.startDate).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">End Date</h3>
              <p className="text-gray-800">
                {discount.endDate 
                  ? new Date(discount.endDate).toLocaleDateString() 
                  : "No End Date"}
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 md:col-span-2">
            <BookOpen className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Applicable Categories</h3>
              <p className="text-gray-800">{getCategoryNames()}</p>
            </div>
          </div>
          
          {discount.remarks && (
            <div className="flex items-start space-x-3 md:col-span-2">
              <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Remarks</h3>
                <p className="text-gray-800">{discount.remarks}</p>
              </div>
            </div>
          )}
        </div>
        
        {statusInfo.status === 'Expired' && (
          <div className="flex items-start space-x-3 mt-4 p-3 bg-yellow-50 rounded-md">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <p className="text-sm text-yellow-700">
              This discount has expired. It will not be applied to any new fees.
            </p>
          </div>
        )}
        
        {statusInfo.status === 'Scheduled' && (
          <div className="flex items-start space-x-3 mt-4 p-3 bg-blue-50 rounded-md">
            <AlertTriangle className="h-5 w-5 text-blue-500" />
            <p className="text-sm text-blue-700">
              This discount is scheduled to start on {new Date(discount.startDate).toLocaleDateString()}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
