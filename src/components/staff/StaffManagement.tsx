import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Users, UserPlus, Calendar as CalendarIcon, Clock, DollarSign,
  TrendingUp, Award, PhoneCall, Mail, MapPin, Star, Plus, User, UserPen, Settings2, Save, X,
  Lock, Briefcase, Building, Image, Phone, ArrowLeft, ArrowRight, Activity, Camera, Banknote, CheckSquare, XCircle,
  IndianRupee,
  Info,
  SquareChartGantt,
  ChartBarDecreasing,
  IdCard,
  UserCog
} from "lucide-react";
import Spinner from "../ui/Spinner";


export const StaffManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [AllStaff, setAllStaff] = useState<any[]>([]);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const accessToken = localStorage.getItem('accessToken');
  const hotelSlug = JSON.parse(localStorage.getItem('user') || '{}');
  const [currentMember, setCurrentMember] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [allRoles, setAllRoles] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const displayImage = selectedImage || currentMember?.profile_image;
  const [fileToUpload, setFileToUpload] = useState(null);
  const fileInputRef = useRef(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [staffDetails, setStaffDetails] = useState({
    full_name: "",
    email: "",
    hotel_slug: hotelSlug.hotel_slug,
    phone: "",
    role_slug: "",
    designation: "",
    department: "",
    joining_date: new Date().toISOString().split('T')[0],
    shift_start: "09:00",
    shift_end: "18:00",
    monthly_salary: "",
    documents: [{
      document_type: "aadhar",
      document_number: "",
      document_file: null as File | null
    }],
    profile_image: null as File | null
  });

  const isShiftTimeValid = staffDetails.shift_start < staffDetails.shift_end;
  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  const [selectedDate, setSelectedDate] = useState(
    () => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }
  );

  const isStep1Valid = () => {
    return (
      staffDetails.full_name.trim() !== '' &&
      staffDetails.email.trim() !== '' &&
      staffDetails.phone.trim() !== '' &&
      staffDetails.documents[0].document_number.trim() !== '' &&
      staffDetails.documents[0].document_file !== null
    );
  };

  const handleNextStep = () => {
    if (isStep1Valid()) {
      setCurrentStep(2);
    } else {
      alert("Please fill all required fields in Step 1 before proceeding.");
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setFileToUpload(file);
      setStaffDetails(prevDetails => ({
        ...prevDetails,
        profile_image: file
      }));

      event.target.value = null;
    }
  };


  const shiftTimeMap = {
    Morning: { start: "10:00", end: "19:00" },
    Evening: { start: "14:00", end: "23:00" },
    Night: { start: "22:00", end: "03:00" },
  };
  const handleInputChange = (field, value) => {
    if (field === 'shift_start' || field === 'shift_end') {
      if (typeof value === 'string') {
        const parts = value.split(':');
        if (parts.length === 2) {
          value = value + ':00';
        }
      }
    }

    setCurrentMember(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getshiftLabel = (time: string | null | undefined): string => {
    if (!time || typeof time !== "string") return "";
    const [hours] = time.split(":").map(Number);
    if (hours >= 10 && hours < 14) return "Morning"; // 10:00-13:59
    if (hours >= 14 && hours < 22) return "Evening"; // 14:00-21:59
    if (hours >= 22 || hours < 6) return "Night";    // 22:00-03:00
    return "";
  };

  useEffect(() => {
    if (isDetailOpen && currentMember) {
      console.log('Current Member Data:', currentMember);
    }
  }, [isDetailOpen, currentMember]);



  const fetchData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/staff/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const result = await response.json();
      setAllStaff(result);
      console.log("Fetched staff data :", result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };



  const fetchRoles = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/roles/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const result = await response.json();
      setAllRoles(result);
      console.log("Fetched roles data :", result);
    } catch (error) {
      console.error("Error fetching roles :", error);
    }
  };


  // ---------------  Get staff data On re render --------------- 

  useEffect(() => {

    fetchData();
    fetchRoles();
  }, []);

  // -------------------- CREATE STAFF  ----------------------------------------------------------------------------------------------------

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const formData = new FormData();

      (Object.keys(staffDetails) as Array<keyof typeof staffDetails>).forEach((key) => {
        const value = staffDetails[key];

        if (key === "profile_image") {
          if (value instanceof File || value instanceof Blob) {
            formData.append(key, value);
          }
        } else if (key === "documents" && Array.isArray(value)) {
          value.forEach((doc: any, index: number) => {
            formData.append(`documents[${index}][document_type]`, doc.document_type);
            formData.append(`documents[${index}][document_number]`, doc.document_number);
            formData.append(`documents[${index}][document_file]`, doc.document_file);
          });
        } else {
          if (value !== null && value !== undefined) {
            formData.append(key, String(value));
          }
        }
      });
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      const staffResponse = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/staff/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      const staffCreatedData = await staffResponse.json();

      if (staffResponse.ok) {
        console.log("Staff created successfully:", staffCreatedData);
        fetchData();
        toast({
          title: "Staff Added",
          description: "New staff member added successfully.",
          className: "bg-emerald-600 text-white border-none shadow-lg"
        });
      }

      setStaffDetails({
        full_name: "",
        email: "",
        hotel_slug: hotelSlug.hotel_slug,
        phone: "",
        role_slug: " ",
        designation: "",
        department: "",
        joining_date: new Date().toISOString().split('T')[0],
        shift_start: "09:00",
        shift_end: "18:00",
        monthly_salary: "",
        documents: [{
          document_type: "aadhar",
          document_number: "",
          document_file: null as File | null
        }],
        profile_image: null as File | null
      });

      handlePrevStep();
      console.log(JSON.stringify(staffCreatedData));
    } catch (error) {
      console.error("Error in handleAddUser:", error);
      toast({
        title: "Failed to Add Staff",
        description: "An error occurred. Please try again.",
        className: "bg-red-600 text-white border-none shadow-lg"
      });

    } finally {
      setLoading(false);
    }
    setShowAddStaff(false);

  };



  // ------------------------------------------------------- Edit Staff Member Function --------------------------------------------------------------------------------------
  const saveStaffMember = async () => {
    if (!currentMember) return;

    setIsSaving(true);
    try {
      // Create FormData object
      const formData = new FormData();

      // Add all the regular fields
      formData.append('user_slug', currentMember.slug);
      formData.append('performance_score', String(currentMember.performance_score));
      formData.append('department', currentMember.department);
      formData.append('designation', currentMember.designation);
      formData.append('monthly_salary', currentMember.monthly_salary);
      formData.append('performance_score', currentMember.performance_score);
      formData.append('joining_date', currentMember.joining_date);
      formData.append('shift_start', currentMember.shift_start);
      formData.append('shift_end', currentMember.shift_end);
      formData.append('status', currentMember.status);
      formData.append('email', currentMember.user_email);
      formData.append('phone', currentMember.user_phone);
      formData.append('full_name', currentMember.user_full_name);

      if (fileToUpload) {
        formData.append('profile_image', fileToUpload);
      }

      console.log('FormData contents:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }

      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/staff/${currentMember.slug}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to update staff member');
      }

      setFileToUpload(null);

      fetchData();
      toast({
        title: "Staff Updated",
        description: "Changes saved successfully.",
        className: "bg-blue-600 text-white border-none shadow-lg"
      });


    } catch (error) {
      console.error('Error updating staff member:', error);
      toast({
        title: "Duplicate Entry",
        description: "Phone or email already exists.",
        className: "bg-red-600 text-white border-none shadow-lg"
      });

    } finally {
      setIsSaving(false);
    }
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "on_leave": return "bg-yellow-100 text-yellow-800";
      case "inactive": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  const StaffCard = ({ member }: { member: any }) => {

    const name = member.name || member.user_full_name || "Unknown";
    const designation = member.position || member.designation || "Staff";
    const profileImage = member.profile_image || null;
    const department = member.department || "General";
    const email = member.email || member.user_email || "";
    const phone = member.phone || member.user_phone || "";
    const salary = parseFloat(member.monthly_salary || "0");
    const performance = Math.round(parseFloat(member.performance_score || "0"));

    return (
      <>
        {/*------------------------------------------------------------------- All Staff Card ------------------------------------------------------------------------- */}
        <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100 relative">
          <div
            onClick={() => {
              setCurrentMember(member);
              setIsDetailOpen(true);
            }}
            className="absolute top-4 right-4 z-10 flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors cursor-pointer">
            <UserPen className="w-5 h-5" />
            <span>Edit</span>
          </div>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600">
                  {member.profile_image ? (
                    <img
                      src={member.profile_image}

                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <AvatarFallback className="text-black font-semibold flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{name}</h3>
                  <p className="text-sm text-gray-600">{designation}</p>
                  <p className="text-xs text-gray-500">{department}</p>
                </div>
              </div>
              <div className="mt-10">
                <Badge className={getStatusColor(member.status)}>
                  {member.status}
                </Badge>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Performance</span>
                <span className="font-semibold">{performance}%</span>
              </div>
              <Progress value={performance} className="h-2" />

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">- {email || "-"}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <PhoneCall className="w-4 h-4" />
                  <span>- {phone || "-"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-semibold text-green-600">₹ {salary.toLocaleString()}/month</span>
                <div className="flex space-x-1">
                  {member.shift_start ? (
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      {getshiftLabel(member.shift_start)}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-gray-500 border-gray-300 px-2 py-1">
                      No Shift Set
                    </Badge>
                  )}
                </div>

              </div>
            </div>
          </CardContent>
        </Card>
      </>
    );
  };


  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ Dashboard Stats  ---------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Staff</p>
                <p className="text-3xl font-bold">{AllStaff.length}</p>
              </div>
              <Users className="w-10 h-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Active Staff</p>
                <p className="text-3xl font-bold">{AllStaff.filter(s => s.status === 'active').length}</p>
              </div>
              <Award className="w-10 h-10 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Avg Performance</p>
                <p className="text-3xl font-bold">
                  {AllStaff.length > 0
                    ? (
                      AllStaff.reduce(
                        (acc, s) => acc + parseFloat(s.performance_score || "0"),
                        0
                      ) / AllStaff.length
                    ).toFixed(2)
                    : "0.00"}
                  %
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Monthly Payroll</p>
                <p className="text-3xl font-bold">
                  ₹{AllStaff
                    .reduce((acc, s) => acc + parseFloat(s.monthly_salary || "0"), 0)
                    .toLocaleString()}
                </p>
              </div>
              <IndianRupee className="w-10 h-10 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>


      {/* ------------------------------------------------------Add Employee Dialog --------------------------------------------------------------------------- */}
      <Dialog open={showAddStaff} onOpenChange={setShowAddStaff}>
        <DialogContent className="sm:max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Add Staff Member - Step {currentStep} of 2</DialogTitle>
          </DialogHeader>

          <div className="flex w-full h-2 rounded-full bg-gray-200 overflow-hidden mb-0">
            <div
              className={`h-full rounded-full bg-blue-600 transition-all duration-500 ease-in-out`}
              style={{ width: currentStep === 1 ? '50%' : '100%' }}
            ></div>
          </div>
          <form className="space-y-3 p-2 sm:p-4" onSubmit={handleAddUser}>

            {currentStep === 1 && (
              <>
                {/* Full Name with User Icon */}
                <div>
                  <Label htmlFor="fullname">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="fullname"
                      value={staffDetails.full_name}
                      onChange={(e) =>
                        setStaffDetails({ ...staffDetails, full_name: e.target.value })
                      }
                      placeholder="Enter full name"
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Email with Mail Icon */}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      value={staffDetails.email}
                      onChange={(e) =>
                        setStaffDetails({ ...staffDetails, email: e.target.value })
                      }
                      placeholder="Enter email"
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Phone with Phone Icon */}
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="phone"
                      type="tel"
                      value={staffDetails.phone}
                      onChange={(e) =>
                        setStaffDetails({ ...staffDetails, phone: e.target.value })
                      }
                      placeholder="Enter phone number"
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="aadhar">Aadhar</Label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="aadhar"
                      type="text"
                      inputMode="numeric"
                      value={staffDetails.documents[0].document_number.replace(/(\d{4})(?=\d)/g, "$1 ")}
                      placeholder="XXXX XXXX XXXX"
                      onChange={(e) => {
                        const rawDigits = e.target.value.replace(/\D/g, "").slice(0, 12);

                        setStaffDetails({
                          ...staffDetails,
                          documents: [
                            {
                              ...staffDetails.documents[0],
                              document_number: rawDigits
                            }
                          ]
                        });
                      }}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Profile Image Upload (Step 1) */}
                <div className="space-y-2 mt-2">
                  <Label htmlFor="profile_image_step1">Document Image</Label>
                  <div className="flex items-start space-x-4 min-h-[96px]">
                    <div className="w-48 flex-shrink-0 relative">
                      <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                      <Input
                        id="profile_image_step1"
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        className="cursor-pointer text-transparent pl-10"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];

                            // Explicitly allow only basic image formats (excludes GIF, PDF, etc.)
                            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

                            if (!allowedTypes.includes(file.type)) {
                              alert("Please select a valid image (JPG, PNG, or WebP).");
                              e.target.value = "";
                              return;
                            }

                            setStaffDetails({
                              ...staffDetails,
                              documents: [
                                {
                                  ...staffDetails.documents[0],
                                  document_file: file
                                }
                              ],
                            });
                          }
                        }}
                      />
                    </div>


                    <div className="w-24 h-24 flex-shrink-0 rounded-md bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center relative -mt-4">
                      {/* Validation: Only show preview if it is an image file */}
                      {staffDetails.documents[0].document_file && staffDetails.documents[0].document_file.type.startsWith('image/') ? (
                        <>
                          <img
                            src={URL.createObjectURL(staffDetails.documents[0].document_file)}
                            alt="Profile preview"
                            className="w-full h-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-gray-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-sm transition-colors"
                            onClick={() => {
                              setStaffDetails({
                                ...staffDetails,
                                documents: [
                                  {
                                    ...staffDetails.documents[0],
                                    document_file: null
                                  }
                                ],
                              });
                            }}
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <Image className="h-8 w-8 text-gray-200" />
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* --------------------------------------------------- Step 2: Staff Details ---------------------------------------------------------------- */}

            {currentStep === 2 && (
              <div className="mt-0">
                <div className="grid grid-cols-2 gap-4">
                  {/* Designation with Briefcase Icon */}
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="designation"
                        type="text"
                        value={staffDetails.designation}
                        onChange={(e) => setStaffDetails({ ...staffDetails, designation: e.target.value })}
                        placeholder="e.g.- Chef"
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Department with Building Icon */}
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="department"
                        type="text"
                        value={staffDetails.department}
                        onChange={(e) => setStaffDetails({ ...staffDetails, department: e.target.value })}
                        placeholder="e.g.- Kitchen"
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Joining Date */}
                  <div className="space-y-2">
                    <Label htmlFor="joining_date">Joining Date</Label>
                    <Input
                      id="joining_date"
                      type="date"
                      value={staffDetails.joining_date}
                      onChange={(e) => setStaffDetails({ ...staffDetails, joining_date: e.target.value })}
                      required
                    />
                  </div>

                  {/* Monthly Salary */}
                  <div className="space-y-2">
                    <Label htmlFor="monthly_salary">Monthly Salary (₹)</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="monthly_salary"
                        type="number"
                        min="0"
                        step="0.01"
                        value={staffDetails.monthly_salary}
                        onChange={(e) => setStaffDetails({ ...staffDetails, monthly_salary: e.target.value })}
                        placeholder="0.00"
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Shift Selection */}
                  <div className="space-y-2 ">
                    <Label htmlFor="shift">Shift</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        id="shift"
                        value={getshiftLabel(staffDetails.shift_start) || ""}
                        onChange={(e) => {
                          const selectedShift = e.target.value;
                          if (selectedShift) {
                            setStaffDetails({
                              ...staffDetails,
                              shift_start: shiftTimeMap[selectedShift].start,
                              shift_end: shiftTimeMap[selectedShift].end,
                            });
                          }
                        }}
                        required
                        className="w-full h-10 pl-10 pr-4 text-base font-semibold text-gray-800 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                      >
                        <option value="" disabled>Select Shift</option>
                        <option value="Morning">Morning</option>
                        <option value="Evening">Evening</option>
                        <option value="Night">Night</option>
                      </select>
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="role_slug">Role</Label>
                    <div className="relative">
                      <UserCog className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        id="role_slug"
                        value={staffDetails.role_slug}
                        onChange={(e) => setStaffDetails({ ...staffDetails, role_slug: e.target.value })}
                        required
                        className="w-full h-10 pl-10 pr-4 text-base font-semibold text-gray-800 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                      >
                        <option value="" disabled>Select Role</option>
                        {allRoles
                          .filter((role) => role.slug !== "admin")
                          .map((role) => (
                            <option key={role.slug} value={role.slug}>
                              {role.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  {/* Profile Image Upload (Step 2) */}
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="profile_image">Profile Image</Label>
                    <div className="flex items-start space-x-4 min-h-[96px]">
                      <div className="w-48 flex-shrink-0 relative">
                        <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        <Input
                          ref={fileInputRef}
                          id="profile_image"
                          type="file"
                          accept="image/jpeg,image/png,image/jpg,image/webp"
                          className="cursor-pointer text-transparent pl-10"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

                              if (!allowedTypes.includes(file.type)) {
                                alert("Please select a valid image (JPG, PNG, or WebP).");
                                e.target.value = "";
                                return;
                              }

                              setStaffDetails({ ...staffDetails, profile_image: file });
                            }
                          }}
                        />
                      </div>

                      {/* Added -mt-4 to move the preview container up */}
                      <div className="w-24 h-24 flex-shrink-0 rounded-md bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center relative -mt-4">
                        {staffDetails.profile_image ? (
                          <>
                            <img
                              src={URL.createObjectURL(staffDetails.profile_image)}
                              alt="Profile preview"
                              className="w-full h-full object-cover rounded-md"
                            />
                            <button
                              type="button"
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-sm transition-colors"
                              onClick={() => {
                                setStaffDetails({ ...staffDetails, profile_image: null });
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = '';
                                }
                              }}
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <Image className="h-8 w-8 text-gray-200" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 ? (
              <DialogFooter className="flex justify-end mt-4">
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!isStep1Valid()}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </DialogFooter>
            ) : (
              <DialogFooter className="grid grid-cols-2 gap-4 mt-4">
                <Button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={loading}
                  className="w-full flex items-center justify-center bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>

                <Button
                  type="submit"
                  className="w-full flex items-center justify-center bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading || !isShiftTimeValid}
                >
                  {loading ? (
                    <Spinner />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Staff
                    </>
                  )}
                </Button>
              </DialogFooter>
            )}

          </form>
        </DialogContent>
      </Dialog>


      {/* ------------------------------------------------------------- Tabs Bar --------------------------------------------------------------------------------- */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 items-stretch bg-transparent shadow-sm z-50">
          {hotelSlug.role !== "admin" && <TabsTrigger value="overview" className="w-full text-sm text-center py-2 px-2 whitespace-normal rounded-md transition-colors data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-white/60 data-[state=inactive]:text-gray-700">Staff Overview</TabsTrigger>}
          <TabsTrigger value="schedule" className="w-full text-sm text-center py-2 px-2 whitespace-normal rounded-md transition-colors data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-white/60 data-[state=inactive]:text-gray-700">Schedule</TabsTrigger>
          <TabsTrigger value="payroll" className="w-full text-sm text-center py-2 px-2 whitespace-normal rounded-md transition-colors data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-white/60 data-[state=inactive]:text-gray-700">Payroll</TabsTrigger>
          <TabsTrigger value="performance" className="w-full text-sm text-center py-2 px-2 whitespace-normal rounded-md transition-colors data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-white/60 data-[state=inactive]:text-gray-700">Performance</TabsTrigger>
          <TabsTrigger value="attendance" className="w-full text-sm text-center py-2 px-2 whitespace-normal rounded-md transition-colors data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-white/60 data-[state=inactive]:text-gray-700">Attendance</TabsTrigger>
        </TabsList>

        <div className="h-20 md:h-12" aria-hidden />

        <TabsContent value="overview" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Staff Directory</h2>
              <p className="text-gray-600">Manage your team members</p>
            </div>
            <Button onClick={() => setShowAddStaff(true)} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"

            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Staff Member
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AllStaff.map((member) => (
              <StaffCard key={member.id} member={member} />
            ))}
          </div>
          {/* ------------------------------------------------------ Edit Staff --------------------------------------------------------------------------- */}
          {isDetailOpen && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-start sm:items-center z-50 p-4 h-dvh pt-24 pb-24 sm:pb-8">
              <div className="bg-white p-3 sm:p-6 rounded-2xl shadow-2xl max-w-4xl w-full border-l-8 border-indigo-600 transform transition-all duration-300 scale-100 max-h-[calc(100dvh-8rem)] flex flex-col relative overflow-y-auto">
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-red-600 z-10 transition-colors"
                >
                  <XCircle className="w-9 h-9 sm:w-10 sm:h-10 drop-shadow-md" />
                </button>
                {/* Header */}
                <div className="flex flex-row flex-wrap justify-between items-start pb-6 mb-6 border-b border-gray-200 pt-10 sm:pt-0">
                  <div className="flex flex-row items-center flex-nowrap space-x-4 w-full sm:w-auto">
                    <div className="relative flex-shrink-0 mr-2 sm:mr-6">
                      {displayImage ? (
                        <img
                          src={displayImage}
                          alt={currentMember?.user_full_name || 'Staff Profile'}
                          className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200 shadow-md"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-indigo-100 border-4 border-indigo-200 flex items-center justify-center">
                          <User className="w-12 h-12 text-indigo-500" />
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        title="Select Image"
                        onClick={handleCameraClick}
                        className="absolute bottom-0 right-0 p-1 bg-indigo-600 text-white rounded-full border-2 border-white shadow-lg hover:bg-indigo-700 transition-colors"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-col justify-center">
                      <div>
                        <input
                          type="text"
                          value={currentMember?.user_full_name || ''}
                          onChange={(e) => handleInputChange('user_full_name', e.target.value)}
                          className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight w-full bg-transparent border-b border-transparent focus:border-indigo-200 focus:outline-none"
                          placeholder="Enter Full Name"
                        />
                      </div>
                      <div className="mt-1">
                        <input
                          type="text"
                          value={currentMember?.designation || ''}
                          onChange={(e) => handleInputChange('designation', e.target.value)}
                          className="text-lg sm:text-xl text-indigo-600 font-semibold w-full bg-transparent border-b border-indigo-200 focus:border-indigo-500 focus:outline-none hover:border-indigo-400 transition-colors"
                          placeholder="Enter Designation"
                        />
                      </div>
                      <div className="flex items-center mt-2">
                        {/* Status Badge Select - Options CENTER ALIGNED */}
                        <div className="relative inline-flex items-center justify-center">
                          <select
                            value={currentMember?.status || 'active'}
                            onChange={(e) => handleInputChange('status', e.target.value)}
                            className={`px-2 py-1 text-center text-xs font-bold rounded-full border-2 cursor-pointer transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1  bg-white min-w-0 max-w-fit flex items-center justify-center
                            ${currentMember?.status === 'active' ? 'text-green-800  hover:bg-green-50' : ''}
                            ${currentMember?.status === 'inactive' ? 'text-red-800  hover:bg-red-50' : ''}
                            ${currentMember?.status === 'on_leave' ? 'text-yellow-800  hover:bg-yellow-50' : 'text-gray-800 '}
                            appearance-none [-webkit-appearance:none] [-moz-appearance:none]`}
                            style={{
                              backgroundImage: 'none',
                              paddingRight: '0.5rem'
                            }}
                          >
                            <option value="active" className="text-center">Active</option>
                            <option value="inactive" className="text-center">Inactive</option>
                            <option value="on_leave" className="text-center">On Leave</option>
                          </select>
                        </div>
                        {/* Department - Same */}
                        {currentMember?.department && (
                          <span className="ml-3 text-sm text-gray-600 font-medium">
                            {currentMember.department}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Saare fields same as before... */}
                  {/* Department */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <Briefcase className="w-5 h-5 text-indigo-500" />
                    <div className="w-full">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Department</p>
                      <input
                        type="text"
                        value={currentMember.department || ''}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className="text-base font-semibold text-gray-800 w-full bg-transparent border-b border-gray-300 focus:border-indigo-500 outline-none"
                        placeholder="Enter Department"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <Clock className="w-5 h-5 text-pink-500" />
                    <div className="w-full">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</p>
                      <select
                        value={getshiftLabel(currentMember.shift_start) || ""}
                        onChange={(e) => {
                          const selectedShift = e.target.value;
                          console.log("Selected Shift:", selectedShift); // Debug log
                          if (selectedShift) {
                            handleInputChange('shift_start', shiftTimeMap[selectedShift].start);
                            handleInputChange('shift_end', shiftTimeMap[selectedShift].end);
                            console.log("Updated Shift Start:", shiftTimeMap[selectedShift].start, "End:", shiftTimeMap[selectedShift].end); // Debug log
                          } else {
                            handleInputChange('shift_start', "");
                            handleInputChange('shift_end', "");
                          }
                        }}
                        className="text-base font-semibold text-gray-800 w-full bg-transparent border-b border-gray-300 focus:border-indigo-500 outline-none"
                      >
                        <option value="" disabled>Select Shift</option>
                        <option value="Morning">Morning</option>
                        <option value="Evening">Evening</option>
                        <option value="Night">Night</option>
                      </select>
                    </div>
                  </div>
                  {/* Email */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <div className="w-full">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</p>
                      <input
                        type="email"
                        value={currentMember.user_email || ''}
                        onChange={(e) => handleInputChange('user_email', e.target.value)}
                        className="text-base text-blue-600 w-full bg-transparent border-b border-gray-300 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                  {/* Phone No */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <Phone className="w-5 h-5 text-teal-500" />
                    <div className="w-full">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone No.</p>
                      <input
                        type="tel"
                        value={currentMember.user_phone || ''}
                        onChange={(e) => handleInputChange('user_phone', e.target.value)}
                        className="text-base w-full bg-transparent border-b border-gray-300 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                  {/* Monthly Salary */}
                  <div className="col-span-2 bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="flex items-center space-x-3">
                      <Banknote className="w-6 h-6 text-indigo-700" />
                      <p className="text-sm font-medium text-indigo-700 uppercase tracking-wider">Monthly Salary</p>
                    </div>
                    <div className="flex items-center w-full sm:w-1/3">
                      <IndianRupee className="w-5 h-5 text-indigo-800 mr-1" />
                      <input
                        type="number"
                        value={currentMember.monthly_salary || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const numericString = val.replace(/\D/g, '');

                          handleInputChange('monthly_salary', numericString);
                        }}
                        className="font-extrabold text-indigo-800 text-3xl bg-transparent border-b-2 border-indigo-400 focus:border-indigo-600 outline-none text-right w-full"
                      />

                    </div>
                  </div>
                  {/* Buttons */}
                  <div className="col-span-2 flex flex-row flex-wrap justify-between gap-3 mt-auto pt-4">
                    <button
                      onClick={() => setIsDetailOpen(false)}

                      className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors text-sm font-semibold shadow-md"
                      disabled={isSaving}
                    >
                      CANCEL
                    </button>
                    <button
                      onClick={saveStaffMember}
                      disabled={isSaving}
                      // title={shiftTimeError ?? undefined}
                      className={`flex-1 flex items-center justify-center space-x-2 ${isSaving ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white py-1 px-2 rounded-xl transition-colors text-sm font-semibold shadow-lg`}
                    >
                      {isSaving ? (
                        <>
                          <Spinner />
                          <span>SAVING...</span>
                        </>
                      ) : (
                        <>
                          <CheckSquare className="w-5 h-5" />
                          <span>SAVE </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* <--------------------- Staff Schedule Tab Content ---------------------> */}

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2" />
                Staff Schedule
              </CardTitle>
              <CardDescription>Manage work schedules and shifts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Calendar */}
                <div>
                  <Calendar mode="single" className="rounded-md border" />
                </div>

                {/* Staff List */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Today's Schedule</h3>
                  <div className="overflow-y-auto max-h-96 space-y-3">
                    {AllStaff.filter(s => s.status === 'active').map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            {member.profile_image ? (
                              <img
                                src={member.profile_image}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <AvatarFallback className="flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-400" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{member.user_full_name}</p>
                            <p className="text-xs text-gray-600">{member.designation || "Staff"}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            {member.shift_start ? (
                              <Badge variant="outline" className="text-xs">
                                {getshiftLabel(member.shift_start)}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs text-gray-500 border-gray-300">
                                No Shift Set
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        {/* <--------------------- Attendance Tab Content ---------------------> */}

        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2" />
                Attendance
              </CardTitle>
              <CardDescription>Manage work schedules and shifts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <Calendar
                    mode="single"
                    selected={new Date(selectedDate)}
                    onSelect={(date) => {
                      if (date) {
                        // Format the date in local timezone as YYYY-MM-DD
                        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                        setSelectedDate(formattedDate);
                        console.log(formattedDate)
                      }
                    }}
                    className="rounded-md border"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">Attendance for {selectedDate}</h3>

                  </div>
                  {/* Add Attendance Dialog (opened from this tab) */}

                  <div className="max-h-[500px] overflow-y-auto scrollbar-thin border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Staff</th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {AllStaff.filter(s => s.status === 'active').map((staff) => {
                          const attendance = staff.attendance_records?.find(record => record.date === selectedDate);

                          return (
                            <tr
                              key={staff.id}
                              className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-16"
                            >
                              <td className="px-6 py-4 flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
                                  {staff.profile_image ? (
                                    <img
                                      src={staff.profile_image}
                                      className="w-full h-full object-cover"
                                      alt={staff.slug}
                                    />
                                  ) : (
                                    <User className="w-6 h-6 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{staff.user_full_name}</div>
                                  <div className="text-xs text-gray-500">
                                    {staff.attendance_records && staff.attendance_records.length > 0
                                      ? (() => {
                                        const record = staff.attendance_records?.find(r => r.date === selectedDate);
                                        if (!record) return "—";

                                        if (record.status !== "present") {
                                          return record.status.charAt(0).toUpperCase() + record.status.slice(1);
                                        }

                                        const getShift = (time: string) => {
                                          if (!time) return "—";
                                          const hour = parseInt(time.split(":")[0]);
                                          if (hour >= 6 && hour < 12) return "Morning";
                                          if (hour >= 12 && hour < 17) return "Afternoon";
                                          if (hour >= 17 && hour < 21) return "Evening";
                                          return "Night";
                                        };

                                        const checkInShift = getShift(record.check_in);
                                        let checkOutShift = getShift(record.check_out);

                                        if (record.check_in && record.check_out) {
                                          const checkInHour = parseInt(record.check_in.split(":")[0]);
                                          const checkOutHour = parseInt(record.check_out.split(":")[0]);
                                          if (checkOutHour < checkInHour) checkOutShift = "Night";
                                        }

                                        return `${checkInShift} - ${checkOutShift}`;
                                      })()
                                      : "—"}
                                  </div>
                                  <div className="text-xs text-gray-500">{staff.designation}</div>
                                </div>
                              </td>

                              <td className="px-6 py-4 text-center">
                                {attendance ? (
                                  <div className="flex items-center justify-start gap-2">
                                    <input
                                      type="radio"
                                      checked
                                      readOnly
                                      className={`w-4 h-4 ${attendance.status === "present" ? "accent-green-600" : "accent-red-600"}`}
                                    />
                                    <span className={attendance.status === "present" ? "text-green-600" : "text-red-600"}>
                                      {attendance.status === "present"
                                        ? "Present"
                                        : attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                                    </span>
                                  </div>
                                ) : "—"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* <--------------------- Payroll Tab Content ---------------------> */}

        <TabsContent value="payroll" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Banknote className="w-6  h-6 mr-2" />
                Payroll Management
              </CardTitle>
              <CardDescription>Manage salaries and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-y-auto scrollbar-thin max-h-96 space-y-4">
                  {AllStaff.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-8 h-8">
                          {member.profile_image ? (
                            <img
                              src={member.profile_image}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <AvatarFallback className="flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-400" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-sm">{member.user_full_name}</h3>
                          <p className="text-xs text-gray-600">{member.designation || "Staff"}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">

                        <div className="text-right">
                          <p className="font-semibold text-lg flex items-center justify-end">
                            {/* The 'flex' and 'items-center' on the parent <p> ensures alignment */}
                            <IndianRupee />
                            {member.monthly_salary.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600">per month</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>

          </Card>
        </TabsContent>

        {/* <--------------------- Performance Tab Content ---------------------> */}

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ChartBarDecreasing className="w-5.5 h-5.5 mr-2" />
                Performance Analytics
              </CardTitle>
              <CardDescription>Track and analyze staff performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="overflow-y-auto scrollbar-thin max-h-96 space-y-4">
                  {AllStaff.map((member) => (
                    <div key={member.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            {member.profile_image ? (
                              <img
                                src={member.profile_image}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <AvatarFallback>
                                <User className="w-5 h-5 text-gray-400" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{member.user_full_name}</h3>
                            <p className="text-sm text-gray-600">{member.designation}</p>
                          </div>
                        </div>

                        <div className="text-right flex items-center space-x-2">
                          <div>
                            <p className="text-lg font-bold">{member.performance_score}%</p>
                            <p className="text-xs text-gray-600">Performance Score</p>
                          </div>
                        </div>
                      </div>

                      <Progress value={member.performance_score} className="h-3" />

                      <div className="flex justify-between text-xs text-gray-600 mt-2">
                        <span>
                          Joined:{" "}
                          {member.joining_date &&
                            new Date(member.joining_date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                        </span>

                        <span
                          className={
                            member.performance_score >= 90
                              ? "text-green-600 font-semibold"
                              : member.performance_score >= 80
                                ? "text-yellow-600 font-semibold"
                                : "text-red-600 font-semibold"
                          }
                        >
                          {member.performance_score >= 90
                            ? "Excellent"
                            : member.performance_score >= 80
                              ? "Good"
                              : "Needs Improvement"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>


          </Card>
        </TabsContent>
      </Tabs>
    </div >
  );

}

export default StaffManagement; 