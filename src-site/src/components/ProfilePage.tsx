// src/components/ProfilePage.tsx
import React, { useState } from "react";

interface UserProfile {
  username: string;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  accountTier: string;
  memberSince: string;
  lastLogin: string;
  securityLevel: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  transactionAlerts: boolean;
  weeklyReports: boolean;
  biometricAuth: boolean;
  smsNotifications: boolean;
}

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Mock user data with realistic business profile
  const [profile, setProfile] = useState<UserProfile>({
    username: localStorage.getItem("iron-bank-username") || "user",
    fullName: "Sarah Johnson",
    title: "Chief Financial Officer",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business District, New York, NY 10001",
    accountTier: "Business Premium",
    memberSince: "March 2020",
    lastLogin: new Date().toISOString(),
    securityLevel: "Enterprise",
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: true,
    loginAlerts: true,
    transactionAlerts: true,
    weeklyReports: false,
    biometricAuth: true,
    smsNotifications: true,
  });

  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);

  const handleEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setTempProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSecurityToggle = (setting: keyof SecuritySettings) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  // @ts-expect-error: any
  const SecurityToggle = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200">
      <div className="flex-1">
        <div className="text-body font-medium text-gray-900">{label}</div>
        <div className="text-body-sm text-gray-600">{description}</div>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          enabled ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h1 text-gray-900 mb-2">Account Profile</h1>
          <p className="text-body text-gray-600">
            Manage your account settings, security preferences, and profile
            information
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="card mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "profile"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "security"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Security & Notifications
              </button>
              <button
                onClick={() => setActiveTab("account")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "account"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Account Details
              </button>
            </nav>
          </div>

          {/* Profile Information Tab */}
          {activeTab === "profile" && (
            <div className="card-body">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-h3 text-gray-900">Personal Information</h3>
                {!isEditing ? (
                  <button onClick={handleEdit} className="btn btn-outline">
                    Edit Profile
                  </button>
                ) : (
                  <div className="space-x-3">
                    <button onClick={handleCancel} className="btn btn-outline">
                      Cancel
                    </button>
                    <button onClick={handleSave} className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfile.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                      className="input"
                    />
                  ) : (
                    <div className="text-body text-gray-900 py-2">
                      {profile.username}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfile.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      className="input"
                    />
                  ) : (
                    <div className="text-body text-gray-900 py-2">
                      {profile.fullName}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Professional Title</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfile.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      className="input"
                    />
                  ) : (
                    <div className="text-body text-gray-900 py-2">
                      {profile.title}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={tempProfile.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="input"
                    />
                  ) : (
                    <div className="text-body text-gray-900 py-2">
                      {profile.email}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={tempProfile.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="input"
                    />
                  ) : (
                    <div className="text-body text-gray-900 py-2">
                      {profile.phone}
                    </div>
                  )}
                </div>

                <div className="form-group md:col-span-2">
                  <label className="form-label">Business Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfile.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className="input"
                    />
                  ) : (
                    <div className="text-body text-gray-900 py-2">
                      {profile.address}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Security & Notifications Tab */}
          {activeTab === "security" && (
            <div className="card-body">
              <h3 className="text-h3 text-gray-900 mb-6">
                Security & Notification Preferences
              </h3>

              <div className="space-y-4 mb-8">
                <SecurityToggle
                  enabled={securitySettings.twoFactorEnabled}
                  onChange={() => handleSecurityToggle("twoFactorEnabled")}
                  label="Two-Factor Authentication"
                  description="Required for all account access and transactions"
                />

                <SecurityToggle
                  enabled={securitySettings.biometricAuth}
                  onChange={() => handleSecurityToggle("biometricAuth")}
                  label="Biometric Authentication"
                  description="Use fingerprint or face recognition for quick access"
                />

                <SecurityToggle
                  enabled={securitySettings.loginAlerts}
                  onChange={() => handleSecurityToggle("loginAlerts")}
                  label="Login Alerts"
                  description="Notify me when my account is accessed from new devices"
                />

                <SecurityToggle
                  enabled={securitySettings.transactionAlerts}
                  onChange={() => handleSecurityToggle("transactionAlerts")}
                  label="Transaction Notifications"
                  description="Real-time alerts for all account transactions"
                />

                <SecurityToggle
                  enabled={securitySettings.smsNotifications}
                  onChange={() => handleSecurityToggle("smsNotifications")}
                  label="SMS Notifications"
                  description="Receive important alerts via text message"
                />

                <SecurityToggle
                  enabled={securitySettings.weeklyReports}
                  onChange={() => handleSecurityToggle("weeklyReports")}
                  label="Weekly Account Summaries"
                  description="Email digest of account activity and balances"
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-h4 text-gray-900 mb-4">Security Actions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button className="btn btn-outline">Change Password</button>
                  <button className="btn btn-outline">
                    Download Backup Codes
                  </button>
                  <button className="btn btn-outline">
                    View Login History
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Account Details Tab */}
          {activeTab === "account" && (
            <div className="card-body">
              <h3 className="text-h3 text-gray-900 mb-6">
                Account Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="form-label">Account Tier</label>
                  <div className="text-body font-semibold text-blue-600 py-2">
                    {profile.accountTier}
                  </div>
                </div>

                <div>
                  <label className="form-label">Security Level</label>
                  <div className="text-body font-semibold status-success py-2">
                    {profile.securityLevel}
                  </div>
                </div>

                <div>
                  <label className="form-label">Member Since</label>
                  <div className="text-body text-gray-900 py-2">
                    {profile.memberSince}
                  </div>
                </div>

                <div>
                  <label className="form-label">Last Login</label>
                  <div className="text-body text-gray-900 py-2">
                    {new Date(profile.lastLogin).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div>
                  <label className="form-label">Account Status</label>
                  <div className="flex items-center py-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-body status-success font-medium">
                      Active & Verified
                    </span>
                  </div>
                </div>

                <div>
                  <label className="form-label">Compliance Status</label>
                  <div className="flex items-center py-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-body status-success font-medium">
                      KYC/AML Compliant
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-red-50 border border-red-200 rounded-md p-6">
                <h4 className="text-h4 status-error mb-4">
                  Account Management
                </h4>
                <p className="text-body text-gray-700 mb-4">
                  These actions require additional verification and may affect
                  your account status.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button className="btn btn-outline border-red-300 text-red-600 hover:bg-red-50">
                    Temporarily Freeze Account
                  </button>
                  <button className="btn btn-outline border-red-300 text-red-600 hover:bg-red-50">
                    Request Account Closure
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Notice */}
        <div className="text-center">
          <p className="text-body-sm text-gray-500">
            Profile changes are logged for security purposes • Contact your
            relationship manager for assistance • All account modifications
            comply with federal banking regulations
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
