import { useNavigate } from 'react-router';
import { isAdmin } from '~/utils/auth';
import type { ReactNode } from 'react';

export interface FieldCardField {
  label: string;
  value: string | number | null | undefined;
  fallback?: string;
  valueClassName?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export type FieldCardLayout = 'single-column' | 'two-column' | 'grid-2' | 'grid-3';

export interface FieldCardProps {
  title: string;
  fields: FieldCardField[];
  layout?: FieldCardLayout;
  editPath?: string;
  resourceId?: string;
  className?: string;
  showEditButton?: boolean;
  variant?: 'default' | 'bordered' | 'card';
}

export function FieldCard({
  title,
  fields,
  layout = 'single-column',
  editPath,
  resourceId,
  className = '',
  showEditButton = true,
  variant = 'default'
}: FieldCardProps) {
  const navigate = useNavigate();
  const isAdminUser = isAdmin();

  const handleEdit = () => {
    if (editPath && resourceId) {
      navigate(editPath.replace(':id', resourceId));
    }
  };

  const renderField = (field: FieldCardField, index: number): ReactNode => {
    const Icon = field.icon;
    const displayValue = field.value !== undefined && field.value !== null
      ? field.value
      : (field.fallback || 'Not provided');

    // Single column layout (horizontal label-value pairs)
    if (layout === 'single-column') {
      return (
        <div key={index} className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">{field.label}:</span>
          <p className={field.valueClassName || 'font-medium text-gray-900'}>
            {displayValue}
          </p>
        </div>
      );
    }

    // Two column or grid layouts (vertical label-value pairs)
    return (
      <div key={index} className="flex flex-col">
        <div className={`${Icon ? 'flex-center' : ''} mb-1 sm:mb-2`}>
          {Icon && <Icon className="icon-md text-gray-500" />}
          <span className="text-label">{field.label}</span>
        </div>
        <p className={`text-body font-medium ${field.valueClassName || ''}`}>
          {displayValue}
        </p>
      </div>
    );
  };

  const getLayoutClasses = (): string => {
    switch (layout) {
      case 'two-column':
        return 'grid grid-cols-2 gap-6';
      case 'grid-2':
        return 'grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2';
      case 'grid-3':
        return 'grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      default:
        return 'space-y-2';
    }
  };

  const getVariantClasses = (): { container: string; header: string; content: string } => {
    switch (variant) {
      case 'bordered':
        return {
          container: 'border border-gray-300 rounded-lg bg-white',
          header: 'flex justify-between items-center px-6 py-4 border-b border-gray-200',
          content: 'px-6 py-4'
        };
      case 'card':
        return {
          container: 'card',
          header: 'flex-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200',
          content: 'px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5'
        };
      default:
        return {
          container: 'border rounded-lg p-5 space-y-4',
          header: 'flex justify-between items-center',
          content: ''
        };
    }
  };

  const variantClasses = getVariantClasses();

  // For two-column layout, split fields into left and right columns
  if (layout === 'two-column') {
    const midpoint = Math.ceil(fields.length / 2);
    const leftColumn = fields.slice(0, midpoint);
    const rightColumn = fields.slice(midpoint);

    return (
      <div className={`${variantClasses.container} ${className}`}>
        <div className={variantClasses.header}>
          <h4 className="font-semibold text-gray-900 text-base">{title}</h4>
          {showEditButton && editPath && isAdminUser && resourceId && (
            <button
              onClick={handleEdit}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Edit
            </button>
          )}
        </div>
        <div className={variantClasses.content}>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              {leftColumn.map((field, index) => renderField(field, index))}
            </div>
            <div className="space-y-4">
              {rightColumn.map((field, index) => renderField(field, index + midpoint))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default rendering for other layouts
  return (
    <div className={`${variantClasses.container} ${className}`}>
      {variant === 'default' ? (
        <>
          <div className={variantClasses.header}>
            <h4 className="font-medium text-gray-700">{title}</h4>
            {showEditButton && editPath && isAdminUser && resourceId && (
              <button
                onClick={handleEdit}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            )}
          </div>
          <div className={getLayoutClasses()}>
            {fields.map((field, index) => renderField(field, index))}
          </div>
        </>
      ) : (
        <>
          <div className={variantClasses.header}>
            <h3 className="text-heading lg:text-base font-semibold text-gray-900">{title}</h3>
            {showEditButton && editPath && isAdminUser && resourceId && (
              <button
                onClick={handleEdit}
                className="btn-primary flex items-center gap-1 sm:gap-2"
              >
                <span>✏️</span>
                <span className="hidden sm:inline">Edit</span>
              </button>
            )}
          </div>
          <div className={variantClasses.content}>
            <div className={getLayoutClasses()}>
              {fields.map((field, index) => renderField(field, index))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

