'use client'

import { useState } from 'react'
import StepTransition from './components/StepTransition'
import LeadStep from './components/LeadStep'
import VinculoStep from './components/VinculoStep'
import QualificacaoStep from './components/QualificacaoStep'
import PlanoStep from './components/PlanoStep'
import PaymentStep from './components/PaymentStep'
import React from 'react'

export default function WelcomePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [linkPayment, setLinkPayment] = useState<string>('');
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [formData, setFormData] = useState({
    brand: {
      brandName: ''
    },
    vinculo: {
      tipoVinculo: ''
    },
    qualificacao: {
      tipoOperacao: '',
      estruturaAtendimento: '',
      tipoAtendimento: '',
      volumeClientes: '',
      quantidadeUnidades: '',
      linkRedirect: '',
      cupom: ''
    },
    plano: {
      nome: '',
      preco: '',
      precoComDesconto: 0
    },
  })

  const steps = ['Marca', 'Vínculo', 'Qualificação', 'Plano', 'Pagamento']

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

  const updateFormData = (step: 'brand' | 'vinculo' | 'qualificacao' | 'plano', data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: data
    }))
  }

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Progress Indicator */}
      <div className="px-2 sm:px-4 pt-6 sm:pt-8 pb-4 sm:pb-6">
        <div className="max-w-md mx-auto">
          
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between space-x-1 sm:space-x-2 overflow-x-auto">
            {steps.map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center flex-shrink-0 min-w-0">
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      index === currentStep
                        ? 'bg-[#8609A3] text-white'
                        : index < currentStep
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {index < currentStep ? '✓' : index + 1}
                  </div>
                  <span
                    className={`mt-1 text-center text-xs sm:text-xs leading-tight whitespace-nowrap ${
                      index === currentStep
                        ? 'text-[#8609A3] font-medium'
                        : index < currentStep
                        ? 'text-purple-800'
                        : 'text-gray-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-shrink-0 w-4 sm:w-8 h-0.5 mt-3 sm:mt-4 ${
                      index < currentStep ? 'bg-[#8609A3]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="flex w-full sm:flex-row sm:items-center sm:justify-center gap-2 sm:gap-0 mb-2 mt-5">
            <span className="text-xs sm:text-sm text-gray-600 w-full text-center">Etapa {currentStep + 1} de {steps.length}</span>
          </div>

        </div>
      </div>

      {/* Form Content with Transition */}
      <div className="flex-1 px-2 sm:px-4 pb-4 sm:pb-8 relative">
        <div className="max-w-md mx-auto">
          {/* Lead Step */}
          <StepTransition isActive={currentStep === 0} direction={direction}>
            <LeadStep
              data={formData.brand}
              onNext={handleNext}
              onUpdate={(data) => updateFormData('brand', data)}
            />
          </StepTransition>

          {/* Vínculo Step */}
          <StepTransition isActive={currentStep === 1} direction={direction}>
            <VinculoStep
              data={formData.vinculo}
              brandName={formData.brand.brandName}
              onNext={handleNext}
              onBack={handleBack}
              onUpdate={(data) => updateFormData('vinculo', data)}
            />
          </StepTransition>

          {/* Qualificação Step */}
          <StepTransition isActive={currentStep === 2} direction={direction}>
            <QualificacaoStep
              data={formData.qualificacao}
              onNext={handleNext}
              onBack={handleBack}
              onUpdate={(data) => updateFormData('qualificacao', data)}
            />
          </StepTransition>

          {/* Plano Step */}
          <StepTransition isActive={currentStep === 3} direction={direction}>
            <PlanoStep
              data={formData.qualificacao}
              onNext={handleNext}
              onBack={handleBack}
              leadData={formData.brand}
              setData={setFormData}
              setLinkPayment={setLinkPayment}
              setPlanoData={(plano) => updateFormData('plano', plano)}
            />
          </StepTransition>

          {/* Payment Step */}
          <StepTransition isActive={currentStep === 4} direction={direction}>
            <></>
            <PaymentStep
              data={formData.qualificacao}
              plano={formData.plano}
              onNext={handleNext}
              onBack={handleBack}
              isActive={currentStep === 4}
              linkPayment={linkPayment}
            />
          </StepTransition>

          {/* Future steps can be added here */}
        </div>
      </div>
    </div>
  )
}
