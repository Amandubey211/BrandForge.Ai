// src/app/Components/animations/Stepper.tsx
'use client';

import React, { useState, Children, useRef, HTMLAttributes, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// --- PROPS INTERFACE ---
interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  brandColor: string; // Dynamic color for theming
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  backButtonText?: string;
  nextButtonText?: string;
  isNextDisabled?: boolean; // Prop to control the next button
}

// --- MAIN STEPPER COMPONENT ---
export default function Stepper({
  children,
  brandColor,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  backButtonText = 'Back',
  nextButtonText = 'Continue',
  isNextDisabled = false, // Destructure with a default value
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [direction, setDirection] = useState<number>(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isLastStep = currentStep === totalSteps;

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
      onStepChange(currentStep + 1);
    }
  };
  
  const handleComplete = () => {
    setDirection(1);
    onFinalStepCompleted();
  };
  
  return (
    <div className="w-full" {...rest}>
      {/* Step Indicators */}
      <div className="flex w-full items-center p-4">
        {stepsArray.map((_, index) => {
          const stepNumber = index + 1;
          return (
            <React.Fragment key={stepNumber}>
              <StepIndicator step={stepNumber} currentStep={currentStep} brandColor={brandColor} />
              {index < totalSteps - 1 && <StepConnector isComplete={currentStep > stepNumber} brandColor={brandColor} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      <StepContentWrapper currentStep={currentStep} direction={direction}>
        {stepsArray[currentStep - 1]}
      </StepContentWrapper>

      {/* Footer Buttons */}
      <div className="px-4 pt-4">
        <div className={`mt-6 flex ${currentStep > 1 ? 'justify-between' : 'justify-end'}`}>
          {currentStep > 1 && (
            <button onClick={() => { setDirection(-1); setCurrentStep(currentStep - 1); }}
              className="rounded px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900">
              {backButtonText}
            </button>
          )}
          <button
            onClick={isLastStep ? handleComplete : handleNext}
            disabled={isNextDisabled} // Disable logic
            className="flex items-center justify-center rounded-md py-2 px-4 font-medium tracking-tight text-white transition hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: brandColor }}
          >
            {isLastStep ? 'Generate' : nextButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- CHILD COMPONENTS (Stylized and Themed) ---

export function Step({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

function StepIndicator({ step, currentStep, brandColor }: { step: number; currentStep: number; brandColor: string; }) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';
  return (
    <motion.div animate={status} className="relative outline-none">
      <motion.div
        variants={{
          inactive: { scale: 1, backgroundColor: '#e2e8f0', color: '#64748b' },
          active: { scale: 1.1, backgroundColor: brandColor, color: '#ffffff' },
          complete: { scale: 1, backgroundColor: brandColor, color: '#ffffff' }
        }}
        transition={{ duration: 0.3 }}
        className="flex h-8 w-8 items-center justify-center rounded-full font-semibold border-2"
        style={{ borderColor: status === 'active' ? brandColor : 'transparent' }}
      >
        {status === 'complete' ? <CheckIcon className="h-5 w-5 text-white" /> : <span className="text-sm">{step}</span>}
      </motion.div>
    </motion.div>
  );
}

function StepConnector({ isComplete, brandColor }: { isComplete: boolean; brandColor: string; }) {
  return (
    <div className="relative mx-2 h-0.5 flex-1 rounded bg-slate-200">
      <motion.div
        className="absolute left-0 top-0 h-full"
        initial={false}
        animate={{ width: isComplete ? '100%' : '0%' }}
        transition={{ duration: 0.4 }}
        style={{ backgroundColor: brandColor }}
      />
    </div>
  );
}

// --- ANIMATION WRAPPERS (Logic Mostly Unchanged) ---

const stepVariants: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: '0%', opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

function StepContentWrapper({ currentStep, direction, children }: { currentStep: number; direction: number; children: ReactNode; }) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | 'auto'>('auto');

  return (
    <motion.div 
      style={{ position: 'relative', height }} 
      animate={{ height }} 
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentStep}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ position: height === 'auto' ? 'relative' : 'absolute', top: 0, left: 0, right: 0 }}
          onAnimationStart={() => {
            if (ref.current) setHeight(ref.current.offsetHeight);
          }}
          onAnimationComplete={() => setHeight('auto')}
          ref={ref}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
      <motion.path 
        initial={{ pathLength: 0 }} 
        animate={{ pathLength: 1 }} 
        transition={{ delay: 0.1, type: 'tween', ease: 'easeOut', duration: 0.3 }} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M5 13l4 4L19 7" 
      />
    </svg>
  );
}