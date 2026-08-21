import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Briefcase, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useCitizenProfile } from '../hooks/useCitizenProfile';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { saveProfile, isSaving } = useCitizenProfile();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [fullName, setFullName] = useState('Arjun Kumar');
  const [age, setAge] = useState<number | ''>(21);
  const [gender, setGender] = useState('MALE');
  const [state, setState] = useState('Karnataka');
  const [district, setDistrict] = useState('Bengaluru Urban');
  const [occupation, setOccupation] = useState('Student');
  const [annualIncome, setAnnualIncome] = useState<number | ''>(240000);
  const [familySize, setFamilySize] = useState<number | ''>(4);
  const [isStudent, setIsStudent] = useState(true);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (age === '' || age < 1 || age > 120) newErrors.age = 'Enter a valid age between 1 and 120';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!state.trim()) newErrors.state = 'State is required';
    if (!district.trim()) newErrors.district = 'District is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (annualIncome === '' || annualIncome < 0) newErrors.annualIncome = 'Enter a valid annual income';
    if (familySize === '' || familySize < 1) newErrors.familySize = 'Family size must be at least 1';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    await saveProfile({
      fullName,
      age: Number(age),
      gender,
      state,
      district,
      occupation,
      annualFamilyIncome: Number(annualIncome),
      casteCategory: 'GENERAL',
      landOwnershipHectares: 0,
      familySize: Number(familySize),
      isStudent,
      educationLevel: 'UNDERGRADUATE',
    });

    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-100">Citizen Profile Onboarding</h1>
        <p className="text-sm text-zinc-400">
          CBIP evaluates eligibility against official scheme criteria using your verified profile attributes.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between text-xs">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-400 font-medium' : 'text-zinc-500'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs font-mono-code ${step >= 1 ? 'bg-blue-600/20 border-blue-500' : 'border-zinc-700'}`}>
            1
          </div>
          <span>Basic Info</span>
        </div>
        <div className="h-px bg-zinc-800 flex-1 mx-3" />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-400 font-medium' : 'text-zinc-500'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs font-mono-code ${step >= 2 ? 'bg-blue-600/20 border-blue-500' : 'border-zinc-700'}`}>
            2
          </div>
          <span>Location</span>
        </div>
        <div className="h-px bg-zinc-800 flex-1 mx-3" />
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-400 font-medium' : 'text-zinc-500'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs font-mono-code ${step >= 3 ? 'bg-blue-600/20 border-blue-500' : 'border-zinc-700'}`}>
            3
          </div>
          <span>Background</span>
        </div>
      </div>

      {/* Form Card */}
      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200 pb-2 border-b border-zinc-800">
                <User className="w-4 h-4 text-blue-400" />
                <span>Step 1: Personal Information</span>
              </div>

              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={errors.fullName}
                placeholder="Enter citizen full name"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  error={errors.age}
                  placeholder="21"
                />

                <Select
                  label="Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  options={[
                    { value: 'MALE', label: 'Male' },
                    { value: 'FEMALE', label: 'Female' },
                    { value: 'TRANSGENDER', label: 'Transgender' },
                  ]}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200 pb-2 border-b border-zinc-800">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Step 2: Domicile & Location</span>
              </div>

              <Select
                label="State of Domicile"
                value={state}
                onChange={(e) => setState(e.target.value)}
                error={errors.state}
                options={[
                  { value: 'Karnataka', label: 'Karnataka' },
                  { value: 'Tamil Nadu', label: 'Tamil Nadu' },
                  { value: 'Maharashtra', label: 'Maharashtra' },
                  { value: 'Delhi', label: 'Delhi' },
                ]}
              />

              <Input
                label="District"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                error={errors.district}
                placeholder="Bengaluru Urban"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200 pb-2 border-b border-zinc-800">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>Step 3: Socio-Economic Profile</span>
              </div>

              <Input
                label="Occupation"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="Student / Farmer / Worker"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Annual Family Income (INR)"
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value === '' ? '' : Number(e.target.value))}
                  error={errors.annualIncome}
                  placeholder="240000"
                />

                <Input
                  label="Family Size"
                  type="number"
                  value={familySize}
                  onChange={(e) => setFamilySize(e.target.value === '' ? '' : Number(e.target.value))}
                  error={errors.familySize}
                  placeholder="4"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="studentCheckbox"
                  checked={isStudent}
                  onChange={(e) => setIsStudent(e.target.checked)}
                  className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="studentCheckbox" className="text-xs text-zinc-300">
                  Currently enrolled as a student in an educational institution
                </label>
              </div>
            </div>
          )}

          {/* Nav Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={handleBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button type="button" variant="primary" onClick={handleNext} className="gap-2">
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button type="submit" variant="primary" disabled={isSaving} className="gap-2 bg-emerald-600 hover:bg-emerald-500">
                <CheckCircle className="w-4 h-4" />
                <span>{isSaving ? 'Saving Profile...' : 'Complete Profile & View Dashboard'}</span>
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};
