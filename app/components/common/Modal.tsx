import { Fragment, type ReactNode } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOutsideClick?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOutsideClick = true
}: ModalProps) {
  // Responsive size classes for 3 breakpoints
  const sizeClasses = {
    sm: 'max-w-[90%] sm:max-w-sm lg:max-w-md',
    md: 'max-w-[90%] sm:max-w-md lg:max-w-lg',
    lg: 'max-w-[95%] sm:max-w-lg lg:max-w-xl',
    xl: 'max-w-[95%] sm:max-w-xl lg:max-w-2xl'
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeOnOutsideClick ? onClose : () => {}}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-3 sm:p-4 lg:p-6 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-lg bg-white p-4 sm:p-5 lg:p-6 text-left align-middle shadow-xl transition-all`}>
                <div className="flex justify-between items-start mb-3 sm:mb-4 lg:mb-5">
                  <DialogTitle
                    as="h3"
                    className="text-base sm:text-lg lg:text-xl font-semibold leading-6 text-gray-900"
                  >
                    {title}
                  </DialogTitle>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 transition-colors -mt-1 -mr-1 p-1"
                    onClick={onClose}
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                  </button>
                </div>
                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
