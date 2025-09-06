'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { getClinicianSummary } from '@/lib/api'
import { QRCodeCanvas } from 'qrcode.react'
import html2canvas from 'html2canvas'
import { 
  Download, QrCode, User, Calendar, TrendingUp, 
  Brain, Heart, Shield, Clock, FileText, ChevronRight,Eye,
  AlertCircle, CheckCircle, Activity
} from 'lucide-react'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export default function ShareTokenPage() {
  const params = useParams()
  const token = params.token as string
  const qrRef = useRef<HTMLDivElement>(null)
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (token) {
      loadSummary()
    }
  }, [token])

  const loadSummary = async () => {
    try {
      const response = await getClinicianSummary(token)
      setSummary(response.data)
    } catch (err: any) {
      setError(err.message || 'Failed to load clinical summary')
    } finally {
      setLoading(false)
    }
  }

  const downloadQRCode = async () => {
    if (!qrRef.current) return
    
    setDownloading(true)
    try {
      const canvas = await html2canvas(qrRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: qrRef.current.offsetWidth,
        height: qrRef.current.offsetHeight,
      })

      const link = document.createElement('a')
      link.download = `althos-patient-${summary?.patient_alias || 'summary'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setDownloading(false)
    }
  }

  const downloadData = () => {
    if (!summary) return

    const dataStr = JSON.stringify(summary, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `althos-patient-data-${summary.patient_alias}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  if (loading) {
    return (
      <div className={`${montserrat.className} min-h-screen bg-gradient-to-br from-[#FFEDFA] to-[#FFB8E0]/20 flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-[#EC7FA9]/30 border-t-[#EC7FA9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#BE5985]/70 font-medium">Loading clinical summary...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${montserrat.className} min-h-screen bg-gradient-to-br from-[#FFEDFA] to-[#FFB8E0]/20 flex items-center justify-center`}>
        <div className="max-w-md mx-auto text-center p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-red-200 shadow-xl shadow-red-100/50">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">Access Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <p className="text-red-500 text-sm">This link may have expired or been revoked.</p>
        </div>
      </div>
    )
  }

  const shareUrl = `${window.location.origin}/share/${token}`

  return (
    <div className={`${montserrat.className} min-h-screen bg-gradient-to-br from-[#FFEDFA] via-white to-[#FFB8E0]/10`}>
      {/* Floating background elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-[#FFB8E0]/10 to-[#EC7FA9]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-br from-[#FFEDFA]/30 to-[#BE5985]/5 rounded-full blur-2xl animate-pulse" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#EC7FA9] to-[#BE5985] shadow-lg shadow-[#EC7FA9]/30">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-[#BE5985]">Clinical Summary</h1>
          </div>
          <p className="text-[#BE5985]/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Secure patient wellness data summary for healthcare professionals
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* QR Code Section */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <div 
                ref={qrRef}
                className="p-8 rounded-3xl bg-white shadow-2xl shadow-[#FFB8E0]/20 border border-[#FFB8E0]/30 relative overflow-hidden"
              >
                {/* QR Code Template Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <Heart className="h-6 w-6 text-[#EC7FA9]" />
                    <span className="text-2xl font-bold text-[#BE5985]">Althos</span>
                  </div>
                  <p className="text-[#BE5985]/70 font-medium">Patient Wellness Summary</p>
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-6 p-6 rounded-2xl bg-[#FFEDFA]/30">
                  <QRCodeCanvas
                    value={shareUrl}
                    size={200}
                    level="H"
                    includeMargin
                    bgColor="#FFFFFF"
                    fgColor="#BE5985"
                  />
                </div>

                {/* Patient Info */}
                <div className="text-center space-y-2 mb-6">
                  <h3 className="text-lg font-semibold text-[#BE5985]">
                    {summary.patient_alias}
                  </h3>
                  <p className="text-[#BE5985]/60 text-sm">
                    Period: {summary.period.from} to {summary.period.to}
                  </p>
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#FFB8E0]/40 text-[#BE5985] rounded-full text-xs font-medium">
                    <Eye className="h-3 w-3" />
                    <span>Viewed {summary.access_count} times</span>
                  </div>
                </div>

                {/* Download Actions */}
                <div className="space-y-3">
                  <button
                    onClick={downloadQRCode}
                    disabled={downloading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] text-white font-semibold rounded-2xl shadow-lg shadow-[#EC7FA9]/30 hover:shadow-xl hover:shadow-[#EC7FA9]/40 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
                  >
                    <Download className="h-4 w-4" />
                    {downloading ? 'Downloading...' : 'Download QR Card (PNG)'}
                  </button>
                  
                  <button
                    onClick={downloadData}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-[#FFB8E0]/40 text-[#BE5985] font-semibold rounded-2xl hover:bg-[#FFEDFA]/20 hover:border-[#EC7FA9]/50 transition-all duration-300"
                  >
                    <FileText className="h-4 w-4" />
                    Download Data (JSON)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Summary */}
          <div className="xl:col-span-2 space-y-6">
            {/* Patient Overview */}
            <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#FFB8E0]/20 to-[#EC7FA9]/10 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <User className="h-6 w-6 text-[#EC7FA9]" />
                  <h2 className="text-2xl font-bold text-[#BE5985]">Patient Overview</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-2xl bg-[#FFEDFA]/40">
                    <Calendar className="h-8 w-8 text-[#EC7FA9] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[#BE5985] mb-1">
                      {summary.period.window_days || 30}
                    </div>
                    <div className="text-sm text-[#BE5985]/70">Days of Data</div>
                  </div>

                  <div className="text-center p-4 rounded-2xl bg-[#FFEDFA]/40">
                    <Activity className="h-8 w-8 text-[#EC7FA9] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[#BE5985] mb-1">
                      {summary.summary?.scores?.total_entries || 0}
                    </div>
                    <div className="text-sm text-[#BE5985]/70">Total Entries</div>
                  </div>

                  <div className="text-center p-4 rounded-2xl bg-[#FFEDFA]/40">
                    <Clock className="h-8 w-8 text-[#EC7FA9] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[#BE5985] mb-1">
                      {new Date(summary.generated_at).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-[#BE5985]/70">Generated</div>
                  </div>
                </div>
              </div>
            </div>

            {/* SOAP Notes */}
            <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-6 w-6 text-[#EC7FA9]" />
                <h2 className="text-2xl font-bold text-[#BE5985]">Clinical Notes</h2>
              </div>

              <div className="prose prose-pink max-w-none">
                <div className="whitespace-pre-wrap text-[#BE5985]/80 leading-relaxed">
                  {summary.summary.soap_text}
                </div>
              </div>
            </div>

            {/* Wellness Trends */}
            {summary.summary.trends && (
              <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#FFB8E0]/40 shadow-xl shadow-[#FFB8E0]/20">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="h-6 w-6 text-[#EC7FA9]" />
                  <h2 className="text-2xl font-bold text-[#BE5985]">Wellness Patterns</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-800">Mood Patterns</h3>
                    </div>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      {summary.summary.trends.mood_pattern}
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-green-800">Risk Indicators</h3>
                    </div>
                    {summary.summary.trends.risk_indicators.length > 0 ? (
                      <ul className="space-y-1">
                        {summary.summary.trends.risk_indicators.map((indicator: string, index: number) => (
                          <li key={index} className="text-green-700 text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                            {indicator}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex items-center gap-2 text-green-700 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        <span>No significant risk indicators identified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-2 text-[#BE5985]/60 text-sm">
                <Shield className="h-4 w-4" />
                <span>Confidential medical information • Generated by Althos AI</span>
              </div>
              <p className="text-[#BE5985]/50 text-xs mt-2">
                This summary is based on self-reported data and screening tools. 
                Professional clinical assessment is recommended.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
