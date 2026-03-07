'use client'

import { useState } from 'react'

// Components
import { StepTransition, LeadStep, QualificacaoStep, PlanoStep } from './components'

export default function WelcomePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [formData, setFormData] = useState({
    lead: {
      fullName: '',
      whatsapp: '',
      email: ''
    },
    qualificacao: {
      tipoOperacao: '',
      estruturaAtendimento: '',
      tipoAtendimento: '',
      volumeClientes: '',
      quantidadeUnidades: ''
    }
  })

  const steps = ['Lead', 'Qualificação', 'Plano', 'Pagamento', 'Conteúdo']

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection('forward')
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection('backward')
      setCurrentStep(prev => prev - 1)
    }
  }

  const updateFormData = (step: 'lead' | 'qualificacao', data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: data
    }))
  }

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Progress Indicator */}
      <div className="px-4 pt-8 pb-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Etapa {currentStep + 1} de {steps.length}</span>
            <span className="text-sm font-medium text-gray-900">{steps[currentStep]}</span>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center space-x-2">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    index === currentStep
                      ? 'bg-[#8609A3] text-white'
                      : index < currentStep
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {index < currentStep ? '✓' : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 h-0.5 mx-2 ${
                      index < currentStep ? 'bg-[#8609A3]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Step Labels */}
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <span
                key={step}
                className={`text-xs ${
                  index === currentStep
                    ? 'text-[#8609A3] font-medium'
                    : index < currentStep
                    ? 'text-purple-800'
                    : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content with Transition */}
      <div className="flex-1 px-4 pb-8 relative">
        <div className="max-w-md mx-auto">
          {/* Lead Step */}
          <StepTransition isActive={currentStep === 0} direction={direction}>
            <LeadStep
              data={formData.lead}
              onNext={handleNext}
              onUpdate={(data) => updateFormData('lead', data)}
            />
          </StepTransition>

          {/* Qualificação Step */}
          <StepTransition isActive={currentStep === 1} direction={direction}>
            <QualificacaoStep
              data={formData.qualificacao}
              onNext={handleNext}
              onBack={handleBack}
              onUpdate={(data) => updateFormData('qualificacao', data)}
            />
          </StepTransition>

          {/* Plano Step */}
          <StepTransition isActive={currentStep === 2} direction={direction}>
            <PlanoStep
              data={formData.qualificacao}
              onNext={handleNext}
              onBack={handleBack}
            />
          </StepTransition>

          {/* Future steps can be added here */}
        </div>
      </div>
    </div>
  )
}
