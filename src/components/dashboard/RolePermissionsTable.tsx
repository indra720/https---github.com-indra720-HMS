
'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  KeyRound,
  MoreVertical,
  Users,
  Shield,
  ChevronLeft,
  ChevronRight,
  AwardIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CustomCheckboxInput from '../ui/CustomCheckboxInput';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Staff' | 'Client' | 'Vendor';
  avatar?: string;
  phone?: string;
  is_active?: boolean;
  slug?: string;
}

interface RolePermission {
  id: string;
  label: string;
}

interface RoleModel {
  name: string;
  color: string;
  permissions: RolePermission[];
  memberCount: number;
  slug?: string;
}

interface RoleData {
  id: number;
  role: string;
  role_name: string;
  slug: string;
  model_name: string;
  permission_name: string;
}

interface AppModel {
  id: string;
  name: string;
  app_label: string;
}

interface PermissionType {
  id: string;
  name: string;
  codename: string;
  code?: string;
}

export default function RolePermissionsTable() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [searchName, setSearchName] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => setIsCollapsed(prev => !prev);
  const initialWidth = "w-80";
  const collapsedWidth = "w-40";
  const [searchEmail, setSearchEmail] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [userForms, setUserForms] = useState(false);
  const [userForm, setUserForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState(false);
  const [roles, setRoles] = useState<RoleModel[]>([]);
  const [role, setRole] = useState<RoleData[]>([]);
  const [appModels, setAppModels] = useState<AppModel[]>([]);
  const [permissionTypes, setPermissionTypes] = useState<PermissionType[]>([]);
  const [editingRole, setEditingRole] = useState<RoleModel | null>(null);
  const [selectedAppLabel, setSelectedAppLabel] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [appSearch, setAppSearch] = useState('');
  const [roleName, setRoleName] = useState('');
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [obj, setObj] = useState({ full_name: "", email: "", password: "", phone: "", slug: "", role_slug: "", is_active: false });
  const [editObj, setEditObj] = useState([]);
  const sidebarClasses = `
  ${isCollapsed ? `relative ${collapsedWidth}` : `absolute md:relative z-50 ${initialWidth}`} 
  border-r bg-gray-50 flex flex-col h-full transition-all duration-300 ease-in-out shadow-lg md:shadow-none overflow-hidden
`;

  const contentClasses = `
  flex flex-col flex-1 overflow-hidden transition-opacity duration-200 ease-in-out 
  ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}
`;

  const user = [
    { id: 1, name: "User 1", avatarUrl: "https://cdn-front.freepik.com/home/anon-rvmp/creative-suite/photography/reimagine.webp" },
    { id: 2, name: "User 2", avatarUrl: "https://imgs.search.brave.com/LnPAGGiyYFzfmALWhve3vjYU_Gx7G1WB3Q-MiJFWl6w/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjgv/NjY3LzYxNi9zbWFs/bC9ncmVlbi1iZWF1/dGlmdWxsLWp1bmds/ZS1iYWNrZ3JvdW5k/LWdlbmVyYXRpdmUt/YWktaWxsdXN0cmF0/aW9uLXBob3RvLmpw/ZWc" },
    { id: 3, name: "User 3", avatarUrl: "https://imgs.search.brave.com/cJ2eUZscVyJ9smz0D9AVjG4uOpsoAbi8a0E2zEcbsds/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzk0LzE3LzMz/LzM2MF9GXzI5NDE3/MzM4OV9jMXJLQW9z/ZUhtYlVUQmZkNTh3/d1NyMGZnRDFENVkz/WS5qcGc" },
    { id: 4, name: "User 4", avatarUrl: "https://imgs.search.brave.com/XFoUPB_qXiRsWJcc0LSYK2OgLJEQHQLQFBFjLFfwWHE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9lbC15/dW5xdWUtbW9ybmlu/Zy1taXN0LWJlYXV0/aWZ1bC1qdW5nbGUt/cGF0aC1uYXRpb25h/bC1mb3Jlc3QtcHVl/cnRvLXJpY28tNzE2/MjQ5ODcuanBn" },
  ];

  const [createObj, setCreateObj] = useState({
    full_name: "", email: "", password: "", phone: "", role_slug: "", is_active: false,
  });

  const accessToken = localStorage.getItem('accessToken');
  const usersPerPage = 10;
  // Toggle Permission
  const togglePermission = (permId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permId) ? prev.filter(id => id !== permId) : [...prev, permId]
    );
  };



  const toggleModelPermissions = (model: AppModel) => {
    const modelPerms = permissionTypes.map(
      pt => `${model.app_label}.${model.name}.${pt.code}`
    );

    const allSelected = modelPerms.every(p => selectedPermissions.includes(p));

    setSelectedPermissions(prev =>
      allSelected
        ? prev.filter(p => !modelPerms.includes(p))
        : [...prev, ...modelPerms]
    );
  };


  const toggleAppPermissions = () => {
    if (!selectedAppLabel) return;
    const appModelsList = appModels.filter(m => m.app_label === selectedAppLabel);
    const allAppPerms = appModelsList.flatMap(model =>
      permissionTypes.map(pt => `${model.name.toLowerCase()}-${pt.codename}`)
    );
    const allSelected = allAppPerms.every(p => selectedPermissions.includes(p));
    const newSelected = allSelected
      ? selectedPermissions.filter(p => !allAppPerms.includes(p))
      : [...new Set([...selectedPermissions, ...allAppPerms])];
    setSelectedPermissions(newSelected);
  };

  const isModelAllSelected = (model: AppModel) => {
    const modelPerms = permissionTypes.map(
      pt => `${model.app_label}.${model.name}.${pt.code}`
    );
    return modelPerms.every(p => selectedPermissions.includes(p));
  };



  const isAppAllSelected = () => {
    if (!selectedAppLabel) return false;
    const appModelsList = appModels.filter(m => m.app_label === selectedAppLabel);
    const allAppPerms = appModelsList.flatMap(model =>
      permissionTypes.map(pt => `${model.app_label}.${model.name}.${pt.code}`)
    );
    return allAppPerms.every(p => selectedPermissions.includes(p));
  };

  // Fetch Users
  const handleGetUser = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/users/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      if (!response.ok) return;

      const normalizedUsers: User[] = data.map((u: any) => ({
        id: u.id, name: u.full_name || u.name || 'Unknown User', email: u.email || '',
        role: u.role_name || 'Client', avatar: u.avatar, phone: u.phone, is_active: u.is_active, slug: u.slug,
      }));

      setUsers(normalizedUsers);
      setFilteredUsers(normalizedUsers);

      const initialToggleStates: Record<string, boolean> = {};
      normalizedUsers.forEach(user => { initialToggleStates[user.slug!] = user.is_active || false; });
      setToggleStates(initialToggleStates);
    } catch (error) { console.error('Error fetching users:', error); }
  };

  // Fetch Roles & Permissions
  const handleGetRoles = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/role-permissions/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      if (!response.ok) return;
      setRole(data);

      const roleGrouped: Record<string, RoleModel> = {};
      data.forEach((item: RoleData) => {
        if (!roleGrouped[item.role]) {
          roleGrouped[item.role] = { name: item.role, color: "bg-blue-500", memberCount: 0, permissions: [], slug: item.slug };
        }
        roleGrouped[item.role].permissions.push({ id: item.slug, label: `${item.model_name} ${item.permission_name}` });
      });

      setRoles(Object.values(roleGrouped));
    } catch (error) { console.error("Error fetching roles:", error); }
  };
  // delete role k liye
  const handleDeleteRole = async (slug) => {
    if (!slug || !Array.isArray(slug.permissions) || slug.permissions.length === 0) {
      return alert("Role slug is missing or invalid");
    }

    let slugs = []

    // slug array के हर item का id push करें
    slug.permissions.forEach(item => {
      slugs.push(item.id);
    });
    console.log(slugs);


    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/role-permissions-bulk/delete/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },

          body: JSON.stringify({ slugs: slugs }),
        });

        const data = await response.json();
        console.log(data);
        if (response.ok) {
          alert("Role deleted successfully.");
          // Update roles state after deletion
          setRoles(prevRoles => prevRoles.filter(role => role.name !== slug.name));
          // setFilteredRoles(prevRoles => prevRoles.filter(role => role.slug !== slug));
        } else {

          console.error("Error deleting role:", data);
          alert("Failed to delete role.");
        }
      } catch (error) {
        console.error('Error deleting role:', error);
        alert("An error occurred while deleting the role.");
      }
    } else {
      console.log("Delete cancelled.");
    }
  };

  // Handle top-right plus button click depending on active tab
  const handlePlusClick = () => {
    if (activeTab === 'users') {
      setUserForms(true);
      return;
    }

    if (activeTab === 'roles') {
      // Open the same Edit Role card/modal but for a new role (blank)
      const newRoleObj: RoleModel = {
        name: 'New Role',
        color: 'bg-blue-500',
        permissions: [],
        memberCount: 0,
        slug: ''
      };
      setSelectedPermissions([]);
      setSelectedAppLabel('');
      setAppSearch('');
      setEditingRole(newRoleObj);
      return;
    }
  };

  const handlePermission = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/appmodels/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      setAppModels(data);

      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/permission-types/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      });
      const datas = await res.json();
      setPermissionTypes(datas);
    }
    catch (error) {
      console.error("Error fetching permissions:", error);
    }
  }

  // Open Edit Role → Pre-fill selected permissions
  const openEditRole = (r: RoleModel) => {
    const currentRolePermissions = role.filter(item => item.role === r.name).map(item => {
      const pt = permissionTypes.find(pt => pt.name === item.permission_name);
      const model = appModels.find(m => m.name.toLowerCase() === item.model_name.toLowerCase());
      if (pt && model) {
        return `${model.app_label}.${model.name}.${pt.code}`;
      }
      return `${item.model_name}.${item.model_name}.${item.permission_name.toLowerCase()}`;
    });
    setSelectedPermissions(currentRolePermissions);
    setEditingRole(r);
    setSelectedAppLabel('');
    setAppSearch('');
  };

  // Handle Edit User
  const handleEdit = (user: User) => {
    setObj({
      ...obj,
      full_name: user.name,
      email: user.email,
      phone: user.phone,
      slug: user.slug,
      role_slug: role.find(r => r.role_name === user.role)?.role,
      is_active: user?.is_active == true ? true : false,
    });
    setUserForm(true);
  };

  // Handle Update User
  const handleUpdateUser = async () => {
    console.log(obj);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/users/${obj.slug}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(obj),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) return;
      if (data) {
        alert("User updated successfully.");
        setUserForm(false);
        setObj({
          full_name: "",
          email: "",
          password: "",
          phone: "",
          slug: "",
          role_slug: "",
          is_active: false,
        });
      }
    }
    catch (error) { console.log(error); }
  };

  // Handle Delete User
  const handleDeleteUser = async (slug: string) => {
    if (!slug) return alert("User slug is missing");

    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/users/${slug}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          alert("User deleted successfully.");
          setUsers(prevUsers => prevUsers.filter(user => user.slug !== slug));
          setFilteredUsers(prevUsers => prevUsers.filter(user => user.slug !== slug));
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    } else {
      console.log("Delete cancelled.");
    }
  };

  // Handle Toggle Active Status
  const handleToggleActiveStatus = async (slug: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/users/${slug}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      const data = await res.json();
      setToggleStates(prev => ({
        ...prev,
        [slug]: !currentStatus
      }));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Handle Create User
  const handleCreateUser = async () => {
    console.log(createObj);

    try {
      setIsLoading(true);

      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(createObj),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        alert("Failed to create user");
        return;
      } else {
        alert("User Created Successfully");
        setUserForms(false);
        setCreateObj({
          full_name: "",
          email: "",
          password: "",
          phone: "",
          role_slug: "",
          is_active: false,
        });
        handleGetUser();
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred while creating the user");
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    handleGetUser();
    handleGetRoles();
    handlePermission();
  }, []);

  // Search & Filter
  const handleSearch = () => {
    const filtered = users.filter(user => {
      const matchesName = user.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesEmail = user.email.toLowerCase().includes(searchEmail.toLowerCase());
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      return matchesName && matchesEmail && matchesRole;
    });
    console.log("Filtered Users:", filtered);
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Staff': return 'bg-blue-500';
      case 'Admin': return 'bg-red-500';
      case 'Client': return 'bg-green-500';
      case 'Vendor': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };



  const togglePermissionForEdit = (permId: string, isChecked: boolean) => {
    const [app, model, code] = permId.split(".");
    const modelSlug = model.toLowerCase();

    // Step 1: पहले सारी existing perms निकाल लो
    let existingPerms = selectedPermissions
      .filter(p => p.startsWith(`${app}.${model}.`))
      .map(p => p.split(".")[2]); // r, u, c, d only

    let finalPerms = [...existingPerms];

    // Step 2: check / uncheck के हिसाब से update
    if (isChecked) {
      if (!finalPerms.includes(code)) {
        finalPerms.push(code); // add
      }
    } else {
      finalPerms = finalPerms.filter(p => p !== code); // remove
    }

    // Step 3: update state
    setEditObj(prev => {
      const existingModel = prev.find(p => p.model_slug === modelSlug);

      if (!existingModel) {
        return [
          ...prev,
          {
            model_slug: modelSlug,
            permission_slugs: finalPerms
          }
        ];
      }

      return prev.map(p =>
        p.model_slug === modelSlug
          ? { ...p, permission_slugs: finalPerms }
          : p
      );
    });
  };




  const handleEditPermissions = async (name) => {
    const isNewRole = !editingRole?.slug || editingRole.slug === '';

    const obj = {
      role_name: isNewRole ? roleName : name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
      permissions: editObj,
    };
    console.log(obj);

    try {

      // ********** CREATE ROLE (POST) **********
      if (isNewRole) {
        const createRoleResponse = await fetch(
          `${import.meta.env.VITE_API_BACKEND_URL}/api/role-permissions-bulk/create/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(obj),
          }
        );

        const createData = await createRoleResponse.json();
        if (!createRoleResponse.ok) {
          alert("Failed to create role");
          return;
        }

        alert("Role Created Successfully!");
      }

      // ********** UPDATE ROLE (PUT) **********
      else {
        const response = await fetch(
          `${import.meta.env.VITE_API_BACKEND_URL}/api/role-permissions-bulk/update/`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(obj),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert("Failed to update permissions");
          return;
        }

        alert("Permissions Updated Successfully!");
      }

      // After success
      setEditingRole(null);
      setSelectedAppLabel('');
      handleGetRoles();
    }
    catch (error) {
      console.error("Error updating permissions:", error);
      alert("An error occurred");
    }
  };


  // Sub-component for App List Item
  const AppListItem = ({ appLabel, isCollapsed }: { appLabel: string, isCollapsed: boolean }) => { // <--- CHANGE 1: Added isCollapsed prop
    const modelsInApp = appModels.filter((m: AppModel) => m.app_label === appLabel);
    let count = 0;
    modelsInApp.forEach((model) => {
      permissionTypes.forEach((pt) => {
        const permSlug = `${model.app_label}.${model.name}.${pt.code}`;
        if (selectedPermissions.includes(permSlug)) count++;
      });
    });
    //==================================== Sidebar Permissions===========================================================

    return (
      <div
        onClick={() => setSelectedAppLabel(selectedAppLabel === appLabel ? '' : appLabel)}
        className={`px-5 py-4 cursor-pointer transition-colors border-b hover:bg-gray-100 ${selectedAppLabel === appLabel ? "bg-blue-50 border-l-4 border-l-blue-600" : ""}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* {selectedAppLabel === appLabel && (
              <input
                type="checkbox"
                checked={isAppAllSelected()}
                onChange={toggleAppPermissions}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            )} */}
            <p className="font-medium">{appLabel}</p>
          </div>
          {/* CHANGE 2: Conditional rendering of count text */}
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">{count} permissions</p>
              {selectedAppLabel === appLabel && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Sub-component for Model Permissions Section
  const ModelPermissionsSection = ({
    model,
    togglePermissionForEdit,
  }: {
    model: AppModel & { isFirst?: boolean };
    togglePermissionForEdit: (id: string, isChecked: boolean) => void;
  }) => {
    const isFirst = model.isFirst ?? false;

    return (
      <div className="bg-white">
        <div className="model-permission-section bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="p-5 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">

              {/* 💡 FIX: HEADER अब केवल तभी रेंडर होगा जब isFirst true हो */}
              {isFirst && (
                <thead className="bg-gray-50 sticky top-0 z-20">
                  <tr> {/* THs को TR के अंदर रैप करें */}
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3"
                    >
                      Permission Name
                    </th>

                    {/* 💡 FIX: permissionTypes पर लूप का उपयोग करें जैसा कि मूल रूप से था */}
                    {permissionTypes.map((pt: PermissionType) => (
                      <th
                        key={`header-${pt.code}`}
                        scope="col"
                        className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6"
                      >
                        {pt.name}
                      </th>
                    ))}

                  </tr>
                </thead>
              )}

              {/* ROW DATA ONLY */}
              <tbody className="bg-white divide-y divide-gray-200">

                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 align-middle">
                    <div className="flex items-center gap-3">
                      <CustomCheckboxInput
                        checked={isModelAllSelected(model)}
                        onChange={() => toggleModelPermissions(model)}
                      />
                      <span>
                        {model.name.charAt(0).toUpperCase() + model.name.slice(1)}
                      </span>
                    </div>
                  </td>

                  {permissionTypes.map((pt: PermissionType) => {
                    const permId = `${model.app_label}.${model.name}.${pt.code}`;

                    return (
                      <td key={permId} className="px-4 py-3 align-middle">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permId)}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              togglePermission(permId);
                              togglePermissionForEdit(permId, isChecked);
                            }}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>

            </table>
          </div>
        </div>
      </div>
    );
  };




  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <div className="relative">
            <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto mb-8">
              <TabsTrigger value="users" className="flex items-center gap-2"><Users className="w-4 h-4" /> Users</TabsTrigger>
              <TabsTrigger value="roles" className="flex items-center gap-2"><Shield className="w-4 h-4" /> Roles</TabsTrigger>
            </TabsList>

            <div className="absolute top-6 right-6">
              <button
                onClick={handlePlusClick}
                className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* ====================== USERS TAB ====================== */}
          <TabsContent value="users" className="mt-0">
            <Card className="p-6">
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Input placeholder="Enter Name" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                <Input placeholder="Enter Email" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} />
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Client">Client</SelectItem>
                    <SelectItem value="Vendor">Vendor</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleSearch} size="icon" variant="outline"><Search className="w-4 h-4" /></Button>
              </div>

              {/* Users Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {paginatedUsers.map((user) => {
                  const isActived = toggleStates[user.slug!] ?? user.is_active;
                  return (
                    <div key={user.id} className="relative bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="absolute top-2 right-2 flex items-center gap-2">
                        <span className={`text-xs font-medium ${isActived ? "text-green-600" : "text-gray-500"}`}>
                          {isActived ? "Active" : "Inactive"}
                        </span>
                        <button onClick={() => handleToggleActiveStatus(user.slug!, isActived)} className={`h-4 w-8 rounded-full flex items-center transition-all duration-300 ${isActived ? "bg-green-500" : "bg-gray-300"}`}>
                          <span className={`h-3 w-3 bg-white rounded-full shadow transform transition-all duration-300 ${isActived ? "translate-x-4" : "translate-x-1"}`}></span>
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <Avatar><AvatarImage src={user.avatar} /><AvatarFallback>{user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(user)}><Edit className="w-3 h-3" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDeleteUser(user.slug!)}><Trash2 className="w-3 h-3" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setPasswordForm(true)}><KeyRound className="w-3 h-3" /></Button>
                        </div>
                        <Badge className={`${getRoleColor(user.role)} text-white`}>{user.role}</Badge>
                      </div>
                    </div>
                  );
                })}

                {/* Add New User Card */}
                <div onClick={() => setUserForms(true)} className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg border-2 border-dashed border-teal-300 flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 transition-colors">
                  <Plus className="w-8 h-8 text-teal-600 mb-2" />
                  <p className="text-sm font-medium text-teal-700">New User</p>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <p>Showing {(currentPage - 1) * usersPerPage + 1} to {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} results</p>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft className="w-4 h-4" /></Button>
                  {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => (
                    <Button key={i} size="sm" variant={currentPage === i + 1 ? "default" : "outline"} className="w-8 h-8 p-0" onClick={() => setCurrentPage(i + 1)}>{i + 1}</Button>
                  ))}
                  <Button size="sm" variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* ====================== ROLES TAB ====================== */}

          <TabsContent value="roles" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((r) => (
                <Card key={r.name} className="p-5 relative">

                  {/* TOP WITHOUT EDIT/DELETE */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={`${r.color} text-white capitalize`}>
                      {r.name}
                    </Badge>
                  </div>

                  {/* PERMISSIONS */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {r.permissions.slice(0, 8).map((perm) => (
                      <Badge
                        key={perm.id}
                        variant="secondary"
                        className="text-xs py-1 justify-center"
                      >
                        {perm.label}
                      </Badge>
                    ))}
                    {r.permissions.length > 8 && (
                      <Badge variant="secondary" className="text-xs">
                        +{r.permissions.length - 8} more
                      </Badge>
                    )}
                  </div>

                  {/* HIDDEN ORIGINAL MEMBER/PLUS ROW */}
                  <div className="flex items-center justify-between opacity-0 pointer-events-none">
                    <div className="flex -space-x-2">
                      {user.map((u) => (
                        <Avatar
                          key={u.id}
                          className="w-8 h-8 border-2 border-white"
                        >
                          <img
                            src={u.avatarUrl}
                            alt={u.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </Avatar>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Members</span>
                      <Button size="icon" variant="ghost" className="h-6 w-6">
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* ⭐ FIXED BOTTOM-LEFT AVATARS ⭐ */}


                  <div className="absolute bottom-4 left-4 flex -space-x-2">
                    {paginatedUsers.slice(0, 4).map((u) => {
                      const initials = u.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();

                      return (
                        <Avatar
                          key={u.id}
                          className="w-8 h-8 bg-gray-300 text-xs font-semibold flex items-center justify-center border-2 border-white shadow"
                        >
                          {u.avatar ? (
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span>{initials}</span>
                          )}
                        </Avatar>
                      );
                    })}
                  </div>


                  {/* ⭐ FIXED BOTTOM-RIGHT ACTION BUTTONS ⭐ */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full shadow bg-white"
                      onClick={() => openEditRole(r)}
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full shadow bg-white"
                      onClick={() => handleDeleteRole(r)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>

                </Card>
              ))}
            </div>
          </TabsContent>


        </Tabs>

        {/* ====================== ROLE EDIT MODAL (EXACTLY LIKE IMAGE) ====================== */}
        {editingRole && (
          <Dialog open={!!editingRole} onOpenChange={(open) => !open && setEditingRole(null)}>
            <DialogContent className="max-w-6xl h-[85vh] p-0 overflow-hidden flex flex-col">
              <DialogHeader className="p-6 pb-4 border-b">
                {/* <DialogTitle className="text-2xl font-bold">Edit Role Permissions</DialogTitle> */}
                <DialogTitle className="text-2xl font-bold">{editingRole?.slug === "" ? "Create" : "Edit"} Role Permissions</DialogTitle>
                <DialogDescription>Manage permissions for the selected role</DialogDescription>
              </DialogHeader>

              <div className="flex flex-1 overflow-hidden ">
                {/* Left Sidebar - Apps List */}
                <div className={sidebarClasses}>

                  {/* Collapse/Expand Toggle Button */}
                  <div className="absolute top-0 right-0 p-2 z-50">
                    <button onClick={toggleCollapse} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors shadow-md">
                      {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="flex flex-col flex-1 overflow-hidden ">

                    {/* Role Name Section (Conditional visibility - OK) */}
                    {!isCollapsed && (
                      <div className="p-5 border-b">
                        <label className="block text-sm font-medium mb-2">Role Name</label>
                        <Input
                          placeholder="Enter Role Name..."
                          value={editingRole?.slug === "" ? roleName : editingRole?.name}
                          onChange={(e) => setRoleName(e.target.value)}
                          disabled={!!editingRole?.slug}
                        />
                      </div>
                    )}

                    {/* App List Section */}
                    <div className="flex-1 overflow-y-auto mt-12 scrollbar-thin">
                      {(() => {
                        const uniqueAppLabels = [...new Set(appModels.map((m: AppModel) => m.app_label))].sort();
                        const filteredAppLabels = uniqueAppLabels.filter(appLabel =>
                          appLabel.toLowerCase().includes(appSearch.toLowerCase())
                        );
                        return filteredAppLabels.map((appLabel) => (

                          < AppListItem key={appLabel} appLabel={appLabel} isCollapsed={isCollapsed} />
                        ));
                      })()}
                    </div>
                  </div>
                </div>

                {/* Right Side - Permissions (MODIFIED STRUCTURE) */}
                <div className="flex-1 flex flex-col">
                  <div className="p-6 border-b bg-white">
                    <h3 className="text-xl font-semibold capitalize">{editingRole.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedPermissions.length} permissions selected</p>
                  </div>

                  {/* 💡 FIX: Scrollable Area containing ONE Table */}
                  <div className="flex-1 min-h-0 p-6 bg-gray-50 pb-0">
                    <div className="overflow-x-auto bg-white rounded-lg border shadow-sm" style={{ maxHeight: 'calc(85vh - 220px)' }}>
                      <table className="min-w-full table-fixed border-collapse">
                        <thead className="bg-gray-50 sticky top-0 z-20 block">
                          <table className="table w-full table-fixed border-separate" style={{ borderSpacing: '20px 0' }}>
                            <tr>
                              <th
                                scope="col"
                                className=" py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3"
                              >
                                Permission Name
                              </th>

                              {permissionTypes.map((pt: PermissionType) => (
                                <th
                                  key={`header-${pt.code}`}
                                  scope="col"
                                  className="pr-+6  py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/6"
                                >
                                  {pt.name}
                                </th>
                              ))}
                            </tr>

                          </table>

                        </thead>

                        {/* 💡 FIX: TBODY will contain ALL model rows */}
                        <tbody className="block max-h-[36vh] overflow-y-auto scrollbar-thin divide-y">
                          {(() => {
                            const filteredModels = selectedAppLabel
                              ? appModels.filter((m: AppModel) => m.app_label === selectedAppLabel)
                              : appModels;

                            return filteredModels.map((model: AppModel) => (
                              <tr key={model.name} className="table w-full table-fixed">
                                {/* Model Name/Select All Column */}
                                <td className="px-4 py-3 text-sm font-medium text-gray-900 align-middle">
                                  <div className="flex items-center gap-3">
                                    <CustomCheckboxInput
                                      checked={isModelAllSelected(model)}
                                      onChange={() => toggleModelPermissions(model)}
                                    />
                                    <span>
                                      {model.name.charAt(0).toUpperCase() + model.name.slice(1)}
                                    </span>
                                  </div>
                                </td>

                                {/* Individual Permission Checkboxes */}
                                {permissionTypes.map((pt: PermissionType) => {
                                  const permId = `${model.app_label}.${model.name}.${pt.code}`;

                                  return (
                                    <td key={permId} className="px-4 py-3 align-middle">
                                      <div className="flex items-center justify-center">
                                        <CustomCheckboxInput
                                          checked={selectedPermissions.includes(permId)}
                                          onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            togglePermission(permId);
                                            togglePermissionForEdit(permId, isChecked);
                                          }}
                                        />
                                      </div>
                                    </td>

                                  );
                                })}
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="p-6 border-t bg-white flex justify-end gap-3 absolute bottom-0 right-0 left-0 w-full z-30">
                    <Button variant="outline" onClick={() => { setEditingRole(null); setSelectedAppLabel(''); setAppSearch(''); }}>Cancel</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { handleEditPermissions(editingRole?.name) }}>
                      Save Changes
                    </Button>
                  </div>
                </div>

              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Create / Edit User Modals */}
        <Dialog open={userForm} onOpenChange={setUserForm}>
          <DialogContent className="max-w-md backdrop-blur-md">
            <DialogHeader>
              <DialogTitle>Update User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input placeholder="Enter Name" name='full_name' value={obj?.full_name} onChange={(e) => setObj({ ...obj, [e.target.name]: e.target.value })} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input placeholder="Enter Email" className="mt-1" name='email' value={obj?.email} onChange={(e) => setObj({ ...obj, [e.target.name]: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Mobile</label>
                <Input placeholder="Enter Mobile Number" name='phone' value={obj?.phone} className="mt-1" onChange={(e) => setObj({ ...obj, [e.target.name]: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <select
                  name="role_slug"
                  value={obj?.role_slug}
                  onChange={(e) => setObj({ ...obj, [e.target.name]: e.target.value })}
                  className="mt-1 border rounded px-2 py-1 w-full"
                >
                  <option value="">Select Role</option>
                  {[...new Map(role.map(item => [item.role_name, item] as [string, RoleData])).values()]
                    .map((roleItem: RoleData) => (
                      <option key={roleItem.id} value={roleItem.role}>
                        {roleItem.role_name}
                      </option>
                    ))}
                </select>
              </div>
              <Button className="w-full mt-4" onClick={handleUpdateUser}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={passwordForm} onOpenChange={setPasswordForm}>
          <DialogContent className="max-w-md backdrop-blur-md">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">New Password</label>
                <Input type="password" placeholder="Enter New Password" />
              </div>
              <div>
                <label className="text-sm font-medium">Confirm Password</label>
                <Input type="password" placeholder="Confirm Password" />
              </div>
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">Update Password</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={userForms} onOpenChange={setUserForms}>
          <DialogContent className="max-w-md backdrop-blur-md">
            <DialogHeader>
              <DialogTitle>New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input type="text" name='full_name' onChange={(e) => setCreateObj({ ...createObj, [e.target.name]: e.target.value })} placeholder="Enter Your Full Name" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input type="email" name='email' onChange={(e) => setCreateObj({ ...createObj, [e.target.name]: e.target.value })} placeholder="Enter Your Email" />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input type="password" name='password' onChange={(e) => setCreateObj({ ...createObj, [e.target.name]: e.target.value })} placeholder="Enter Your Password" />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input type="number" name="phone" step="1" placeholder="Enter Your Mobile Number" onChange={(e) => { const value = e.target.value; if (value.length <= 10) { setCreateObj({ ...createObj, [e.target.name]: value }); } }} />
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <select
                  name="role_slug"
                  value={createObj?.role_slug}
                  onChange={(e) => setCreateObj({ ...createObj, [e.target.name]: e.target.value })}
                  className="mt-1 border rounded px-2 py-1 w-full"
                >
                  <option value="">Select Role</option>
                  {[...new Map(role.map(item => [item.role_name, item] as [string, RoleData])).values()]
                    .map((roleItem: RoleData) => (
                      <option key={roleItem.id} value={roleItem.role}>
                        {roleItem.role_name}
                      </option>
                    ))}
                </select>
              </div>
              <Button
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white flex justify-center items-center gap-2"
                onClick={handleCreateUser}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V8a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create User"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </>
  );
}