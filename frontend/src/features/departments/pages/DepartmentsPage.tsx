import { PageHeader } from '@/components/shared/PageHeader';
import { DepartmentList } from '../components/DepartmentList';

export default function DepartmentsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader 
        title="Departments" 
        description="Manage the functional groups within your organization." 
      />
      <DepartmentList />
    </div>
  );
}
