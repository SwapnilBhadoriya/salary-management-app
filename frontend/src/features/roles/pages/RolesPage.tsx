import { PageHeader } from '@/components/shared/PageHeader';
import { RoleList } from '../components/RoleList';

export default function RolesPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader 
        title="Roles" 
        description="Manage job titles and employee roles across the organization." 
      />
      <RoleList />
    </div>
  );
}
