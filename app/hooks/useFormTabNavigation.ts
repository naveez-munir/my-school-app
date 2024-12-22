import { type FieldErrors, type FieldValues } from 'react-hook-form';
import toast from 'react-hot-toast';

interface UseFormTabNavigationOptions<T extends FieldValues> {
  tabFieldMapping: Record<string, (keyof T)[]>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabLabels?: Record<string, string>;
}

export function useFormTabNavigation<T extends FieldValues>({
  tabFieldMapping,
  activeTab,
  setActiveTab,
  tabLabels = {}
}: UseFormTabNavigationOptions<T>) {
  
  const getFirstErrorTab = (formErrors: FieldErrors<T>): string | null => {
    const tabOrder = Object.keys(tabFieldMapping);
    
    for (const tab of tabOrder) {
      const fields = tabFieldMapping[tab];
      const hasError = fields.some(field => formErrors[field as string]);
      if (hasError) {
        return tab;
      }
    }
    return null;
  };

  const getTabLabel = (tabId: string): string => {
    if (tabLabels[tabId]) {
      return tabLabels[tabId];
    }
    return tabId.charAt(0).toUpperCase() + tabId.slice(1);
  };

  const createErrorHandler = (formErrors: FieldErrors<T>) => {
    const firstErrorTab = getFirstErrorTab(formErrors);
    
    if (firstErrorTab) {
      if (activeTab !== firstErrorTab) {
        setActiveTab(firstErrorTab);
        const tabName = getTabLabel(firstErrorTab);
        toast.error(`Please fix the errors in the ${tabName} tab`);
      } else {
        toast.error('Please fix the errors before submitting');
      }
    }
  };

  return {
    getFirstErrorTab,
    createErrorHandler
  };
}

