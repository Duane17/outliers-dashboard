"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Shield,
  Smartphone,
  Key,
  Copy,
  AlertTriangle,
  Check,
} from "lucide-react"

export function SecurityMFASection() {
  const [mfaEnabled, setMfaEnabled] = useState(true)
  const recoveryCodes = [
    "A1B2-C3D4-E5F6",
    "G7H8-I9J0-K1L2",
    "M3N4-O5P6-Q7R8",
    "S9T0-U1V2-W3X4",
    "Y5Z6-A7B8-C9D0",
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Card className="bg-white border">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#3A6EFF]" />
          Security & Multi-Factor Authentication
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* MFA Status */}
        <div className="flex items-center justify-between p-4 rounded-lg border bg-muted">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-[#22D3A6]" />
            <div>
              <h3 className="text-slate-900 font-medium">Multi-Factor Authentication</h3>
              <p className="text-muted-foreground text-sm">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {mfaEnabled && (
              <Badge className="bg-[#22D3A6]/10 text-[#22D3A6] border border-[#22D3A6]/30">
                <Check className="w-3 h-3 mr-1" />
                Enabled
              </Badge>
            )}
            <Switch
              checked={mfaEnabled}
              onCheckedChange={setMfaEnabled}
              className="data-[state=checked]:bg-[#22D3A6]"
            />
          </div>
        </div>

        {/* MFA Actions */}
        {mfaEnabled ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* QR Code */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <Smartphone className="w-4 h-4 mr-2" />
                  View QR Code
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Authenticator App Setup</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex justify-center p-6 bg-gray-100 rounded-lg">
                    <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-sm">QR Code Placeholder</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm">
                      Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                    </p>
                    <div className="p-3 bg-muted rounded border text-sm font-mono">
                      <p className="text-muted-foreground text-xs">Manual entry key:</p>
                      <p className="text-slate-900 font-mono">JBSWY3DPEHPK3PXP</p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Recovery Codes */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <Key className="w-4 h-4 mr-2" />
                  Recovery Codes
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Recovery Codes</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Alert className="bg-yellow-100 border border-yellow-300">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      Save these codes in a secure location. Each code can only be used once.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 gap-2">
                    {recoveryCodes.map((code, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted rounded border"
                      >
                        <span className="font-mono text-slate-900">{code}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(code)}
                          className="text-muted-foreground hover:text-[#3A6EFF]"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => copyToClipboard(recoveryCodes.join("\n"))}
                    className="w-full bg-[#3A6EFF] hover:bg-[#3A6EFF]/80 text-white"
                  >
                    Copy All Codes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <Alert className="bg-rose-100 border border-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <AlertDescription className="text-rose-800">
              Multi-factor authentication is disabled. Your account is less secure without MFA enabled.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
