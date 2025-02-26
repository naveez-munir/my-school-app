import { EmploymentStatus, Gender, type CreateTeacherDto, BloodGroup } from '~/types/teacher';
import { TextInput } from '../common/form/inputs/TextInput';
import { TextArea } from '../common/form/inputs/TextArea';
import { SelectInput } from '../common/form/inputs/SelectInput';
import { DateInput } from '../common/form/inputs/DateInput';
import { ClassSelector } from '../common/ClassSelector';

interface BasicInfoFormProps {
  data: CreateTeacherDto;
  onUpdate: (field: keyof CreateTeacherDto, value: any) => void;
}

export function BasicInfoForm({ data, onUpdate }: BasicInfoFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Basic Information Fields */}
      <TextInput 
       label='CNI Number*'
       required
       value={data.cniNumber}
       onChange={(value) => onUpdate('cniNumber', value)}
      />

      <SelectInput<typeof Gender>
        label="Gender"
        value={data.gender}
        onChange={(value) => onUpdate('gender', value)}
        options={Gender}
        placeholder="Select Gender"
        required
      />

      <TextInput 
       label='First Name*'
       required
       value={data.firstName}
       onChange={(value) => onUpdate('firstName', value)}
      />

      <TextInput 
       label='Last Name*'
       required
       value={data.lastName}
       onChange={(value) => onUpdate('lastName', value)}
      />

      <TextInput 
        label='Email'
        value={data.email || ''}
        onChange={(value) => onUpdate('email', value)}
        type='email'
      />

      <TextInput 
        label='Phone'
        value={data.phone || ''}
        onChange={(value) => onUpdate('phone', value)}
      />
      <SelectInput<typeof BloodGroup>
        label="Blood Group"
        value={data.bloodGroup}
        onChange={(value) => onUpdate('bloodGroup',value)}
        options={BloodGroup}
        placeholder="Select Blood Group"
        required
      />
      <DateInput 
       label='Joining Date*'
       value={data.joiningDate.toString()}
       onChange={(value) => onUpdate('joiningDate', new Date(value))}
       required
      />
      <SelectInput<typeof EmploymentStatus>
        label="Employment Status*"
        value={data.employmentStatus}
        onChange={(value) => onUpdate('employmentStatus', value)}
        options={EmploymentStatus}
        placeholder="Select Employee status"
        required
      />
      <ClassSelector
        value={data.classTeacherOf }
        onChange={(classId) => onUpdate('classTeacherOf', classId)}
        label="Class"
        required={false}
      />

      <div className="col-span-2">
        <TextArea 
        label='Address'
        value={data.address || ''}
        onChange={(value) => onUpdate('address', value)}
        rows={3}
      />
      </div>
      
    </div>
  );
}
