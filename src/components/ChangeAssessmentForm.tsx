import React, { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

export interface StakeholderInput {
  name: string
  severity: number // 1–5
  likelihood: number // 1–5
  notes?: string
}

export interface FormData {
  organizationSize: string
  industry: string
  stakeholderGroups: string[] // kept for backward-compat / analytics
  stakeholders: StakeholderInput[] // NEW detailed array for API
  numberOfStakeholders: string
  changeTypes: string[]
  urgency: string
}

const industries = [
  'Information Technology',
  'Healthcare',
  'Manufacturing',
  'Financial Services',
  'Education',
  'Retail',
  'Logistics & Transportation',
  'Insurance',
  'Government',
  'Construction',
  'Energy & Utilities',
  'Media & Entertainment',
  'Non-Profit',
  'Other',
]

const stakeholderGroupsMap = {
  Internal: [
    'Board / Investors',
    'Executive Leadership',
    'Senior Management',
    'Middle Management',
    'Team Leads',
    'Frontline Employees',
  ],
  Functions: [
    'IT / Engineering',
    'Product / R&D',
    'Operations',
    'HR / People',
    'Finance',
    'Sales',
    'Marketing',
    'Customer Support / Success',
    'Legal / Compliance',
    'Facilities / EHS',
    'Supply Chain / Procurement',
  ],
  External: [
    'Customers',
    'Partners',
    'Vendors / Suppliers',
    'Regulators',
    'Unions / Works Council',
  ],
} as const


const changeTypeOptions = [
  'Technology',
  'Process',
  'Platform',
  'HR',
  'Compliance',
  'Culture',
]

const sanitizeLevel = (n: number | undefined) => {
  const x = Number(n ?? 3)
  if (Number.isNaN(x)) return 3
  return Math.min(5, Math.max(1, Math.round(x)))
}

function ScaleLegend() {
  return (
    <p className="text-xs text-muted-foreground mt-1">
      1 = Low • 5 = High
    </p>
  );
}

export const ChangeAssessmentForm: React.FC = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    organizationSize: '',
    industry: '',
    stakeholderGroups: [],
    stakeholders: [], // NEW
    numberOfStakeholders: '',
    changeTypes: [],
    urgency: '',
  })

  const stakeholderMap = useMemo(() => {
    const map: Record<string, StakeholderInput> = {}
    formData.stakeholders.forEach((s) => (map[s.name] = s))
    return map
  }, [formData.stakeholders])

  const handleStakeholderGroupChange = (group: string, checked: boolean) => {
    setFormData((prev) => {
      const stakeholderGroups = checked
        ? [...prev.stakeholderGroups, group]
        : prev.stakeholderGroups.filter((g) => g !== group)

      let stakeholders = prev.stakeholders
      if (checked) {
        // Add with defaults if missing
        if (!prev.stakeholders.find((s) => s.name === group)) {
          stakeholders = [
            ...prev.stakeholders,
            { name: group, severity: 3, likelihood: 3 },
          ]
        }
      } else {
        // Remove from detailed list
        stakeholders = prev.stakeholders.filter((s) => s.name !== group)
      }

      return { ...prev, stakeholderGroups, stakeholders }
    })
  }

  const handleStakeholderDetail = (
    name: string,
    patch: Partial<StakeholderInput>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      stakeholders: prev.stakeholders.map((s) =>
        s.name === name ? { ...s, ...patch, severity: sanitizeLevel(patch.severity ?? s.severity), likelihood: sanitizeLevel(patch.likelihood ?? s.likelihood) } : s,
      ),
    }))
  }

  const handleChangeTypeChange = (type: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      changeTypes: checked
        ? [...prev.changeTypes, type]
        : prev.changeTypes.filter((t) => t !== type),
    }))
  }

  const validate = (): string | null => {
    if (!formData.organizationSize || !formData.industry || !formData.numberOfStakeholders || !formData.urgency) {
      return 'All fields except multi-select options are required.'
    }
    if (formData.stakeholderGroups.length === 0) {
      return 'At least one stakeholder group must be selected.'
    }
    if (formData.changeTypes.length === 0) {
      return 'At least one change type must be selected.'
    }
    // Ensure each selected group has a stakeholder detail entry
    const missingDetail = formData.stakeholderGroups.find(
      (g) => !formData.stakeholders.find((s) => s.name === g),
    )
    if (missingDetail) {
      return `Please set severity/likelihood for ${missingDetail}.`
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) {
      toast({ title: 'Please fill in all required fields', description: err, variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      // Persist for the next step (email-collection -> API call)
      sessionStorage.setItem('changeAssessmentData', JSON.stringify(formData))
      navigate('/email-collection')
    } catch (error) {
      console.error('Error:', error)
      toast({ title: 'Error processing assessment', description: 'Please try again.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-5xl mx-auto animate-fade-in">
      <CardHeader className="text-center pb-10">
        <CardTitle className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-wide">
          Change Management Assessment
        </CardTitle>
        <CardDescription className="text-xl mt-6 text-foreground/70 max-w-3xl mx-auto leading-relaxed">
          Help us understand your organization and change requirements to provide personalized recommendations
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-10">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Organization Size */}
          <div className="space-y-6">
            <Label className="text-xl font-bold text-foreground">Organization Size *</Label>
            <RadioGroup
              value={formData.organizationSize}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, organizationSize: value }))}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="flex items-center space-x-3 p-6 glass-card rounded-modern hover:bg-white/20 transition-all duration-300 card-hover">
                <RadioGroupItem value="small" id="small" />
                <Label htmlFor="small" className="font-semibold cursor-pointer text-foreground">Small (0-50 employees)</Label>
              </div>
              <div className="flex items-center space-x-3 p-6 glass-card rounded-modern hover:bg-white/20 transition-all duration-300 card-hover">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="font-semibold cursor-pointer text-foreground">Medium (50-500 employees)</Label>
              </div>
              <div className="flex items-center space-x-3 p-6 glass-card rounded-modern hover:bg-white/20 transition-all duration-300 card-hover">
                <RadioGroupItem value="large" id="large" />
                <Label htmlFor="large" className="font-semibold cursor-pointer text-foreground">Large (&gt;500 employees)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Industry */}
          <div className="space-y-6">
            <Label className="text-xl font-bold text-foreground">Industry *</Label>
            <Select value={formData.industry} onValueChange={(value) => setFormData((prev) => ({ ...prev, industry: value }))}>
              <SelectTrigger className="w-full h-14 rounded-modern border-2 glass text-foreground font-medium input-focus">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent className="bg-background glass-card border rounded-modern">
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry} className="font-medium">
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

         {/* Stakeholder Groups (Grouped) */}
