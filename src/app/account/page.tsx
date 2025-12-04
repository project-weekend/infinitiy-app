"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { apiClient } from "@/infrastructure/api/api-client";
import { toast } from "sonner";
import {
  IconUser,
  IconMail,
  IconCalendar,
  IconEdit,
  IconCheck,
  IconX,
  IconBriefcase,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";

interface UserProfile {
  role_id: number;
  user_id: string;
  name: string;
  email: string;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  data: UserProfile;
}

export default function AccountPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPronunciation, setIsEditingPronunciation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    namePronunciation: "",
    displayName: "",
    title: "",
    city: "",
    country: "",
    employeeType: "",
    email: "",
    phone: "",
    mobilePhone: "",
  });

  const [formErrors, setFormErrors] = useState({
    fullName: "",
    namePronunciation: "",
  });

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.post<ApiResponse>("/api/v1/user/me", {});
      setProfile(response.data);
      setFormData({
        fullName: response.data.name,
        namePronunciation: "", // Hardcoded - not in API
        displayName: response.data.name, // Using name as display name
        title: "Software Engineer", // Hardcoded
        city: "Jakarta", // Hardcoded
        country: "Indonesia", // Hardcoded
        employeeType: "Full Time", // Hardcoded
        email: response.data.email,
        phone: "+62 21 1234 5678", // Hardcoded
        mobilePhone: "+62 812 3456 7890", // Hardcoded
      });
    } catch (err: any) {
      console.error("Failed to fetch profile:", err);
      setError(err.message || "Failed to load profile");
      toast.error("Failed to load profile", {
        description: err.message || "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchProfile();
    }
  }, [authLoading]);

  // Validate form
  const validateForm = (): boolean => {
    const errors = {
      fullName: "",
      namePronunciation: "",
    };

    if (!formData.fullName.trim()) {
      errors.fullName = "Full Name is required";
    }

    setFormErrors(errors);
    return !errors.fullName && !errors.namePronunciation;
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      // TODO: Replace with actual update endpoint when available
      // For now, we'll simulate the update
      await apiClient.put("/api/v1/user/profile", {
        name: formData.fullName,
        name_pronunciation: formData.namePronunciation,
      });

      // Update local state
      if (profile) {
        setProfile({
          ...profile,
          name: formData.fullName,
        });
      }

      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      toast.error("Failed to update profile", {
        description: err.message || "Please try again later",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (profile) {
      setFormData({
        fullName: profile.name,
        namePronunciation: "", // Reset to empty
        displayName: profile.name,
        title: "Software Engineer",
        city: "Jakarta",
        country: "Indonesia",
        employeeType: "Full Time",
        email: profile.email,
        phone: "+62 21 1234 5678",
        mobilePhone: "+62 812 3456 7890",
      });
    }
    setFormErrors({
      fullName: "",
      namePronunciation: "",
    });
    setIsEditing(false);
  };

  // Handle save pronunciation only
  const handleSavePronunciation = async () => {
    try {
      setIsSaving(true);
      // TODO: Replace with actual update endpoint when available
      await apiClient.put("/api/v1/user/profile", {
        name_pronunciation: formData.namePronunciation,
      });

      setIsEditingPronunciation(false);
      toast.success("Name pronunciation updated successfully");
    } catch (err: any) {
      console.error("Failed to update pronunciation:", err);
      toast.error("Failed to update pronunciation", {
        description: err.message || "Please try again later",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel pronunciation edit
  const handleCancelPronunciation = () => {
    // Reset to previous value (empty for now)
    setFormData((prev) => ({
      ...prev,
      namePronunciation: "",
    }));
    setIsEditingPronunciation(false);
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Check if user can edit (only role_id = 1)
  const canEdit = profile?.role_id === 1;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 md:px-6">
              {/* Main Content */}
              {error && !isLoading ? (
                <Card>
                  <CardContent className="py-12">
                    <div className="text-center">
                      <p className="text-destructive mb-4">{error}</p>
                      <Button onClick={fetchProfile} variant="outline">
                        Retry
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="w-full space-y-6">
                  {/* Profile Header Card */}
                  <Card>
                    <CardContent className="py-8">
                      {isLoading ? (
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                          <Skeleton className="size-24 rounded-full shrink-0" />
                          <div className="flex-1 space-y-3 text-center sm:text-left">
                            <Skeleton className="h-7 w-48 mx-auto sm:mx-0" />
                            <Skeleton className="h-4 w-64 mx-auto sm:mx-0" />
                            <Skeleton className="h-6 w-20 mx-auto sm:mx-0" />
                          </div>
                          <Skeleton className="h-10 w-32 shrink-0" />
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                          <Avatar className="size-24 shrink-0">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile?.name}`}
                              alt={profile?.name}
                            />
                            <AvatarFallback className="text-2xl font-semibold">
                              {profile?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 text-center sm:text-left">
                            <h2 className="text-2xl font-semibold tracking-tight">
                              {profile?.name}
                            </h2>
                            <p className="text-muted-foreground mt-1">
                              {formData.title} • {formData.employeeType}
                            </p>
                            <div className="flex gap-2 mt-3 justify-center sm:justify-start">
                              <Badge
                                variant={
                                  profile?.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {profile?.status}
                              </Badge>
                              {profile?.role_id === 1 && (
                                <Badge variant="outline">Administrator</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Personal Information Card */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <IconUser className="size-5" />
                        <CardTitle>Personal Information</CardTitle>
                      </div>
                      <CardDescription>
                        Manage your personal details and how others see you
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="space-y-6">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className="grid grid-cols-1 md:grid-cols-3 gap-4"
                            >
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-10 md:col-span-2" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Full Name */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <label className="text-sm font-medium pt-2">
                              Full Name
                              {isEditing && (
                                <span className="text-destructive ml-1">*</span>
                              )}
                            </label>
                            <div className="md:col-span-2">
                              {isEditing ? (
                                <>
                                  <Input
                                    value={formData.fullName}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        fullName: e.target.value,
                                      }))
                                    }
                                    placeholder="Enter your full name"
                                    aria-invalid={!!formErrors.fullName}
                                  />
                                  {formErrors.fullName && (
                                    <p className="text-sm text-destructive mt-1">
                                      {formErrors.fullName}
                                    </p>
                                  )}
                                </>
                              ) : (
                                <p className="text-sm pt-2">
                                  {formData.fullName || "-"}
                                </p>
                              )}
                            </div>
                          </div>

                          <Separator />

                          {/* Display Name */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <label className="text-sm font-medium text-muted-foreground pt-2">
                              Display Name
                            </label>
                            <div className="md:col-span-2">
                              {isEditing ? (
                                <Input value={formData.displayName} disabled />
                              ) : (
                                <p className="text-sm pt-2 text-muted-foreground">
                                  {formData.displayName || "-"}
                                </p>
                              )}
                            </div>
                          </div>

                          <Separator />

                          {/* Name Pronunciation */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <label className="text-sm font-medium pt-2">
                              Name Pronunciation
                            </label>
                            <div className="md:col-span-2">
                              {isEditing || isEditingPronunciation ? (
                                <div className="space-y-2">
                                  <Input
                                    value={formData.namePronunciation}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        namePronunciation: e.target.value,
                                      }))
                                    }
                                    placeholder="e.g., /ˈdʒɑːn ˈdoʊ/"
                                  />
                                  {isEditingPronunciation && !isEditing && (
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        onClick={handleSavePronunciation}
                                        disabled={isSaving}
                                      >
                                        <IconCheck className="size-3" />
                                        Save
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleCancelPronunciation}
                                        disabled={isSaving}
                                      >
                                        <IconX className="size-3" />
                                        Cancel
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center justify-between pt-2">
                                  <p className="text-sm">
                                    {formData.namePronunciation || "-"}
                                  </p>
                                  {canEdit && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() =>
                                        setIsEditingPronunciation(true)
                                      }
                                    >
                                      <IconEdit className="size-3" />
                                      Edit
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <Separator />

                          {/* Title */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <label className="text-sm font-medium text-muted-foreground pt-2">
                              Title
                            </label>
                            <div className="md:col-span-2">
                              {isEditing ? (
                                <Input value={formData.title} disabled />
                              ) : (
                                <p className="text-sm pt-2 text-muted-foreground">
                                  {formData.title || "-"}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Contact Information Card */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <IconMail className="size-5" />
                        <CardTitle>Contact Information</CardTitle>
                      </div>
                      <CardDescription>
                        Your contact details for communication
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="space-y-6">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="grid grid-cols-1 md:grid-cols-3 gap-4"
                            >
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-10 md:col-span-2" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Email */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <label className="text-sm font-medium text-muted-foreground pt-2">
                              Email Address
                            </label>
                            <div className="md:col-span-2">
                              {isEditing ? (
                                <Input
                                  type="email"
                                  value={formData.email}
                                  disabled
                                />
                              ) : (
                                <p className="text-sm pt-2 text-muted-foreground">
                                  {formData.email || "-"}
                                </p>
                              )}
                            </div>
                          </div>

                          <Separator />

                          {/* Phone */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <label className="text-sm font-medium text-muted-foreground pt-2">
                              Phone
                            </label>
                            <div className="md:col-span-2">
                              {isEditing ? (
                                <Input value={formData.phone} disabled />
                              ) : (
                                <p className="text-sm pt-2 text-muted-foreground">
                                  {formData.phone || "-"}
                                </p>
                              )}
                            </div>
                          </div>

                          <Separator />

                          {/* Mobile Phone */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <label className="text-sm font-medium text-muted-foreground pt-2">
                              Mobile Phone
                            </label>
                            <div className="md:col-span-2">
                              {isEditing ? (
                                <Input value={formData.mobilePhone} disabled />
                              ) : (
                                <p className="text-sm pt-2 text-muted-foreground">
                                  {formData.mobilePhone || "-"}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Location & Employment Card */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <IconBriefcase className="size-5" />
                        <CardTitle>Location & Employment</CardTitle>
                      </div>
                      <CardDescription>
                        Your work location and employment details
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="space-y-6">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="grid grid-cols-1 md:grid-cols-3 gap-4"
                            >
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-10 md:col-span-2" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* City */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <label className="text-sm font-medium text-muted-foreground pt-2">
                              City
                            </label>
                            <div className="md:col-span-2">
                              {isEditing ? (
                                <Input value={formData.city} disabled />
                              ) : (
                                <p className="text-sm pt-2 text-muted-foreground">
                                  {formData.city || "-"}
                                </p>
                              )}
                            </div>
                          </div>

                          <Separator />

                          {/* Country */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <label className="text-sm font-medium text-muted-foreground pt-2">
                              Country
                            </label>
                            <div className="md:col-span-2">
                              {isEditing ? (
                                <Input value={formData.country} disabled />
                              ) : (
                                <p className="text-sm pt-2 text-muted-foreground">
                                  {formData.country || "-"}
                                </p>
                              )}
                            </div>
                          </div>

                          <Separator />

                          {/* Employee Type */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <label className="text-sm font-medium text-muted-foreground pt-2">
                              Employment Type
                            </label>
                            <div className="md:col-span-2">
                              {isEditing ? (
                                <Input value={formData.employeeType} disabled />
                              ) : (
                                <p className="text-sm pt-2 text-muted-foreground">
                                  {formData.employeeType || "-"}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-3 justify-end">
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSaving}
                        size="lg"
                      >
                        <IconX className="size-4" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        size="lg"
                      >
                        <IconCheck className="size-4" />
                        {isSaving ? "Saving Changes..." : "Save Changes"}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
