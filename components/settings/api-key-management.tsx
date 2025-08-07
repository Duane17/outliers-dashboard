"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Key, Plus, Copy, Trash2, Eye, EyeOff, AlertTriangle } from "lucide-react"

interface APIKey {
  id: string
  name: string
  key: string
  created: string
  status: "active" | "revoked"
}

export function APIKeyManagement() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: "1",
      name: "Production API",
      key: "sk_live_1234567890abcdef",
      created: "2024-01-15",
      status: "active",
    },
    {
      id: "2",
      name: "Development API",
      key: "sk_test_abcdef1234567890",
      created: "2024-01-10",
      status: "active",
    },
  ])

  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [newKeyName, setNewKeyName] = useState("")
  const [generatedKey, setGeneratedKey] = useState("")
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const generateNewKey = () => {
    const newKey = `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    setGeneratedKey(newKey)

    const newApiKey: APIKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: newKey,
      created: new Date().toISOString().split("T")[0],
      status: "active",
    }

    setApiKeys((prev) => [...prev, newApiKey])
    setNewKeyName("")
  }

  const revokeKey = (keyId: string) => {
    setApiKeys((prev) => prev.map((key) => (key.id === keyId ? { ...key, status: "revoked" as const } : key)))
  }

  const maskKey = (key: string) => {
    return `${key.substring(0, 8)}${"*".repeat(16)}${key.substring(key.length - 4)}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-[#3A6EFF]" />
            API Key Management
          </div>
          <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-[#3A6EFF] hover:bg-[#3A6EFF]/80">
                <Plus className="w-4 h-4 mr-2" />
                Generate New Key
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Generate New API Key</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Key Name</Label>
                  <Input
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production API, Development API"
                    className="bg-slate-800/50 border-slate-600 text-white focus:border-[#3A6EFF]"
                  />
                </div>

                {generatedKey && (
                  <div className="space-y-2">
                    <Label className="text-slate-300">Generated API Key</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={generatedKey}
                        readOnly
                        className="bg-slate-800/50 border-slate-600 text-white font-mono"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generatedKey)}
                        className="border-slate-600 text-slate-300"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <Alert className="border-amber-500/50 bg-amber-500/10">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <AlertDescription className="text-amber-200">
                        Make sure to copy your API key now. You won't be able to see it again!
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowGenerateDialog(false)
                      setGeneratedKey("")
                      setNewKeyName("")
                    }}
                    className="border-slate-600 text-slate-300"
                  >
                    {generatedKey ? "Done" : "Cancel"}
                  </Button>
                  {!generatedKey && (
                    <Button
                      onClick={generateNewKey}
                      disabled={!newKeyName.trim()}
                      className="bg-[#3A6EFF] hover:bg-[#3A6EFF]/80"
                    >
                      Generate Key
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {apiKeys.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Key className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No API keys generated yet</p>
            <p className="text-sm">Generate your first API key to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-medium">{apiKey.name}</h3>
                    <Badge
                      className={
                        apiKey.status === "active"
                          ? "bg-[#22D3A6]/20 text-[#22D3A6] border-[#22D3A6]/30"
                          : "bg-rose-500/20 text-rose-500 border-rose-500/30"
                      }
                    >
                      {apiKey.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      className="text-slate-400 hover:text-[#3A6EFF]"
                    >
                      {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(apiKey.key)}
                      className="text-slate-400 hover:text-[#3A6EFF]"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    {apiKey.status === "active" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-rose-500">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-slate-700">
                          <DialogHeader>
                            <DialogTitle className="text-white">Revoke API Key</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-slate-300">
                              Are you sure you want to revoke the API key "{apiKey.name}"? This action cannot be undone
                              and will immediately disable all applications using this key.
                            </p>
                            <div className="flex justify-end gap-3">
                              <Button variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
                                Cancel
                              </Button>
                              <Button onClick={() => revokeKey(apiKey.id)} className="bg-rose-500 hover:bg-rose-600">
                                Revoke Key
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm font-mono">
                      {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm">Created: {apiKey.created}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
