"use client"

import { ProfileSection } from "./profile-section"
import { SecurityMFASection } from "./security-mfa-section"
import { APIKeyManagement } from "./api-key-management"
import { DataNotificationPreferences } from "./data-notification-preferences"
import { PolicyConsentRecords } from "./policy-consent-records"
import { AccountDeletion } from "./account-deletion"
import { VerificationDocuments } from "./verification-documents"

export function AccountSettingsManagement() {
  return (
    <div className="p-6 space-y-8" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Account & Settings</h1>
        <p className="text-slate-400">
          Manage your profile, security settings, and privacy preferences for secure data collaboration.
        </p>
      </div>

      {/* Profile Section */}
      <ProfileSection />

      {/* Security & MFA */}
      <SecurityMFASection />

      {/* API Key Management */}
      {/* <APIKeyManagement /> */}

      {/* Data & Notification Preferences */}
      <DataNotificationPreferences />

      {/* Policy & Consent Records */}
      <PolicyConsentRecords />

      {/* Verification Documents */}
      <VerificationDocuments />

      {/* Account Deletion */}
      <AccountDeletion />
    </div>
  )
}
