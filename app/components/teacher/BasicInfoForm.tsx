import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronsUpDown } from 'lucide-react';
import { EmploymentStatus, Gender, type CreateTeacherDto, BloodGroup } from '~/types/teacher';

interface BasicInfoFormProps {
  data: CreateTeacherDto;
  onUpdate: (field: keyof CreateTeacherDto, value: any) => void;
}

export function BasicInfoForm({ data, onUpdate }: BasicInfoFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Basic Information Fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700">CNI Number*</label>
        <input
          type="text"
          value={data.cniNumber}
          onChange={(e) => onUpdate('cniNumber', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Gender*</label>
        <Listbox value={data.gender} onChange={(value) => onUpdate('gender', value)}>
          <div className="relative mt-1">
            <ListboxButton className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <span className="block truncate">{data.gender}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronsUpDown className="h-4 w-4 text-gray-400" />
              </span>
            </ListboxButton>
            <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {Object.values(Gender).map((gender) => (
                <ListboxOption key={gender} value={gender}>
                  {({ active, selected }) => (
                    <li className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                      active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                    }`}>
                      <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                        {gender}
                      </span>
                    </li>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">First Name*</label>
        <input
          type="text"
          value={data.firstName}
          onChange={(e) => onUpdate('firstName', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Last Name*</label>
        <input
          type="text"
          value={data.lastName}
          onChange={(e) => onUpdate('lastName', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => onUpdate('email', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="text"
          value={data.phone}
          onChange={(e) => onUpdate('phone', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Blood Group</label>
        <Listbox value={data.bloodGroup} onChange={(value) => onUpdate('bloodGroup', value)}>
          <div className="relative mt-1">
            <ListboxButton className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <span className="block truncate">{data.bloodGroup || 'Select Blood Group'}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronsUpDown className="h-4 w-4 text-gray-400" />
              </span>
            </ListboxButton>
            <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {Object.values(BloodGroup).map((group) => (
                <ListboxOption key={group} value={group}>
                  {({ active, selected }) => (
                    <li className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                      active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                    }`}>
                      <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                        {group}
                      </span>
                    </li>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Joining Date*</label>
        <input
          type="date"
          value={data.joiningDate ? new Date(data.joiningDate).toISOString().split('T')[0] : ''}
          onChange={(e) => onUpdate('joiningDate', new Date(e.target.value))}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Employment Status*</label>
        <Listbox value={data.employmentStatus} onChange={(value) => onUpdate('employmentStatus', value)}>
          <div className="relative mt-1">
            <ListboxButton className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <span className="block truncate">{data.employmentStatus}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronsUpDown className="h-4 w-4 text-gray-400" />
              </span>
            </ListboxButton>
            <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {Object.values(EmploymentStatus).map((status) => (
                <ListboxOption key={status} value={status}>
                  {({ active, selected }) => (
                    <li className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                      active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                    }`}>
                      <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                        {status}
                      </span>
                    </li>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>

      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <textarea
          value={data.address}
          onChange={(e) => onUpdate('address', e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
        />
      </div>
    </div>
  );
}
