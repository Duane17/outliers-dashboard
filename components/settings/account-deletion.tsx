"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, AlertTriangle, Clock } from "lucide-react"

export function AccountDeletion() {
  const [confirmationText, setConfirmationText] = useState("")
  const [isDeletionPending, setIsDeletionPending] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDeleteRequest = () => {
    if (confirmationText === "DELETE MY ACCOUNT") {
      setIsDeletionPending(true)
      setShowDeleteDialog(false)
      setConfirmationText("")
    }
  }

  const cancelDeletion = () => {
    setIsDeletionPending(false)
  }

  return (
    <Card className="bg-white border border-rose-200">
      <CardHeader>
        <CardTitle className="text-rose-600 flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Account Deletion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isDeletionPending ? (
          <div className="space-y-4">
            <Alert className="border-amber-300 bg-amber-50">
              <Clock className="w-4 h-4 text-amber-500" />
              <AlertDescription className="text-amber-700">
                <div className="space-y-2">
                  <p className="font-medium">Account deletion is pending</p>
                  <p className="text-sm">
                    Your account will be permanently deleted in 7 days. You can cancel this request at any time before then.
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            <div className="flex items-center gap-3">
              <Badge className="bg-amber-100 text-amber-600 border border-amber-300">
                <Clock className="w-3 h-3 mr-1" />
                Deletion Scheduled
              </Badge>
              <Button
                onClick={cancelDeletion}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel Deletion
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert className="border-rose-300 bg-rose-50">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <AlertDescription className="text-rose-700">
                <div className="space-y-2">
                  <p className="font-medium">This action cannot be undone</p>
                  <p className="text-sm">Deleting your account will permanently remove all your data, including:</p>
                  <ul className="text-sm list-disc list-inside space-y-1 ml-4">
                    <li>All uploaded datasets and metadata</li>
                    <li>Collaboration history and insights</li>
                    <li>API keys and access tokens</li>
                    <li>Account settings and preferences</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button className="bg-rose-600 hover:bg-rose-700 text-white">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Request Account Deletion
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border border-gray-300">
                <DialogHeader>
                  <DialogTitle className="text-rose-600 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Confirm Account Deletion
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Alert className="border-rose-300 bg-rose-50">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <AlertDescription className="text-rose-700">
                      <p className="font-medium mb-2">This will permanently delete your account</p>
                      <p className="text-sm">
                        After confirmation, you will have 7 days to cancel this request. After that, all your data will
                        be permanently deleted and cannot be recovered.
                      </p>
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label className="text-gray-700">
                      Type <span className="font-mono text-rose-500">DELETE MY ACCOUNT</span> to confirm:
                    </Label>
                    <Input
                      value={confirmationText}
                      onChange={(e) => setConfirmationText(e.target.value)}
                      placeholder="DELETE MY ACCOUNT"
                      className="bg-white border border-gray-300 text-gray-900 focus:border-rose-500"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDeleteDialog(false)
                        setConfirmationText("")
                      }}
                      className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDeleteRequest}
                      disabled={confirmationText !== "DELETE MY ACCOUNT"}
                      className="bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50"
                    >
                      Confirm Deletion
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
