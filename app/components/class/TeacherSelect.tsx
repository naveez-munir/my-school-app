import { Fragment } from 'react'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Transition } from '@headlessui/react'
import { Check, ChevronsUpDown } from 'lucide-react'
import type { TeacherResponse } from '~/types/teacher'

interface TeacherSelectProps {
  value: string
  onChange: (value: string) => void
  teachers: TeacherResponse[]
  isLoading?: boolean
  placeholder?: string
  disabled?: boolean
}

export function TeacherSelect({
  value,
  onChange,
  teachers,
  isLoading = false,
  placeholder = 'Select a teacher',
  disabled = false
}: TeacherSelectProps) {
  const selected = teachers.find(teacher => teacher.id === value)
  return (
    <Listbox 
      value={value} 
      onChange={onChange}
      disabled={disabled || isLoading}
    >
      <div className="relative mt-1">
        <ListboxButton className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500">
          <span className="block truncate">
            {selected ? selected.name : placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </ListboxButton>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
            {teachers.map((teacher) => (
              <ListboxOption
                key={teacher.id}
                value={teacher.id}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {teacher.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                        <Check className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  )
}
