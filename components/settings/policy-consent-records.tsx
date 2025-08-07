"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Check, Calendar } from "lucide-react"

export function PolicyConsentRecords() {
  const router = useRouter()

  const policies = [
    {
      id: "terms",
      name: "Terms of Use",
      version: "2.1",
      signedDate: "2025-08-05",
      status: "signed",
      route: "/terms",
    },
    {
      id: "privacy",
      name: "Privacy Policy",
      version: "1.8",
      signedDate: "2025-08-05",
      status: "signed",
      route: "/privacy",
    },
  ]

  return (
    <Card className="bg-white border">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#3A6EFF]" />
          Policy & Consent Records
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.map((policy) => (
            <div key={policy.id} className="p-4 bg-muted rounded-lg border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-slate-900 font-medium">{policy.name}</h3>
                  <p className="text-muted-foreground text-sm">Version {policy.version}</p>
                </div>
                <Badge className="bg-[#22D3A6]/10 text-[#22D3A6] border border-[#22D3A6]/30">
                  <Check className="w-3 h-3 mr-1" />
                  Signed
                </Badge>
              </div>

              <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Signed on {policy.signedDate}</span>
              </div>

              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(policy.route)}
                className="justify-start"
              >
                View Document
              </Button> */}
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <p className="text-muted-foreground text-sm">
            All policies have been digitally signed and are stored securely. You will be notified of any policy updates
            that require your consent.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