<div className="space-y-6">
  <Label className="text-xl font-bold text-foreground">Affected Stakeholder Groups *</Label>

  {/* Internal */}
  <div className="space-y-3">
    <div className="text-sm font-semibold text-muted-foreground">Internal</div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {stakeholderGroupsMap.Internal.map((group) => (
        <div
          key={group}
          className="flex items-center space-x-3 p-4 glass-card rounded-modern hover:bg-white/20 transition-all duration-300 card-hover"
        >
          <Checkbox
            id={group}
            checked={formData.stakeholderGroups.includes(group)}
            onCheckedChange={(checked) =>
              handleStakeholderGroupChange(group, Boolean(checked))
            }
          />
          <Label htmlFor={group} className="font-semibold cursor-pointer text-foreground">
            {group}
          </Label>
        </div>
      ))}
    </div>
  </div>

  {/* Functions */}
  <div className="space-y-3">
    <div className="text-sm font-semibold text-muted-foreground">Functions</div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {stakeholderGroupsMap.Functions.map((group) => (
        <div
          key={group}
          className="flex items-center space-x-3 p-4 glass-card rounded-modern hover:bg-white/20 transition-all duration-300 card-hover"
        >
          <Checkbox
            id={group}
            checked={formData.stakeholderGroups.includes(group)}
            onCheckedChange={(checked) =>
              handleStakeholderGroupChange(group, Boolean(checked))
            }
          />
          <Label htmlFor={group} className="font-semibold cursor-pointer text-foreground">
            {group}
          </Label>
        </div>
      ))}
    </div>
  </div>

  {/* External */}
  <div className="space-y-3">
    <div className="text-sm font-semibold text-muted-foreground">External</div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {stakeholderGroupsMap.External.map((group) => (
        <div
          key={group}
          className="flex items-center space-x-3 p-4 glass-card rounded-modern hover:bg-white/20 transition-all duration-300 card-hover"
        >
          <Checkbox
            id={group}
            checked={formData.stakeholderGroups.includes(group)}
            onCheckedChange={(checked) =>
              handleStakeholderGroupChange(group, Boolean(checked))
            }
          />
          <Label htmlFor={group} className="font-semibold cursor-pointer text-foreground">
            {group}
          </Label>
        </div>
      ))}
    </div>
  </div>
