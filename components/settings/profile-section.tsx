"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { User, Shield, Edit2, Check, X, Eye, EyeOff } from "lucide-react"

export function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "Dr. Sarah Chen",
    organization: "MIT Research Lab",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handlePasswordChange = (password: string) => {
    setFormData((prev) => ({ ...prev, newPassword: password }))
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    if (/[^A-Za-z0-9]/.test(password)) strength += 25
    setPasswordStrength(strength)
  }

  const getStrengthColor = () => {
    if (passwordStrength < 50) return "bg-rose-500"
    if (passwordStrength < 75) return "bg-amber-500"
    return "bg-[#22D3A6]"
  }

  const getStrengthText = () => {
    if (passwordStrength < 50) return "Weak"
    if (passwordStrength < 75) return "Medium"
    return "Strong"
  }

  return (
    <Card className="bg-white border">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-[#3A6EFF]" />
          Profile Information
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label>Full Name</Label>
            <div className="relative">
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                disabled={!isEditing}
              />
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email Address</Label>
            <div className="relative">
              <Input value="sarah.chen@mit.edu" disabled className="text-muted-foreground" />
              <Badge className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#22D3A6]/10 text-[#22D3A6] border border-[#22D3A6]/20">
                <Check className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>

          {/* Organization */}
          <div className="space-y-2">
            <Label>Organization</Label>
            <Input
              value={formData.organization}
              onChange={(e) => setFormData((prev) => ({ ...prev, organization: e.target.value }))}
              disabled={!isEditing}
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label>Role</Label>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#3A6EFF]/10 text-[#3A6EFF] border border-[#3A6EFF]/20">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t">
          {isEditing ? (
            <>
              <Button
                onClick={() => setIsEditing(false)}
                className="bg-[#22D3A6] hover:bg-[#22D3A6]/90 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Change Password</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={formData.currentPassword}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, currentPassword: e.target.value }))
                        }
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                    />
                    {formData.newPassword && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Password Strength</span>
                          <span
                            className={`font-medium ${
                              passwordStrength >= 75
                                ? "text-[#22D3A6]"
                                : passwordStrength >= 50
                                ? "text-amber-500"
                                : "text-rose-500"
                            }`}
                          >
                            {getStrengthText()}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                            style={{ width: `${passwordStrength}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                      }
                    />
                    {formData.confirmPassword &&
                      formData.newPassword !== formData.confirmPassword && (
                        <p className="text-rose-500 text-sm">Passwords do not match</p>
                      )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button
                      disabled={
                        !formData.currentPassword ||
                        !formData.newPassword ||
                        formData.newPassword !== formData.confirmPassword
                      }
                      className="bg-[#3A6EFF] hover:bg-[#3A6EFF]/80 text-white"
                    >
                      Update Password
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
