"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Database,
  Bell,
  Info,
  Shield,
  Users,
  BarChart3,
  AlertTriangle,
} from "lucide-react"

export function DataNotificationPreferences() {
  const [dataVisibility, setDataVisibility] = useState("smpc")
  const [notifications, setNotifications] = useState({
    collaborationInvites: true,
    datasetAlerts: true,
    insightCompletion: false,
    securityReports: true,
  })

  const updateNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Data Visibility Settings */}
      <Card className="bg-white border">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-[#3A6EFF]" />
            Data Visibility Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg border">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label className="text-slate-900 font-medium">Private</Label>
                  <p className="text-muted-foreground text-sm">
                    Only you can access your datasets
                  </p>
                </div>
              </div>
              <Switch
                checked={dataVisibility === "private"}
                onCheckedChange={(checked) =>
                  setDataVisibility(checked ? "private" : "smpc")
                }
                className="data-[state=checked]:bg-[#22D3A6]"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg border">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#22D3A6]" />
                <div className="flex items-center gap-2">
                  <div>
                    <Label className="text-slate-900 font-medium">
                      Available for SMPC
                    </Label>
                    <p className="text-muted-foreground text-sm">
                      Enable secure multi-party computation
                    </p>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-white border text-slate-700">
                        <p className="text-sm">
                          Your data remains encrypted and private while enabling
                          collaborative analysis
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <Switch
                checked={dataVisibility === "smpc"}
                onCheckedChange={(checked) =>
                  setDataVisibility(checked ? "smpc" : "private")
                }
                className="data-[state=checked]:bg-[#22D3A6]"
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <Badge
              className={
                dataVisibility === "smpc"
                  ? "bg-[#22D3A6]/10 text-[#22D3A6] border border-[#22D3A6]/30"
                  : "bg-muted text-muted-foreground border"
              }
            >
              Current:{" "}
              {dataVisibility === "smpc" ? "SMPC Enabled" : "Private Only"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="bg-white border">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#3A6EFF]" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <NotificationRow
              icon={<Users className="w-4 h-4 text-[#3A6EFF]" />}
              label="Collaboration Invites"
              description="New collaboration requests"
              checked={notifications.collaborationInvites}
              onToggle={() => updateNotification("collaborationInvites")}
            />

            <NotificationRow
              icon={<Database className="w-4 h-4 text-[#3A6EFF]" />}
              label="Dataset Access Alerts"
              description="When your data is accessed"
              checked={notifications.datasetAlerts}
              onToggle={() => updateNotification("datasetAlerts")}
            />

            <NotificationRow
              icon={<BarChart3 className="w-4 h-4 text-[#3A6EFF]" />}
              label="Insight Completions"
              description="Analysis results ready"
              checked={notifications.insightCompletion}
              onToggle={() => updateNotification("insightCompletion")}
            />

            <NotificationRow
              icon={<AlertTriangle className="w-4 h-4 text-[#3A6EFF]" />}
              label="Security Reports"
              description="Security alerts and reports"
              checked={notifications.securityReports}
              onToggle={() => updateNotification("securityReports")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function NotificationRow({
  icon,
  label,
  description,
  checked,
  onToggle,
}: {
  icon: React.ReactNode
  label: string
  description: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg border">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <Label className="text-slate-900 text-sm">{label}</Label>
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-[#22D3A6]"
      />
    </div>
  )
}