</div>


            {/* NEW: Severity & Likelihood sliders for selected groups */}
            {formData.stakeholderGroups.length > 0 && (
              <div className="mt-4 space-y-4">
                <Label className="text-lg font-semibold text-foreground">Impact Details</Label>
                <div className="grid grid-cols-1 gap-4">
                  {formData.stakeholderGroups.map((g) => {
                    const s = stakeholderMap[g]
                    return (
                      <div key={g} className="p-4 border rounded-modern glass-card">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                          <div className="md:col-span-3">
                            <div className="text-sm font-medium">{g}</div>
                            <Input
                              placeholder="Notes (optional): concerns, influence, location, etc."
                              value={s?.notes || ''}
                              onChange={(e) => handleStakeholderDetail(g, { notes: e.target.value })}
                              className="mt-2"
                            />
                          </div>
                          <div className="md:col-span-4">
                            <div className="text-xs text-muted-foreground">Severity (1–5)</div>
                            <input
                              type="range"
                              min={1}
                              max={5}
                              step={1}
                              value={s?.severity ?? 3}
                              onChange={(e) => handleStakeholderDetail(g, { severity: Number(e.target.value) })}
                              className="w-full"
                            />
                            <div className="text-xs mt-1">{s?.severity ?? 3}</div>
                          </div>
                          <div className="md:col-span-4">
                            <div className="text-xs text-muted-foreground">Likelihood (1–5)</div>
                            <input
                              type="range"
                              min={1}
                              max={5}
                              step={1}
                              value={s?.likelihood ?? 3}
                              onChange={(e) => handleStakeholderDetail(g, { likelihood: Number(e.target.value) })}
                              className="w-full"
                            />
                            <div className="text-xs mt-1">{s?.likelihood ?? 3}</div>
                          </div>
                          <div className="md:col-span-1 text-center">
                            <div className="text-xs text-muted-foreground">Risk</div>
                            <div className="text-sm font-semibold">{(s?.severity ?? 3) * (s?.likelihood ?? 3)}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Number of Stakeholders */}
          <div className="space-y-6">
            <Label className="text-xl font-bold text-foreground">Number of Impacted Stakeholders *</Label>
            <RadioGroup
              value={formData.numberOfStakeholders}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, numberOfStakeholders: value }))}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <div className="flex items-center space-x-3 p-6 glass-card rounded-modern hover:bg-white/20 transition-all duration-300 card-hover">
                <RadioGroupItem value="0-50" id="stakeholders-0-50" />
                <Label htmlFor="stakeholders-0-50" className="font-semibold cursor-pointer text-foreground">0-50</Label>
              </div>
              <div className="flex items-center space-x-3 p-6 glass-card rounded-modern hover:bg-white/20 transition-all duration-300 card-hover">
                <RadioGroupItem value="50-100" id="stakeholders-50-100" />
                <Label htmlFor="stakeholders-50-100" className="font-semibold cursor-pointer text-foreground">50-100</Label>
              </div>
              <div className="flex items-center space-x-3 p-6 glass-card rounded-modern hover:bg-white/20 transition-all duration-300 card-hover">
                <RadioGroupItem value="100-500" id="stakeholders-100-500" />
                <Label htmlFor="stakeholders-100-500" className="font-semibold cursor-pointer text-foreground">100-500</Label>
              </div>
              <div className="flex items-center space-x-3 p-6 glass-card rounded-modern hover:bg-white/20 transition-all duration-300 card-hover">
                <RadioGroupItem value=">500" id="stakeholders-500plus" />
                <Label htmlFor="stakeholders-500plus" className="font-semibold cursor-pointer text-foreground">&gt;500</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Type of Change */}
          <div className="space-y-6">
            <Label className="text-xl font-bold text-foreground">Type of Change *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {changeTypeOptions.map((type) => (
                <div
                  key={type}
                  className="flex items-center space-x-3 p-6 glass-card rounded-modern hover:bg-white/20 transition-all duration-300 card-hover"
                >
                  <Checkbox
                    id={type}
                    checked={formData.changeTypes.includes(type)}
                    onCheckedChange={(checked) => handleChangeTypeChange(type, checked as boolean)}
                  />
                  <Label htmlFor={type} className="font-semibold cursor-pointer text-foreground">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Urgency */}
          <div className="space-y-6">
            <Label className="text-xl font-bold text-foreground">Urgency Level *</Label>
            <Select value={formData.urgency} onValueChange={(value) => setFormData((prev) => ({ ...prev, urgency: value }))}>
              <SelectTrigger className="w-full h-14 rounded-modern border-2 glass text-foreground font-medium input-focus">
                <SelectValue placeholder="Select urgency level" />
              </SelectTrigger>
              <SelectContent className="bg-background glass-card border rounded-modern">
                <SelectItem value="low" className="font-medium">Low (8-12 weeks)</SelectItem>
                <SelectItem value="medium" className="font-medium">Medium (4-8 weeks)</SelectItem>
                <SelectItem value="high" className="font-medium">High (&lt;4 weeks)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-8">
            <Button type="submit" size="lg" className="w-full font-bold text-lg animate-scale-in" disabled={loading}>
              {loading ? 'Preparing Your Summary...' : 'Generate Summary'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
