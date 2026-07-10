import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomerRegistrationWizard() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    legalName: '',
    tradeName: '',
    email: '',
    phone: '',
    profile: { companyType: 'Corporate', industry: '', gstNumber: '', panNumber: '' },
    address: { addressLine1: '', city: '', state: '', country: '', zipCode: '' },
    contact: { firstName: '', lastName: '', email: '', phone: '' }
  });
  const [error, setError] = useState("");

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/customer-portal/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      navigate('/customer/directory');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customer Registration</h1>
        <p className="text-muted-foreground">Onboard a new corporate entity into the ecosystem.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
        <div className={`absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 -translate-y-1/2 transition-all duration-300`} style={{ width: `${((step-1)/3)*100}%` }}></div>
        
        {[1, 2, 3, 4].map(num => (
          <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 ${step >= num ? 'bg-blue-600 border-blue-200 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
            {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Company Information"}
            {step === 2 && "Primary Contact"}
            {step === 3 && "Registered Address"}
            {step === 4 && "Review & Submit"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Legal Name *</label><input type="text" className="w-full border p-2 rounded mt-1" value={formData.legalName} onChange={e => setFormData({...formData, legalName: e.target.value})} /></div>
              <div><label className="text-sm font-medium">Trade Name</label><input type="text" className="w-full border p-2 rounded mt-1" value={formData.tradeName} onChange={e => setFormData({...formData, tradeName: e.target.value})} /></div>
              <div><label className="text-sm font-medium">Official Email *</label><input type="email" className="w-full border p-2 rounded mt-1" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
              <div><label className="text-sm font-medium">Official Phone *</label><input type="text" className="w-full border p-2 rounded mt-1" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
              <div><label className="text-sm font-medium">GST Number</label><input type="text" className="w-full border p-2 rounded mt-1" value={formData.profile.gstNumber} onChange={e => setFormData({...formData, profile: {...formData.profile, gstNumber: e.target.value}})} /></div>
              <div><label className="text-sm font-medium">PAN Number</label><input type="text" className="w-full border p-2 rounded mt-1" value={formData.profile.panNumber} onChange={e => setFormData({...formData, profile: {...formData.profile, panNumber: e.target.value}})} /></div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">First Name</label><input type="text" className="w-full border p-2 rounded mt-1" value={formData.contact.firstName} onChange={e => setFormData({...formData, contact: {...formData.contact, firstName: e.target.value}})} /></div>
              <div><label className="text-sm font-medium">Last Name</label><input type="text" className="w-full border p-2 rounded mt-1" value={formData.contact.lastName} onChange={e => setFormData({...formData, contact: {...formData.contact, lastName: e.target.value}})} /></div>
              <div><label className="text-sm font-medium">Direct Email</label><input type="email" className="w-full border p-2 rounded mt-1" value={formData.contact.email} onChange={e => setFormData({...formData, contact: {...formData.contact, email: e.target.value}})} /></div>
              <div><label className="text-sm font-medium">Direct Phone</label><input type="text" className="w-full border p-2 rounded mt-1" value={formData.contact.phone} onChange={e => setFormData({...formData, contact: {...formData.contact, phone: e.target.value}})} /></div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><label className="text-sm font-medium">Address Line 1</label><input type="text" className="w-full border p-2 rounded mt-1" value={formData.address.addressLine1} onChange={e => setFormData({...formData, address: {...formData.address, addressLine1: e.target.value}})} /></div>
              <div><label className="text-sm font-medium">City</label><input type="text" className="w-full border p-2 rounded mt-1" value={formData.address.city} onChange={e => setFormData({...formData, address: {...formData.address, city: e.target.value}})} /></div>
              <div><label className="text-sm font-medium">State</label><input type="text" className="w-full border p-2 rounded mt-1" value={formData.address.state} onChange={e => setFormData({...formData, address: {...formData.address, state: e.target.value}})} /></div>
              <div><label className="text-sm font-medium">Country</label><input type="text" className="w-full border p-2 rounded mt-1" value={formData.address.country} onChange={e => setFormData({...formData, address: {...formData.address, country: e.target.value}})} /></div>
              <div><label className="text-sm font-medium">Zip Code</label><input type="text" className="w-full border p-2 rounded mt-1" value={formData.address.zipCode} onChange={e => setFormData({...formData, address: {...formData.address, zipCode: e.target.value}})} /></div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Please review the corporate details before submission. Upon submission, a compliance record will be instantiated and the profile will enter <strong>Pending Approval</strong> state.</p>
              <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                <div><span className="font-semibold block">Legal Name:</span> {formData.legalName}</div>
                <div><span className="font-semibold block">GST Number:</span> {formData.profile.gstNumber || 'N/A'}</div>
                <div><span className="font-semibold block">Primary Contact:</span> {formData.contact.firstName} {formData.contact.lastName}</div>
                <div><span className="font-semibold block">Location:</span> {formData.address.city}, {formData.address.country}</div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6 border-t mt-6">
            <button disabled={step === 1} onClick={handleBack} className="px-4 py-2 border rounded-md disabled:opacity-50">Back</button>
            {step < 4 ? (
              <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700">Next Step <ChevronRight className="w-4 h-4" /></button>
            ) : (
              <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-2 rounded-md font-bold hover:bg-green-700 shadow-lg">Submit Registration</button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
